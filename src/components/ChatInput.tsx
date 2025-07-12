/**
 * Chat input component with multi-line support and send functionality
 */

import React, { useState, useRef, useCallback } from 'react';
import {
    View,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    useColorScheme,
    Text,
    Alert,
    Keyboard,
} from 'react-native';
import { useChatContext } from '../context/ChatContext';

const ChatInput: React.FC = () => {
    const isDarkMode = useColorScheme() === 'dark';
    const { onSendMessage, isLoading } = useChatContext();
    const [inputText, setInputText] = useState('');
    const [inputHeight, setInputHeight] = useState(40);
    const inputRef = useRef<TextInput>(null);

    const handleSend = useCallback(async () => {
        const text = inputText.trim();
        if (!text || isLoading) return;

        const currentText = text;

        if (inputRef.current) {
            inputRef.current.clear();
        }

        // Then update state
        setInputText('');
        setInputHeight(40);

        // Dismiss keyboard after a short delay to avoid conflicts
        setTimeout(() => {
            Keyboard.dismiss();
        }, 100);

        try {
            await onSendMessage(currentText);
        } catch (error) {
            // If sending fails, restore the text
            setInputText(currentText);
            Alert.alert('Error', 'Failed to send message. Please try again.');
        }
    }, [inputText, isLoading, onSendMessage]);

    const handleKeyPress = useCallback((event: any) => {
        if (event.nativeEvent.key === 'Enter' && !event.nativeEvent.shiftKey) {
            event.preventDefault();
            // Small delay to ensure proper event handling
            setTimeout(() => {
                handleSend();
            }, 50);
        }
    }, [handleSend]);

    const handleContentSizeChange = (event: any) => {
        const { height } = event.nativeEvent.contentSize;
        const newHeight = Math.max(40, Math.min(height, 120));
        setInputHeight(newHeight);
    };

    const maxLength = 1000;
    const isNearLimit = inputText.length > maxLength * 0.8;

    return (
        <View style={[styles.container, { backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa' }]}>
            <View style={[styles.separator, { backgroundColor: isDarkMode ? '#333' : '#e0e0e0' }]} />

            <View style={styles.inputContainer}>
                <View style={[styles.inputWrapper, { backgroundColor: isDarkMode ? '#2a2a2a' : '#fff' }]}>
                    <TextInput
                        ref={inputRef}
                        style={[
                            styles.textInput,
                            {
                                height: inputHeight,
                                color: isDarkMode ? '#fff' : '#000',
                                maxHeight: 120,
                            }
                        ]}
                        value={inputText}
                        onChangeText={setInputText}
                        onKeyPress={handleKeyPress}
                        onContentSizeChange={handleContentSizeChange}
                        placeholder="Type a message..."
                        placeholderTextColor={isDarkMode ? '#888' : '#666'}
                        multiline
                        maxLength={maxLength}
                        editable={!isLoading}
                        accessibilityLabel="Message input"
                        accessibilityHint="Type your message here and press send"
                    />

                    {isNearLimit && (
                        <Text style={[styles.characterCount, { color: isDarkMode ? '#888' : '#666' }]}>
                            {inputText.length}/{maxLength}
                        </Text>
                    )}
                </View>

                <TouchableOpacity
                    style={[
                        styles.sendButton,
                        {
                            backgroundColor: inputText.trim() && !isLoading ? '#007AFF' : isDarkMode ? '#333' : '#ccc',
                        }
                    ]}
                    onPress={handleSend}
                    disabled={!inputText.trim() || isLoading}
                    accessibilityLabel="Send message"
                    accessibilityHint="Sends your message to the chat"
                >
                    <Text style={[styles.sendButtonText, {
                        color: inputText.trim() && !isLoading ? '#fff' : isDarkMode ? '#666' : '#999'
                    }]}>
                        {isLoading ? '...' : 'Send'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: 12,
        paddingBottom: 12,
        paddingHorizontal: 16,
    },
    separator: {
        height: 1,
        marginBottom: 12,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 12,
    },
    inputWrapper: {
        flex: 1,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        position: 'relative',
    },
    textInput: {
        fontSize: 16,
        lineHeight: 20,
        paddingTop: 8,
        paddingBottom: 8,
        textAlignVertical: 'top',
    },
    characterCount: {
        position: 'absolute',
        bottom: 4,
        right: 8,
        fontSize: 10,
        opacity: 0.7,
    },
    sendButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        minWidth: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
});

export default ChatInput; 