/**
 * Typing indicator component to show when bot is composing a response
 */

import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    useColorScheme,
    Animated,
} from 'react-native';

const TypingIndicator: React.FC = () => {
    const isDarkMode = useColorScheme() === 'dark';
    const [dot1] = useState(new Animated.Value(0));
    const [dot2] = useState(new Animated.Value(0));
    const [dot3] = useState(new Animated.Value(0));

    useEffect(() => {
        const createAnimation = (animatedValue: Animated.Value, delay: number) => {
            return Animated.loop(
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.timing(animatedValue, {
                        toValue: 1,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                    Animated.timing(animatedValue, {
                        toValue: 0,
                        duration: 500,
                        useNativeDriver: true,
                    }),
                ])
            );
        };

        const animation1 = createAnimation(dot1, 0);
        const animation2 = createAnimation(dot2, 200);
        const animation3 = createAnimation(dot3, 400);

        animation1.start();
        animation2.start();
        animation3.start();

        return () => {
            animation1.stop();
            animation2.stop();
            animation3.stop();
        };
    }, [dot1, dot2, dot3]);

    return (
        <View style={[styles.container, styles.botContainer]}>
            <View style={[styles.botIcon, { backgroundColor: isDarkMode ? '#007AFF' : '#007AFF' }]}>
                <Text style={styles.botIconText}>🤖</Text>
            </View>

            <View style={styles.messageContainer}>
                <View style={[
                    styles.typingBubble,
                    { backgroundColor: isDarkMode ? '#2a2a2a' : '#f0f0f0' }
                ]}>
                    <View style={styles.dotsContainer}>
                        <Animated.View
                            style={[
                                styles.dot,
                                { backgroundColor: isDarkMode ? '#fff' : '#666' },
                                { opacity: dot1 }
                            ]}
                        />
                        <Animated.View
                            style={[
                                styles.dot,
                                { backgroundColor: isDarkMode ? '#fff' : '#666' },
                                { opacity: dot2 }
                            ]}
                        />
                        <Animated.View
                            style={[
                                styles.dot,
                                { backgroundColor: isDarkMode ? '#fff' : '#666' },
                                { opacity: dot3 }
                            ]}
                        />
                    </View>
                </View>

                <View style={styles.typingLabel}>
                    <Text style={[styles.typingText, { color: isDarkMode ? '#888' : '#666' }]}>
                        Assistant is typing...
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginVertical: 8,
        paddingHorizontal: 8,
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
    },
    typingBubble: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 18,
        marginBottom: 4,
    },
    dotsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    typingLabel: {
        paddingHorizontal: 4,
    },
    typingText: {
        fontSize: 12,
        opacity: 0.7,
        fontStyle: 'italic',
    },
});

export default TypingIndicator; 