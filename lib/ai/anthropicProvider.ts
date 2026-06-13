import { BaseAIProvider } from './baseProvider';
import { AIProviderConfig, AIMessage, AICompletionOptions, AICompletionResponse, AIStreamChunk } from './types';

export class AnthropicProvider extends BaseAIProvider {
  private apiKey: string;

  constructor(config: AIProviderConfig) {
    super(config);
    this.apiKey = config.apiKey;
  }

  async complete(messages: AIMessage[], options: AICompletionOptions = {}): Promise<AICompletionResponse> {
    try {
      // Import anthropic dynamically
      const { Anthropic } = await import('@anthropic-ai/sdk');

      const anthropic = new Anthropic({
        apiKey: this.apiKey,
      });

      // Convert messages to Anthropic format
      const systemMessage = messages.find(m => m.role === 'system');
      const chatMessages = messages.filter(m => m.role !== 'system');

      const response = await anthropic.messages.create({
        model: options.model || 'claude-3-5-sonnet-20241022',
        max_tokens: options.maxTokens || 1024,
        temperature: options.temperature ?? 0.7,
        system: systemMessage?.content || '',
        messages: chatMessages.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        })),
        stream: false,
      });

      // Convert Anthropic response to our format
      return {
        id: response.id,
        object: 'chat.completion',
        created: Date.now(), // Anthropic doesn't return timestamp in same format
        model: response.model,
        choices: [{
          index: 0,
          message: {
            role: 'assistant',
            content: response.content[0].type === 'text' ? response.content[0].text : ''
          },
          finish_reason: response.stop_reason || null
        }],
        usage: {
          promptTokens: response.usage?.input_tokens || 0,
          completionTokens: response.usage?.output_tokens || 0,
          totalTokens: (response.usage?.input_tokens || 0) + (response.usage?.output_tokens || 0)
        }
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async *streamComplete(messages: AIMessage[], options: AICompletionOptions = {}): AsyncIterable<AIStreamChunk> {
    try {
      const { Anthropic } = await import('@anthropic-ai/sdk');

      const anthropic = new Anthropic({
        apiKey: this.apiKey,
      });

      // Convert messages to Anthropic format
      const systemMessage = messages.find(m => m.role === 'system');
      const chatMessages = messages.filter(m => m.role !== 'system');

      const stream = await anthropic.messages.create({
        model: options.model || 'claude-3-5-sonnet-20241022',
        max_tokens: options.maxTokens || 1024,
        temperature: options.temperature ?? 0.7,
        system: systemMessage?.content || '',
        messages: chatMessages.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        })),
        stream: true,
      });

      let index = 0;
      for await (const chunk of stream as any) {
        if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text') {
          yield {
            id: chunk.id || `chunk-${index++}`,
            object: 'chat.completion.chunk',
            created: Date.now(),
            model: chunk.model || '',
            choices: [{
              index: 0,
              delta: {
                content: chunk.delta.text,
                role: 'assistant'
              },
              finish_reason: null
            }]
          };
        } else if (chunk.type === 'message_stop') {
          yield {
            id: chunk.id || `chunk-${index++}`,
            object: 'chat.completion.chunk',
            created: Date.now(),
            model: chunk.model || '',
            choices: [{
              index: 0,
              delta: {},
              finish_reason: chunk.type === 'message_stop' ? 'stop' : null
            }]
          };
        }
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  getProviderName(): string {
    return 'anthropic';
  }

  getSupportedModels(): string[] {
    return [
      'claude-3-5-sonnet-20241022',
      'claude-3-5-haiku-20241022',
      'claude-3-opus-20240229',
      'claude-3-sonnet-20240229',
      'claude-2.1',
      'claude-2.0'
    ];
  }
}