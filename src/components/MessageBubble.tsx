/**
 * Message bubble component with distinct styling for user and bot messages
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    useColorScheme,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { Message } from '../types/Message';
import { useChatContext } from '../context/ChatContext';

interface MessageBubbleProps {
    message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
    const isDarkMode = useColorScheme() === 'dark';
    const { onRetry } = useChatContext();
    const [showTimestamp, setShowTimestamp] = useState(false);

    const isUser = message.sender === 'user';
    const isBot = message.sender === 'bot';
    const isFailed = message.status === 'failed';
    const isSending = message.status === 'sending';

    const formatTimestamp = (timestamp: Date) => {
        const now = new Date();
        const isToday = timestamp.toDateString() === now.toDateString();

        if (isToday) {
            return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else {
            return `${timestamp.toLocaleDateString()} ${timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        }
    };

    const handleRetry = () => {
        Alert.alert(
            'Retry Message',
            'Would you like to retry sending this message?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Retry', onPress: () => onRetry(message.id) },
            ]
        );
    };

    const handlePress = () => {
        setShowTimestamp(!showTimestamp);
    };

    return (
        <View style={[styles.container, isUser ? styles.userContainer : styles.botContainer]}>
            {isBot && (
                <View style={[styles.botIcon, { backgroundColor: isDarkMode ? '#007AFF' : '#007AFF' }]}>
                    <Text style={styles.botIconText}>🤖</Text>
                </View>
            )}

            <View style={styles.messageContainer}>
                <TouchableOpacity
                    onPress={handlePress}
                    onLongPress={isFailed ? handleRetry : undefined}
                    style={[
                        styles.messageBubble,
                        isUser
                            ? { backgroundColor: isDarkMode ? '#007AFF' : '#007AFF' }
                            : { backgroundColor: isDarkMode ? '#2a2a2a' : '#f0f0f0' },
                        isFailed && styles.failedBubble,
                        isSending && styles.sendingBubble,
                    ]}
                    accessibilityLabel={`${isUser ? 'Your' : 'Bot'} message: ${message.text}`}
                    accessibilityHint={`Sent at ${formatTimestamp(message.timestamp)}. ${isFailed ? 'Failed to send, long press to retry' : 'Tap to toggle timestamp'}`}
                >
                    <Text style={[
                        styles.messageText,
                        isUser
                            ? { color: '#fff' }
                            : { color: isDarkMode ? '#fff' : '#000' },
                        isSending && styles.sendingText,
                    ]}>
                        {message.text}
                    </Text>

                    {isSending && (
                        <View style={styles.sendingIndicator}>
                            <Text style={styles.sendingDots}>⋯</Text>
                        </View>
                    )}
                </TouchableOpacity>

                {showTimestamp && (
                    <View style={[styles.timestampContainer, isUser ? styles.userTimestamp : styles.botTimestamp]}>
                        <Text style={[styles.timestampText, { color: isDarkMode ? '#888' : '#666' }]}>
                            {formatTimestamp(message.timestamp)}
                            {isFailed && ' • Failed to send'}
                            {isSending && ' • Sending...'}
                        </Text>
                    </View>
                )}

                {isFailed && (
                    <TouchableOpacity onPress={handleRetry} style={styles.retryButton}>
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginVertical: 4,
        paddingHorizontal: 8,
    },
    userContainer: {
        justifyContent: 'flex-end',
    },
    botContainer: {
        justifyContent: 'flex-start',
    },
    botIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
        marginTop: 4,
    },
    botIconText: {
        fontSize: 16,
    },
    messageContainer: {
        maxWidth: '75%',
        minWidth: '20%',
    },
    messageBubble: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 18,
        marginBottom: 4,
        position: 'relative',
    },
    failedBubble: {
        borderWidth: 1,
        borderColor: '#ff4444',
        opacity: 0.7,
    },
    sendingBubble: {
        opacity: 0.7,
    },
    messageText: {
        fontSize: 16,
        lineHeight: 20,
    },
    sendingText: {
        fontStyle: 'italic',
    },
    sendingIndicator: {
        position: 'absolute',
        right: 8,
        bottom: 4,
    },
    sendingDots: {
        fontSize: 12,
        color: '#fff',
    },
    timestampContainer: {
        marginTop: 4,
        paddingHorizontal: 4,
    },
    userTimestamp: {
        alignItems: 'flex-end',
    },
    botTimestamp: {
        alignItems: 'flex-start',
    },
    timestampText: {
        fontSize: 12,
        opacity: 0.7,
    },
    retryButton: {
        backgroundColor: '#ff4444',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
});

export default MessageBubble; 