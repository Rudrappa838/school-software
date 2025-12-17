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
import { teacherService } from '../../services/teacher.service';

const TeacherDashboard = ({ navigation }) => {
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
                teacherService.getProfile(),
                teacherService.getAttendance(),
                teacherService.getSalary(),
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
        { id: 'students', title: 'My Students', icon: '👨‍🎓', screen: 'TeacherStudents', color: '#667eea' },
        { id: 'timetable', title: 'My Timetable', icon: '📅', screen: 'TeacherTimetable', color: '#764ba2' },
        { id: 'attendance', title: 'Attendance', icon: '✅', screen: 'TeacherAttendance', color: '#f093fb' },
        { id: 'salary', title: 'My Salary', icon: '💰', screen: 'TeacherSalary', color: '#4facfe' },
        { id: 'leaves', title: 'Leave', icon: '📝', screen: 'TeacherLeaves', color: '#43e97b' },
        { id: 'doubts', title: 'Student Doubts', icon: '❓', screen: 'TeacherDoubts', color: '#fa709a' },
        { id: 'daily', title: 'Daily Status', icon: '📊', screen: 'TeacherDailyStatus', color: '#30cfd0' },
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
            <LinearGradient colors={['#764ba2', '#667eea']} style={styles.header}>
                <View style={styles.headerContent}>
                    <View>
                        <Text style={styles.greeting}>Good Day! 👨‍🏫</Text>
                        <Text style={styles.userName}>{user?.name || 'Teacher'}</Text>
                        <Text style={styles.userDetails}>
                            {user?.subject || 'Faculty Member'}
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
                    <Text style={styles.statLabel}>My Attendance</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>
                        {dashboardData.profile?.totalStudents || '0'}
                    </Text>
                    <Text style={styles.statLabel}>Students</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>
                        ₹{dashboardData.salary?.lastSalary || '0'}
                    </Text>
                    <Text style={styles.statLabel}>Last Salary</Text>
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

                {/* Today's Schedule Preview */}
                <View style={styles.schedulePreview}>
                    <Text style={styles.sectionTitle}>Today's Schedule</Text>
                    <View style={styles.scheduleCard}>
                        <Text style={styles.noScheduleText}>
                            Tap "My Timetable" to view your schedule
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
        color: 'rgba(255, 255, 255, 0.9)',
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
        color: 'rgba(255, 255, 255, 0.8)',
    },
    logoutButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
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
    schedulePreview: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    scheduleCard: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    noScheduleText: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
    },
});

export default TeacherDashboard;
