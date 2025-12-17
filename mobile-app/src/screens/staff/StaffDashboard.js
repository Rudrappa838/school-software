import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    RefreshControl,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../contexts/AuthContext';
import { staffService } from '../../services/staff.service';

const StaffDashboard = ({ navigation }) => {
    const { user, logout } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [dashboardData, setDashboardData] = useState({
        profile: null,
        attendance: null,
        salary: null,
    });

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        setIsLoading(true);
        try {
            const [profileRes, attendanceRes, salaryRes] = await Promise.all([
                staffService.getProfile(),
                staffService.getAttendance(),
                staffService.getSalary(),
            ]);

            setDashboardData({
                profile: profileRes.data,
                attendance: attendanceRes.data,
                salary: salaryRes.data,
            });
        } catch (error) {
            console.error('Error loading dashboard:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadDashboard();
        setRefreshing(false);
    };

    const handleLogout = async () => {
        await logout();
    };

    const menuItems = [
        { id: 'attendance', title: 'My Attendance', icon: '✅', screen: 'StaffAttendance', color: '#667eea' },
        { id: 'salary', title: 'Salary', icon: '💰', screen: 'StaffSalary', color: '#4facfe' },
        { id: 'leaves', title: 'Leave', icon: '📝', screen: 'StaffLeaves', color: '#43e97b' },
        { id: 'daily', title: 'Daily Status', icon: '📊', screen: 'StaffDailyStatus', color: '#fa709a' },
    ];

    if (isLoading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#667eea" />
                <Text style={styles.loaderText}>Loading Dashboard...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <LinearGradient colors={['#43e97b', '#38f9d7']} style={styles.header}>
                <View style={styles.headerContent}>
                    <View>
                        <Text style={styles.greeting}>Welcome! 👋</Text>
                        <Text style={styles.userName}>{user?.name || 'Staff Member'}</Text>
                        <Text style={styles.userDetails}>
                            {user?.designation || 'Staff'}
                        </Text>
                    </View>
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            {/* Quick Stats */}
            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>
                        {dashboardData.attendance?.attendancePercentage || '0'}%
                    </Text>
                    <Text style={styles.statLabel}>Attendance</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>
                        ₹{dashboardData.salary?.lastSalary || '0'}
                    </Text>
                    <Text style={styles.statLabel}>Last Salary</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>
                        {dashboardData.profile?.leavesLeft || '0'}
                    </Text>
                    <Text style={styles.statLabel}>Leaves Left</Text>
                </View>
            </View>

            {/* Menu Grid */}
            <ScrollView
                style={styles.menuContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <View style={styles.menuGrid}>
                    {menuItems.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.menuItem}
                            onPress={() => navigation.navigate(item.screen)}
                        >
                            <LinearGradient
                                colors={[item.color, `${item.color}dd`]}
                                style={styles.menuGradient}
                            >
                                <Text style={styles.menuIcon}>{item.icon}</Text>
                                <Text style={styles.menuTitle}>{item.title}</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Recent Activity */}
                <View style={styles.activitySection}>
                    <Text style={styles.sectionTitle}>Recent Activity</Text>
                    <View style={styles.activityCard}>
                        <Text style={styles.activityText}>
                            No recent activity to display
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f7fa',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f7fa',
    },
    loaderText: {
        marginTop: 10,
        color: '#667eea',
        fontSize: 16,
    },
    header: {
        paddingTop: 50,
        paddingBottom: 30,
        paddingHorizontal: 20,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    greeting: {
        fontSize: 16,
        color: 'rgba(0, 0, 0, 0.7)',
        marginBottom: 5,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 3,
    },
    userDetails: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.9)',
    },
    logoutButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.4)',
    },
    logoutText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    statsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginTop: -20,
        marginBottom: 20,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 15,
        marginHorizontal: 5,
        borderRadius: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
    },
    menuContainer: {
        flex: 1,
    },
    menuGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 15,
        paddingBottom: 10,
    },
    menuItem: {
        width: '48%',
        aspectRatio: 1.2,
        marginHorizontal: '1%',
        marginBottom: 15,
    },
    menuGradient: {
        flex: 1,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    menuIcon: {
        fontSize: 40,
        marginBottom: 10,
    },
    menuTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#fff',
        textAlign: 'center',
    },
    activitySection: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    activityCard: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    activityText: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
    },
});

export default StaffDashboard;
