import { BaseAIProvider } from './baseProvider';
import { AIProviderConfig, AIMessage, AICompletionOptions, AICompletionResponse, AIStreamChunk } from './types';

export class OpenAIProvider extends BaseAIProvider {
  private apiKey: string;
  private baseURL: string | undefined;
  private organization: string | undefined;

  constructor(config: AIProviderConfig) {
    super(config);
    this.apiKey = config.apiKey;
    this.baseURL = config.baseURL;
    this.organization = config.organization;
  }

  async complete(messages: AIMessage[], options: AICompletionOptions = {}): Promise<AICompletionResponse> {
    try {
      const { default: OpenAI } = await import('openai');

      const openai = new OpenAI({
        apiKey: this.apiKey,
        baseURL: this.baseURL,
        organization: this.organization,
      });

      const response = await openai.chat.completions.create({
        model: options.model || 'gpt-3.5-turbo',
        messages: this.formatMessages(messages) as any,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens,
        top_p: options.topP,
        frequency_penalty: options.frequencyPenalty,
        presence_penalty: options.presencePenalty,
        stream: false,
      });

      const choice = response.choices[0];
      return {
        id: response.id,
        object: response.object,
        created: response.created,
        model: response.model,
        choices: [{
          index: choice.index,
          message: {
            role: 'assistant',
            content: choice.message.content || ''
          },
          finish_reason: choice.finish_reason
        }],
        usage: {
          promptTokens: response.usage?.prompt_tokens || 0,
          completionTokens: response.usage?.completion_tokens || 0,
          totalTokens: response.usage?.total_tokens || 0
        }
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async *streamComplete(messages: AIMessage[], options: AICompletionOptions = {}): AsyncIterable<AIStreamChunk> {
    try {
      const { default: OpenAI } = await import('openai');

      const openai = new OpenAI({
        apiKey: this.apiKey,
        baseURL: this.baseURL,
        organization: this.organization,
      });

      const stream = await openai.chat.completions.create({
        model: options.model || 'gpt-3.5-turbo',
        messages: this.formatMessages(messages) as any,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens,
        top_p: options.topP,
        frequency_penalty: options.frequencyPenalty,
        presence_penalty: options.presencePenalty,
        stream: true,
      });

      for await (const chunk of stream) {
        if (chunk.choices?.[0]?.delta) {
          yield {
            id: chunk.id || '',
            object: chunk.object || 'chat.completion.chunk',
            created: chunk.created || Date.now(),
            model: chunk.model || '',
            choices: [{
              index: chunk.choices[0].index || 0,
              delta: {
                content: chunk.choices[0].delta.content || undefined,
                role: chunk.choices[0].delta.role || undefined
              },
              finish_reason: chunk.choices[0].finish_reason || null
            }]
          };
        }
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  getProviderName(): string {
    return 'openai';
  }

  getSupportedModels(): string[] {
    return [
      'gpt-4o',
      'gpt-4o-mini',
      'gpt-4-turbo',
      'gpt-4',
      'gpt-3.5-turbo',
      'gpt-3.5-turbo-16k'
    ];
  }
}