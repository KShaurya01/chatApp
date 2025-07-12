/**
 * Chat service for handling message persistence and business logic
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Message } from '../types/Message';

const CHAT_HISTORY_KEY = 'chat_history';

class ChatService {
  async saveChatHistory(messages: Message[]): Promise<void> {
    try {
      const jsonValue = JSON.stringify(messages);
      await AsyncStorage.setItem(CHAT_HISTORY_KEY, jsonValue);
    } catch (error) {
      console.error('Error saving chat history:', error);
      throw error;
    }
  }

  async loadChatHistory(): Promise<Message[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(CHAT_HISTORY_KEY);
      if (jsonValue != null) {
        const messages = JSON.parse(jsonValue);
        // Convert timestamp strings back to Date objects
        return messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
      }
      return [];
    } catch (error) {
      console.error('Error loading chat history:', error);
      return [];
    }
  }

  async clearChatHistory(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CHAT_HISTORY_KEY);
    } catch (error) {
      console.error('Error clearing chat history:', error);
      throw error;
    }
  }

  // Simulate message delivery with potential failures
  async sendMessage(message: Message): Promise<Message> {
    return new Promise((resolve, reject) => {
      // Simulate network delay
      setTimeout(() => {
        // Simulate 10% failure rate
        if (Math.random() < 0.1) {
          reject(new Error('Message delivery failed'));
        } else {
          resolve({ ...message, status: 'sent' });
        }
      }, 500 + Math.random() * 1000);
    });
  }
}

export const chatService = new ChatService();
