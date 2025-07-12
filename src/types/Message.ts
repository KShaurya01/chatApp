/**
 * Message type definitions for the chat interface
 */

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  status: 'sending' | 'sent' | 'failed';
  retryCount?: number;
  type?: 'typing' | 'error' | 'message';
  error?: string;
}

export interface ChatContextType {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  isTyping: boolean;
  onSendMessage: (text: string) => Promise<void>;
  onRetry: (messageId: string) => Promise<void>;
  onClearError: () => void;
  onClearChat: () => Promise<void>;
}
