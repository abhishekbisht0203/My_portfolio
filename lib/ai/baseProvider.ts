import { AIProvider, AIProviderConfig, AIMessage, AICompletionOptions, AICompletionResponse, AIStreamChunk } from './types';

export abstract class BaseAIProvider implements AIProvider {
  constructor(public config: AIProviderConfig) {}

  abstract complete(messages: AIMessage[], options?: AICompletionOptions): Promise<AICompletionResponse>;
  abstract streamComplete(messages: AIMessage[], options?: AICompletionOptions): AsyncIterable<AIStreamChunk>;

  abstract getProviderName(): string;
  abstract getSupportedModels(): string[];

  // Helper method to format messages for different providers
  protected formatMessages(messages: AIMessage[]): any {
    // Base implementation - providers can override if needed
    return messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
  }

  // Helper method to handle errors
  protected handleError(error: any): never {
    console.error(`AI Provider Error (${this.getProviderName()}):`, error);
    throw new Error(`AI service unavailable: ${error.message || 'Unknown error'}`);
  }
}