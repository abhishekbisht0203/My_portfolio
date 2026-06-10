import { defineConfig } from "eslint/config";

export default defineConfig({
  extends: [
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@next/next/recommended',
    'plugin:@next/next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: ['import', 'react', 'jsx-a11y'],
  ignorePatterns: [
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ],
});
