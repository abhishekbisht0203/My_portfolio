import { AIProviderConfig, AIProvider } from './types';
import { AIProvider as AIProviderEnum } from '@prisma/client';
import { OpenAIProvider } from './openaiProvider';
import { AnthropicProvider } from './anthropicProvider';
import { GoogleProvider } from './googleProvider';
import { GroqProvider } from './groqProvider';
import { OpenRouterProvider } from './openrouterProvider';

export class AIProviderFactory {
  static createProvider(provider: AIProviderEnum, config: AIProviderConfig): AIProvider {
    switch (provider) {
      case AIProviderEnum.OPENAI:
        return new OpenAIProvider(config);
      case AIProviderEnum.ANTHROPIC:
        return new AnthropicProvider(config);
      case AIProviderEnum.GOOGLE:
        return new GoogleProvider(config);
      case AIProviderEnum.GROQ:
        return new GroqProvider(config);
      case AIProviderEnum.OPENROUTER:
        return new OpenRouterProvider(config);
      default:
        throw new Error(`Unsupported AI provider: ${provider}`);
    }
  }

  static getProviderFromEnv(): AIProvider {
    const providerName = process.env.AI_PROVIDER?.toLowerCase() as AIProviderEnum || AIProviderEnum.OPENAI;

    let config: AIProviderConfig = {
      apiKey: ''
    };

    switch (providerName) {
      case AIProviderEnum.OPENAI:
        config.apiKey = process.env.OPENAI_API_KEY || '';
        config.organization = process.env.OPENAI_ORG_ID;
        break;
      case AIProviderEnum.ANTHROPIC:
        config.apiKey = process.env.ANTHROPIC_API_KEY || '';
        break;
      case AIProviderEnum.GOOGLE:
        config.apiKey = process.env.GOOGLE_API_KEY || '';
        break;
      case AIProviderEnum.GROQ:
        config.apiKey = process.env.GROQ_API_KEY || '';
        break;
      case AIProviderEnum.OPENROUTER:
        config.apiKey = process.env.OPENROUTER_API_KEY || '';
        config.baseURL = process.env.OPENROUTER_BASE_URL;
        break;
    }

    if (!config.apiKey) {
      throw new Error(`API key not found for provider: ${providerName}`);
    }

    return this.createProvider(providerName, config);
  }
}