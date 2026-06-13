export interface AIProviderConfig {
  apiKey: string;
  baseURL?: string;
  organization?: string;
}

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AICompletionOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
}

export interface AICompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: 'assistant';
      content: string;
    };
    finish_reason: string | null;
  }[];
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface AIStreamChunk {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    delta: {
      content?: string;
      role?: string;
    };
    finish_reason: string | null;
  }[];
}

export interface AIProvider {
  config: AIProviderConfig;

  complete(messages: AIMessage[], options?: AICompletionOptions): Promise<AICompletionResponse>;
  streamComplete(messages: AIMessage[], options?: AICompletionOptions): AsyncIterable<AIStreamChunk>;

  getProviderName(): string;
  getSupportedModels(): string[];
}