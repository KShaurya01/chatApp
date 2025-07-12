/**
 * Chat area component with scrollable message list and auto-scroll functionality
 */

import React, { useRef, useEffect, useState } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    useColorScheme,
    Text,
    Dimensions,
    NativeSyntheticEvent,
    NativeScrollEvent,
} from 'react-native';
import { useChatContext } from '../context/ChatContext';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import ErrorMessage from './ErrorMessage';

const { height: screenHeight } = Dimensions.get('window');

const ChatArea: React.FC = () => {
    const isDarkMode = useColorScheme() === 'dark';
    const { messages, isTyping, error } = useChatContext();
    const scrollViewRef = useRef<ScrollView>(null);
    const [isUserScrolling, setIsUserScrolling] = useState(false);
    const [showScrollToBottom, setShowScrollToBottom] = useState(false);

    useEffect(() => {
        if (!isUserScrolling && messages.length > 0) {
            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    }, [messages, isUserScrolling]);

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
        const isAtBottom = contentOffset.y >= contentSize.height - layoutMeasurement.height - 100;

        setShowScrollToBottom(!isAtBottom);

        if (!isAtBottom) {
            setIsUserScrolling(true);
        }
    };

    const handleScrollEndDrag = () => {
        setTimeout(() => {
            setIsUserScrolling(false);
        }, 1000);
    };

    const scrollToBottom = () => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
        setShowScrollToBottom(false);
        setIsUserScrolling(false);
    };

    return (
        <View style={[styles.container, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}>
            <ScrollView
                ref={scrollViewRef}
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                onScroll={handleScroll}
                onScrollEndDrag={handleScrollEndDrag}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {messages.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Text style={[styles.emptyStateText, { color: isDarkMode ? '#888' : '#666' }]}>
                            Welcome to Chat Assistant!
                        </Text>
                        <Text style={[styles.emptyStateSubtext, { color: isDarkMode ? '#666' : '#999' }]}>
                            Start a conversation by typing a message below.
                        </Text>
                    </View>
                ) : (
                    messages.map((message) => (
                        <MessageBubble key={message.id} message={message} />
                    ))
                )}

                {isTyping && <TypingIndicator />}
                {error && <ErrorMessage error={error} />}
            </ScrollView>

            {showScrollToBottom && (
                <View style={styles.scrollToBottomContainer}>
                    <Text
                        style={[styles.scrollToBottomButton, { backgroundColor: isDarkMode ? '#333' : '#007AFF' }]}
                        onPress={scrollToBottom}
                    >
                        ↓ New messages
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 16,
    },
    scrollContent: {
        paddingTop: 16,
        paddingBottom: 16,
        minHeight: screenHeight * 0.6,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    emptyStateText: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 8,
    },
    emptyStateSubtext: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
    },
    scrollToBottomContainer: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        left: 16,
        alignItems: 'center',
    },
    scrollToBottomButton: {
        color: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
        overflow: 'hidden',
    },
});

export default ChatArea; 