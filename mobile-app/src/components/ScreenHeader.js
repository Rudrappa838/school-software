import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Bell } from 'lucide-react-native';

const ScreenHeader = ({ title, subtitle, onBack, showNotification = false, notificationCount = 0, gradient = ['#0f172a', '#1e293b'] }) => {
    const insets = useSafeAreaInsets();

    return (
        <LinearGradient
            colors={gradient}
            style={[styles.header, { paddingTop: insets.top + 10 }]}
        >
            <View style={styles.headerContent}>
                <TouchableOpacity style={styles.backButton} onPress={onBack}>
                    <ArrowLeft color="#fff" size={24} />
                </TouchableOpacity>

                <View style={styles.titleContainer}>
                    <Text style={styles.title} numberOfLines={1}>{title}</Text>
                    {subtitle && <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>}
                </View>

                {showNotification && (
                    <TouchableOpacity style={styles.notificationButton}>
                        <Bell color="#fff" size={22} />
                        {notificationCount > 0 && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{notificationCount}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                )}
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    header: {
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    titleContainer: {
        flex: 1,
        marginLeft: 15,
    },
    title: {
        fontSize: 20,
        fontWeight: '800',
        color: '#fff',
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 12,
        color: '#cbd5e1',
        marginTop: 2,
        fontWeight: '500',
    },
    notificationButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: '#ef4444',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 5,
        borderWidth: 2,
        borderColor: '#fff',
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '700',
    },
});

export default ScreenHeader;
