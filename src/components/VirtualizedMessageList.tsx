/**
 * Virtualized message list for performance optimization with large datasets
 */

import React, { useCallback, useRef, useMemo } from 'react';
import {
    VirtualizedList,
    View,
    StyleSheet,
    useColorScheme,
    Text,
    Dimensions,
    ListRenderItem,
} from 'react-native';
import { Message } from '../types/Message';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import ErrorMessage from './ErrorMessage';
import { useChatContext } from '../context/ChatContext';

interface VirtualizedMessageListProps {
    messages: Message[];
    onScrollToEnd?: () => void;
    onScroll?: (event: any) => void;
}

const VirtualizedMessageList: React.FC<VirtualizedMessageListProps> = ({
    messages,
    onScrollToEnd,
    onScroll,
}) => {
    const isDarkMode = useColorScheme() === 'dark';
    const { isTyping, error } = useChatContext();
    const listRef = useRef<VirtualizedList<any>>(null);

    // Memoize the data to prevent unnecessary re-renders
    const data = useMemo(() => {
        const items = [...messages];
        if (isTyping) {
            items.push({ id: 'typing', type: 'typing' });
        }
        if (error) {
            items.push({ id: 'error', type: 'error', error });
        }
        return items;
    }, [messages, isTyping, error]);

    const getItem = useCallback((data: any, index: number) => {
        return data[index];
    }, []);

    const getItemCount = useCallback((data: any) => {
        return data.length;
    }, []);

    const getItemLayout = useCallback((data: any, index: number) => {
        // Estimate item height for better performance
        const averageHeight = 80; // Estimated height per message
        return {
            length: averageHeight,
            offset: averageHeight * index,
            index,
        };
    }, []);

    const keyExtractor = useCallback((item: any) => {
        return item.id;
    }, []);

    const renderItem: ListRenderItem<any> = useCallback(({ item }) => {
        if (item.type === 'typing') {
            return <TypingIndicator />;
        }
        if (item.type === 'error') {
            return <ErrorMessage error={item.error} />;
        }
        return <MessageBubble message={item} />;
    }, []);

    const scrollToEnd = useCallback(() => {
        if (data.length > 0) {
            listRef.current?.scrollToEnd({ animated: true });
        }
    }, [data.length]);

    // Auto-scroll to end when new messages arrive
    React.useEffect(() => {
        if (messages.length > 0 && !isTyping) {
            setTimeout(() => {
                scrollToEnd();
            }, 100);
        }
    }, [messages.length, isTyping, scrollToEnd]);

    const EmptyComponent = useCallback(() => (
        <View style={styles.emptyState}>
            <Text style={[styles.emptyStateText, { color: isDarkMode ? '#888' : '#666' }]}>
                Welcome to Chat Assistant!
            </Text>
            <Text style={[styles.emptyStateSubtext, { color: isDarkMode ? '#666' : '#999' }]}>
                Start a conversation by typing a message below.
            </Text>
        </View>
    ), [isDarkMode]);

    return (
        <VirtualizedList
            ref={listRef}
            data={data}
            initialNumToRender={10}
            maxToRenderPerBatch={5}
            windowSize={10}
            getItemCount={getItemCount}
            getItem={getItem}
            getItemLayout={getItemLayout}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            onScroll={onScroll}
            onEndReached={onScrollToEnd}
            onEndReachedThreshold={0.1}
            removeClippedSubviews={true}
            style={[styles.list, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={EmptyComponent}
        />
    );
};

const styles = StyleSheet.create({
    list: {
        flex: 1,
        paddingHorizontal: 16,
    },
    contentContainer: {
        paddingTop: 16,
        paddingBottom: 16,
        minHeight: Dimensions.get('window').height * 0.6,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
        minHeight: Dimensions.get('window').height * 0.5,
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
});

export default VirtualizedMessageList; 