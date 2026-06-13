import { BaseAIProvider } from './baseProvider';
import { AIProviderConfig, AIMessage, AICompletionOptions, AICompletionResponse, AIStreamChunk } from './types';

export class OpenRouterProvider extends BaseAIProvider {
  private apiKey: string;
  private baseURL: string;

  constructor(config: AIProviderConfig) {
    super(config);
    this.apiKey = config.apiKey;
    this.baseURL = config.baseURL || 'https://openrouter.ai/api/v1';
  }

  async complete(messages: AIMessage[], options: AICompletionOptions = {}): Promise<AICompletionResponse> {
    try {
      // We'll use fetch API for OpenRouter since it's REST-based
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': 'https://your-portfolio-site.com', // Optional, for rankings
          'X-Title': 'Portfolio AI Assistant' // Optional, for rankings
        },
        body: JSON.stringify({
          model: options.model || 'anthropic/claude-3.5-sonnet',
          messages: this.formatMessages(messages),
          temperature: options.temperature ?? 0.7,
          max_tokens: options.maxTokens,
          top_p: options.topP,
          frequency_penalty: options.frequencyPenalty,
          presence_penalty: options.presencePenalty,
          stream: false,
        })
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const choice = data.choices[0];

      return {
        id: data.id,
        object: data.object,
        created: data.created,
        model: data.model,
        choices: [{
          index: choice.index,
          message: {
            role: 'assistant',
            content: choice.message.content
          },
          finish_reason: choice.finish_reason
        }],
        usage: {
          promptTokens: data.usage.prompt_tokens,
          completionTokens: data.usage.completion_tokens,
          totalTokens: data.usage.total_tokens
        }
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  async *streamComplete(messages: AIMessage[], options: AICompletionOptions = {}): AsyncIterable<AIStreamChunk> {
    try {
      const controller = new AbortController();
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'HTTP-Referer': 'https://your-portfolio-site.com',
          'X-Title': 'Portfolio AI Assistant'
        },
        body: JSON.stringify({
          model: options.model || 'anthropic/claude-3.5-sonnet',
          messages: this.formatMessages(messages),
          temperature: options.temperature ?? 0.7,
          max_tokens: options.maxTokens,
          top_p: options.topP,
          frequency_penalty: options.frequencyPenalty,
          presence_penalty: options.presencePenalty,
          stream: true,
        }),
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Failed to get response body reader');
      }

      const decoder = new TextDecoder();
      let buffer = '';
      let index = 0;

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          let lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(5);
              if (data === '[DONE]') {
                // Send final chunk
                yield {
                  id: `openrouter-chunk-${index++}`,
                  object: 'chat.completion.chunk',
                  created: Date.now(),
                  model: options.model || 'anthropic/claude-3.5-sonnet',
                  choices: [{
                    index: 0,
                    delta: {},
                    finish_reason: 'stop'
                  }]
                };
                return;
              }

              try {
                const parsed = JSON.parse(data);
                const choice = parsed.choices[0];
                yield {
                  id: parsed.id || `openrouter-chunk-${index++}`,
                  object: parsed.object || 'chat.completion.chunk',
                  created: parsed.created || Date.now(),
                  model: parsed.model || '',
                  choices: [{
                    index: choice.index,
                    delta: {
                      content: choice.delta.content || undefined,
                      role: choice.delta.role || undefined
                    },
                    finish_reason: choice.finish_reason
                  }]
                };
              } catch (e) {
                // Skip invalid JSON lines
                continue;
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  getProviderName(): string {
    return 'openrouter';
  }

  getSupportedModels(): string[] {
    return [
      // OpenRouter provides access to many models, listing some popular ones
      'anthropic/claude-3.5-sonnet',
      'anthropic/claude-3-opus',
      'openai/gpt-4o',
      'openai/gpt-4-turbo',
      'openai/gpt-3.5-turbo',
      'google/gemini-pro-1.5',
      'meta-llama/llama-3-70b-instruct',
      'mistralai/mixtral-8x7b-instruct'
    ];
  }
}