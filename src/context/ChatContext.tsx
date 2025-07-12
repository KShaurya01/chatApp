/**
 * Chat context for managing global chat state
 */

import React, { createContext, useContext, ReactNode } from 'react';
import { ChatContextType } from '../types/Message';

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
    children: ReactNode;
    value: ChatContextType;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children, value }) => {
    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChatContext = (): ChatContextType => {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChatContext must be used within a ChatProvider');
    }
    return context;
}; 