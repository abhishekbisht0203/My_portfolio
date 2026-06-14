import { PrismaClient } from '@prisma/client';

// Detect obviously placeholder/templated DATABASE_URL values so we don't
// attempt to connect to an unauthenticated/placeholder database during
// local development. You can override behavior with `USE_MOCK_DB=1`.
const placeholderRegex = /\[?YOUR-?PASSWORD\]?/i;
const databaseUrl = process.env.DATABASE_URL?.trim() ?? '';
const forceMock = process.env.USE_MOCK_DB === '1' || process.env.USE_MOCK_DB === 'true';

const shouldUsePrisma = Boolean(databaseUrl) && !placeholderRegex.test(databaseUrl) && !forceMock;

const globalForPrisma = global as any;

let prisma: any;

async function hasRequiredAiTables(client: PrismaClient) {
  const result = await client.$queryRaw<Array<{ user_conversation: string | null; message: string | null }>>`
    SELECT
      to_regclass('public."UserConversation"') AS user_conversation,
      to_regclass('public."Message"') AS message
  `;

  const row = result[0];
  return Boolean(row?.user_conversation && row?.message);
}

function shouldDisablePrismaAfterError(err: unknown) {
  const error = err as { code?: string; message?: string };
  return (
    error?.code === 'P2021' ||
    error?.code === 'P2022' ||
    error?.message?.includes('does not exist in the current database') ||
    error?.message?.includes('relation') && error?.message?.includes('does not exist')
  );
}

if (shouldUsePrisma) {
  // Use a single shared PrismaClient instance when possible
  const rawPrisma = globalForPrisma.__raw_prisma_client__ || new PrismaClient();
  globalForPrisma.__raw_prisma_client__ = rawPrisma;

  // Track connection state on the global so multiple modules can observe it
  if (typeof globalForPrisma.__prisma_connected__ === 'undefined') {
    globalForPrisma.__prisma_connected__ = undefined; // undefined => connecting/unknown

    // Attempt a one-time connect; if it fails, mark as disconnected so
    // runtime code can avoid attempting DB operations repeatedly.
    (async () => {
      try {
        await rawPrisma.$connect();
        const schemaReady = await hasRequiredAiTables(rawPrisma);
        globalForPrisma.__prisma_connected__ = schemaReady;
        if (schemaReady) {
          console.log('Prisma: connected to database');
        } else {
          console.warn('Prisma schema missing required AI tables. Using mock DB fallbacks.');
        }
      } catch (err) {
        globalForPrisma.__prisma_connected__ = false;
        console.warn('Prisma: connection failed — falling back to mock DB where available.');
        // Keep the raw client around but avoid letting callers trigger
        // further network attempts; proxies below will throw a clear error.
      }
    })();
  }

  // Proxy access to model properties so that when the client is not
  // connected we return functions that immediately reject with a clear
  // error instead of triggering Prisma's internal connection logic.
  prisma = new Proxy(rawPrisma, {
    get(target, prop) {
      const propName = String(prop);
      // Allow internal Prisma helper methods through
      if (propName.startsWith('$') || propName === 'connect' || propName === 'disconnect' || propName === '$on' || propName === '$use') {
        // @ts-ignore
        return target[prop];
      }

      const connected = globalForPrisma.__prisma_connected__;
      if (connected) {
        // If connected, return the real property (model or method)
        // @ts-ignore
        const value = target[prop];

        if (typeof value !== 'object' || value === null) {
          return value;
        }

        return new Proxy(value, {
          get(modelTarget, modelProp) {
            // @ts-ignore
            const modelValue = modelTarget[modelProp];
            if (typeof modelValue !== 'function') {
              return modelValue;
            }

            return async (...args: any[]) => {
              try {
                return await modelValue.apply(modelTarget, args);
              } catch (err) {
                if (shouldDisablePrismaAfterError(err)) {
                  globalForPrisma.__prisma_connected__ = false;
                  console.warn('Prisma schema unavailable, switching to mock DB fallbacks.');
                }
                throw err;
              }
            };
          },
        });
      }

      // Not connected yet (or failed): return a model-proxy that rejects
      // any method invocation with a clear error message.
      return new Proxy(
        {},
        {
          get() {
            return async (..._args: any[]) => {
              throw new Error('Prisma not connected: database unavailable or credentials invalid.');
            };
          },
        }
      );
    },
  });

  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
} else {
  // Provide a lightweight fake prisma object so imports succeed but any
  // attempt to call into the database immediately rejects with a clear
  // error. This prevents Prisma from trying to authenticate with an
  // invalid connection string and lets existing try/catch fallbacks use
  // mock DB implementations instead.
  // Informational only: in local dev we prefer mock DB to noisy auth attempts.
  const reason = !databaseUrl
    ? 'DATABASE_URL not set'
    : placeholderRegex.test(databaseUrl)
    ? 'DATABASE_URL contains placeholder'
    : 'mock mode forced (USE_MOCK_DB)';
  if (process.env.NODE_ENV === 'production') {
    console.warn(`Prisma client disabled: ${reason}. Falling back to mock DB where available.`);
  } else {
    console.info(`Prisma disabled: ${reason}. Using mock DB fallbacks.`);
  }

  const createModelProxy = () =>
    new Proxy(
      {},
      {
        get() {
          return async (..._args: any[]) => {
            throw new Error('Prisma disabled: DATABASE_URL not configured or contains placeholder.');
          };
        },
      }
    );

  prisma = new Proxy(
    {},
    {
      get(_, model) {
        // Return a proxy representing the model (e.g. `prisma.userConversation`)
        return createModelProxy();
      },
    }
  );
}

export { prisma };
export const prismaEnabled = shouldUsePrisma;
export function isPrismaEnabled() {
  return Boolean(shouldUsePrisma && globalForPrisma.__prisma_connected__ === true);
}
