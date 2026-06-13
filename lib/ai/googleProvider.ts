import { BaseAIProvider } from './baseProvider';
import { AIProviderConfig, AIMessage, AICompletionOptions, AICompletionResponse, AIStreamChunk } from './types';

export class GoogleProvider extends BaseAIProvider {
  private apiKey: string;

  constructor(config: AIProviderConfig) {
    super(config);
    this.apiKey = config.apiKey;
  }

  async complete(messages: AIMessage[], options: AICompletionOptions = {}): Promise<AICompletionResponse> {
    try {
      // Import Google AI dynamically
      const { GoogleGenerativeAI } = await import('@google/generative-ai');

      const genAI = new GoogleGenerativeAI(this.apiKey);
      const model = genAI.getGenerativeModel({ model: options.model || 'gemini-1.5-pro' });

      // Convert messages to Google AI format
      const chatHistory: any[] = [];
      let systemInstruction: string | undefined;

      for (const msg of messages) {
        if (msg.role === 'system') {
          systemInstruction = msg.content;
        } else {
          chatHistory.push({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
          });
        }
      }

      const generationConfig = {
        temperature: options.temperature ?? 0.7,
        topP: options.topP,
        maxOutputTokens: options.maxTokens,
      };

      if (systemInstruction) {
        // If there's a system instruction, we need to start a chat with it
        const modelWithConfig = genAI.getGenerativeModel({
          model: options.model || 'gemini-1.5-pro',
          systemInstruction,
          generationConfig
        });

        const chat = modelWithConfig.startChat({ history: chatHistory.slice(0, -1) });
        const lastMessage = chatHistory.slice(-1)[0];

        const result = await chat.sendMessage(lastMessage.parts[0].text);
        const response = result.response;

        return {
          id: `google-${Date.now()}`,
          object: 'chat.completion',
          created: Date.now(),
          model: options.model || 'gemini-1.5-pro',
          choices: [{
            index: 0,
            message: {
              role: 'assistant',
              content: response.text()
            },
            finish_reason: 'stop'
          }],
          usage: {
            promptTokens: 0, // Google AI doesn't always provide token counts in the same way
            completionTokens: 0,
            totalTokens: 0
          }
        };
      } else {
        const result = await model.generateContent(chatHistory.map(h => h.parts[0].text).join('\n'));
        const response = result.response;

        return {
          id: `google-${Date.now()}`,
          object: 'chat.completion',
          created: Date.now(),
          model: options.model || 'gemini-1.5-pro',
          choices: [{
            index: 0,
            message: {
              role: 'assistant',
              content: response.text()
            },
            finish_reason: 'stop'
          }],
          usage: {
            promptTokens: 0,
            completionTokens: 0,
            totalTokens: 0
          }
        };
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  async *streamComplete(messages: AIMessage[], options: AICompletionOptions = {}): AsyncIterable<AIStreamChunk> {
    try {
      const { GoogleGenerativeAI } = await import('@google/generative-ai');

      const genAI = new GoogleGenerativeAI(this.apiKey);
      const model = genAI.getGenerativeModel({ model: options.model || 'gemini-1.5-pro' });

      // Convert messages to Google AI format
      const chatHistory: any[] = [];
      let systemInstruction: string | undefined;

      for (const msg of messages) {
        if (msg.role === 'system') {
          systemInstruction = msg.content;
        } else {
          chatHistory.push({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
          });
        }
      }

      const generationConfig = {
        temperature: options.temperature ?? 0.7,
        topP: options.topP,
        maxOutputTokens: options.maxTokens,
      };

      let modelInstance;
      if (systemInstruction) {
        modelInstance = genAI.getGenerativeModel({
          model: options.model || 'gemini-1.5-pro',
          systemInstruction,
          generationConfig
        });
      } else {
        modelInstance = model;
      }

      // For streaming, we'll use generateContentStream
      const result = await modelInstance.generateContentStream(
        chatHistory.map(h => h.parts[0].text).join('\n')
      );

      let index = 0;
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        yield {
          id: `google-chunk-${index++}`,
          object: 'chat.completion.chunk',
          created: Date.now(),
          model: options.model || 'gemini-1.5-pro',
          choices: [{
            index: 0,
            delta: {
              content: chunkText
            },
            finish_reason: null
          }]
        };
      }

      // Send final chunk with finish_reason
      yield {
        id: `google-chunk-${index++}`,
        object: 'chat.completion.chunk',
        created: Date.now(),
        model: options.model || 'gemini-1.5-pro',
        choices: [{
          index: 0,
          delta: {},
          finish_reason: 'stop'
        }]
      };
    } catch (error) {
      this.handleError(error);
    }
  }

  getProviderName(): string {
    return 'google';
  }

  getSupportedModels(): string[] {
    return [
      'gemini-1.5-pro',
      'gemini-1.5-flash',
      'gemini-1.0-pro',
      'gemini-1.0-pro-vision'
    ];
  }
}