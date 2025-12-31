import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    RefreshControl,
    ActivityIndicator,
    TouchableOpacity,
    Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { studentService } from '../../services/student.service';
import ScreenHeader from '../../components/ScreenHeader';

const NotificationsScreen = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        setIsLoading(true);
        try {
            const response = await studentService.getNotifications();
            if (response.success) {
                setNotifications(response.data);
            } else {
                console.warn(response.message);
                // Alert.alert('Error', response.message);
            }
        } catch (error) {
            console.error('Error loading notifications:', error);
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadNotifications();
    };

    const renderItem = ({ item }) => (
        <View style={[styles.card, !item.is_read && styles.unreadCard]}>
            <View style={styles.cardHeader}>
                <View style={styles.titleRow}>
                    <Text style={styles.icon}>{item.type === 'ALERT' ? '🔔' : 'ℹ️'}</Text>
                    <Text style={[styles.title, !item.is_read && styles.unreadText]}>
                        {item.title}
                    </Text>
                </View>
                <Text style={styles.time}>
                    {new Date(item.created_at).toLocaleDateString()} {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
            </View>
            <Text style={styles.message}>{item.message}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <ScreenHeader title="Notifications" onBack={() => navigation.goBack()} />

            {isLoading && !refreshing ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#667eea" />
                </View>
            ) : (
                <FlatList
                    data={notifications}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#667eea']} />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No notifications yet</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        borderLeftWidth: 4,
        borderLeftColor: '#e2e8f0'
    },
    unreadCard: {
        backgroundColor: '#f0f9ff', // Light blue tint
        borderLeftColor: '#0ea5e9'
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    icon: {
        fontSize: 16,
        marginRight: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e293b',
        flex: 1,
    },
    unreadText: {
        color: '#0ea5e9',
        fontWeight: '700',
    },
    time: {
        fontSize: 12,
        color: '#94a3b8',
        marginLeft: 8,
    },
    message: {
        fontSize: 14,
        color: '#475569',
        lineHeight: 20,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 60,
    },
    emptyText: {
        color: '#94a3b8',
        fontSize: 16,
    },
});

export default NotificationsScreen;
