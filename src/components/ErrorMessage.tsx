/**
 * Error message component for displaying connection and sending errors
 */

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    useColorScheme,
    TouchableOpacity,
} from 'react-native';
import { useChatContext } from '../context/ChatContext';

interface ErrorMessageProps {
    error: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
    const isDarkMode = useColorScheme() === 'dark';
    const { onClearError } = useChatContext();

    return (
        <View style={styles.container}>
            <View style={[
                styles.errorBubble,
                { backgroundColor: isDarkMode ? '#2a1f1f' : '#fef2f2' }
            ]}>
                <View style={styles.errorIcon}>
                    <Text style={styles.errorIconText}>⚠️</Text>
                </View>

                <View style={styles.errorContent}>
                    <Text style={[
                        styles.errorTitle,
                        { color: isDarkMode ? '#ff6b6b' : '#dc2626' }
                    ]}>
                        Error
                    </Text>
                    <Text style={[
                        styles.errorText,
                        { color: isDarkMode ? '#ff9999' : '#991b1b' }
                    ]}>
                        {error}
                    </Text>
                </View>

                <TouchableOpacity
                    onPress={onClearError}
                    style={styles.dismissButton}
                    accessibilityLabel="Dismiss error"
                    accessibilityHint="Closes this error message"
                >
                    <Text style={[
                        styles.dismissButtonText,
                        { color: isDarkMode ? '#888' : '#666' }
                    ]}>
                        ✕
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 8,
        paddingHorizontal: 8,
    },
    errorBubble: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#fee2e2',
        gap: 12,
    },
    errorIcon: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorIconText: {
        fontSize: 18,
    },
    errorContent: {
        flex: 1,
    },
    errorTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 2,
    },
    errorText: {
        fontSize: 14,
        lineHeight: 18,
    },
    dismissButton: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
    },
    dismissButtonText: {
        fontSize: 16,
        fontWeight: '500',
    },
});

export default ErrorMessage; 