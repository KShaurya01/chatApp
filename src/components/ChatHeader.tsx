/**
 * Chat header component with title and status indicators
 */

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    useColorScheme,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { useChatContext } from '../context/ChatContext';

const ChatHeader: React.FC = () => {
    const isDarkMode = useColorScheme() === 'dark';
    const { messages, isTyping, onClearChat } = useChatContext();

    const handleClearChat = () => {
        Alert.alert(
            'Clear Chat',
            'Are you sure you want to clear all messages?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Clear',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await onClearChat();
                        } catch (error) {
                            console.error('Error clearing chat:', error);
                            Alert.alert('Error', 'Failed to clear chat history');
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    };

    const getStatusText = () => {
        if (isTyping) {
            return 'Bot is typing...';
        }
        if (messages.length === 0) {
            return 'Start a conversation';
        }
        return 'Online';
    };

    return (
        <View style={[styles.container, { backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa' }]}>
            <View style={styles.headerContent}>
                <View style={styles.titleContainer}>
                    <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#000' }]}>
                        Chat Assistant
                    </Text>
                    <Text style={[styles.subtitle, { color: isDarkMode ? '#888' : '#666' }]}>
                        {getStatusText()}
                    </Text>
                </View>
                <TouchableOpacity
                    style={styles.clearButton}
                    onPress={handleClearChat}
                    accessibilityLabel="Clear chat history"
                    accessibilityHint="Clears all messages from the chat"
                >
                    <Text style={[styles.clearButtonText, { color: isDarkMode ? '#ff6b6b' : '#dc3545' }]}>
                        Clear
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={[styles.separator, { backgroundColor: isDarkMode ? '#333' : '#e0e0e0' }]} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 10,
        paddingBottom: 10,
        paddingHorizontal: 16,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    titleContainer: {
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    subtitle: {
        fontSize: 14,
        opacity: 0.8,
    },
    clearButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#dc3545',
    },
    clearButtonText: {
        fontSize: 14,
        fontWeight: '500',
    },
    separator: {
        height: 1,
        marginTop: 10,
    },
});

export default ChatHeader; 