import { BaseAIProvider } from './baseProvider';
import { AIProviderConfig, AIMessage, AICompletionOptions, AICompletionResponse, AIStreamChunk } from './types';

export class GroqProvider extends BaseAIProvider {
  private apiKey: string;

  constructor(config: AIProviderConfig) {
    super(config);
    this.apiKey = config.apiKey;
  }

  async complete(messages: AIMessage[], options: AICompletionOptions = {}): Promise<AICompletionResponse> {
    try {
      // Import groq dynamically
      const { Groq } = await import('groq-sdk');

      const groq = new Groq({
        apiKey: this.apiKey,
      });

      const response = await groq.chat.completions.create({
        model: options.model || 'mixtral-8x7b-32768',
        messages: this.formatMessages(messages),
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens,
        top_p: options.topP,
        frequency_penalty: options.frequencyPenalty,
        presence_penalty: options.presencePenalty,
        stream: false,
      });

      const choice = response.choices[0];
      return {
        id: response.id || '',
        object: response.object || 'chat.completion',
        created: response.created || Date.now(),
        model: response.model || '',
        choices: [{
          index: choice.index || 0,
          message: {
            role: 'assistant',
            content: choice.message?.content || ''
          },
          finish_reason: choice.finish_reason || 'stop'
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
      const { Groq } = await import('groq-sdk');

      const groq = new Groq({
        apiKey: this.apiKey,
      });

      const stream = await groq.chat.completions.create({
        model: options.model || 'mixtral-8x7b-32768',
        messages: this.formatMessages(messages),
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens,
        top_p: options.topP,
        frequency_penalty: options.frequencyPenalty,
        presence_penalty: options.presencePenalty,
        stream: true,
      });

      let index = 0;
      for await (const chunk of stream as any) {
        const choice = chunk.choices[0];
        yield {
          id: chunk.id || '',
          object: chunk.object || 'chat.completion.chunk',
          created: chunk.created || Date.now(),
          model: chunk.model || '',
          choices: [{
            index: choice.index || 0,
            delta: {
              content: choice.delta?.content || undefined,
              role: choice.delta?.role || undefined
            },
            finish_reason: choice.finish_reason || null
          }]
        };
        index++;
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  getProviderName(): string {
    return 'groq';
  }

  getSupportedModels(): string[] {
    return [
      'mixtral-8x7b-32768',
      'llama2-70b-4096',
      'llama3-8b-8192',
      'llama3-70b-8192',
      'gemma-7b-it'
    ];
  }
}