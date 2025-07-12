/**
 * Chat Interface Assessment
 * Senior Developer Implementation
 * 
 * @format
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import ChatHeader from './src/components/ChatHeader';
import ChatArea from './src/components/ChatArea';
import ChatInput from './src/components/ChatInput';
import { ChatProvider } from './src/context/ChatContext';
import { Message } from './src/types/Message';
import { chatService } from './src/services/ChatService';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    loadChatHistory();
  }, []);

  const loadChatHistory = async () => {
    try {
      const history = await chatService.loadChatHistory();
      setMessages(history);
    } catch (err) {
      console.error('Error loading chat history:', err);
    }
  };

  const saveChatHistory = async (newMessages: Message[]) => {
    try {
      await chatService.saveChatHistory(newMessages);
    } catch (err) {
      console.error('Error saving chat history:', err);
    }
  };

  const handleSendMessage = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
      status: 'sent'
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);
    setError(null);

    try {
      // Save user message
      await saveChatHistory(updatedMessages);

      // Simulate typing indicator
      setIsTyping(true);

      // Simulate bot response
      setTimeout(async () => {
        setIsTyping(false);
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: generateBotResponse(text),
          sender: 'bot',
          timestamp: new Date(),
          status: 'sent'
        };

        const finalMessages = [...updatedMessages, botMessage];
        setMessages(finalMessages);
        await saveChatHistory(finalMessages);
        setIsLoading(false);
      }, 1000 + Math.random() * 2000);

    } catch (err) {
      setError('Failed to send message. Please try again.');
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const generateBotResponse = (userText: string): string => {
    const responses = [
      `I understand you said: "${userText}". How can I help you further?`,
      `That's interesting! Tell me more about "${userText}".`,
      `Thanks for sharing that. I'd be happy to discuss "${userText}" in more detail.`,
      `I see you mentioned "${userText}". What would you like to know about it?`,
      `Great question about "${userText}". Let me think about that...`,
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleRetry = async (messageId: string) => {
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    if (messageIndex !== -1) {
      const message = messages[messageIndex];
      if (message.sender === 'user') {
        await handleSendMessage(message.text);
      }
    }
  };

  const clearError = () => {
    setError(null);
  };

  const handleClearChat = async () => {
    try {
      await chatService.clearChatHistory();
      setMessages([]);
      setError(null);
    } catch (err) {
      console.error('Error clearing chat:', err);
      setError('Failed to clear chat history');
    }
  };

  return (
    <ChatProvider
      value={{
        messages,
        isLoading,
        error,
        isTyping,
        onSendMessage: handleSendMessage,
        onRetry: handleRetry,
        onClearError: clearError,
        onClearChat: handleClearChat,
      }}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.chatContainer}>
            <ChatHeader />
            <ChatArea />
            <ChatInput />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ChatProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
    flexDirection: 'column',
  },
});

export default App;
