import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Bell, LogOut, Menu } from 'lucide-react-native';

const AppHeader = ({
    userName,
    subtitle,
    onLogout,
    onNotification,
    showMenu = false,
    onMenu
}) => {
    const insets = useSafeAreaInsets();

    return (
        <LinearGradient
            colors={['#0f172a', '#1e293b']}
            style={[styles.header, { paddingTop: insets.top + 10 }]}
        >
            <View style={styles.content}>
                <View style={styles.leftSection}>
                    {showMenu && (
                        <TouchableOpacity style={styles.iconButton} onPress={onMenu}>
                            <Menu color="#fff" size={24} />
                        </TouchableOpacity>
                    )}
                    <View>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>CONNECT TO CAMPUS</Text>
                        </View>
                        <Text style={styles.userName} numberOfLines={1}>{userName || 'Welcome'}</Text>
                        <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
                    </View>
                </View>

                <View style={styles.rightSection}>
                    <TouchableOpacity style={styles.iconButton} onPress={onNotification}>
                        <Bell color="#fff" size={22} />
                        <View style={styles.notificationDot} />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.iconButton, styles.logoutButton]} onPress={onLogout}>
                        <LogOut color="#ef4444" size={20} />
                    </TouchableOpacity>
                </View>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    header: {
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    badge: {
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        alignSelf: 'flex-start',
        marginBottom: 4,
        borderWidth: 0.5,
        borderColor: 'rgba(99, 102, 241, 0.4)',
    },
    badgeText: {
        color: '#818cf8',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1,
    },
    userName: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    subtitle: {
        color: '#94a3b8',
        fontSize: 12,
        fontWeight: '500',
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
    },
    iconButton: {
        width: 42,
        height: 42,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.08)',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    logoutButton: {
        borderColor: 'rgba(239, 68, 68, 0.2)',
    },
    notificationDot: {
        position: 'absolute',
        top: 10,
        right: 11,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ef4444',
        borderWidth: 1.5,
        borderColor: '#1e293b',
    }
});

export default AppHeader;
