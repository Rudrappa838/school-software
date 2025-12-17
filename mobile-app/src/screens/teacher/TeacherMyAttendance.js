import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { teacherService } from '../../services/teacher.service';

const TeacherMyAttendance = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [attendanceData, setAttendanceData] = useState(null);

    useEffect(() => {
        loadAttendance();
    }, []);

    const loadAttendance = async () => {
        setIsLoading(true);
        const result = await teacherService.getAttendance();
        if (result.success) {
            setAttendanceData(result.data);
        }
        setIsLoading(false);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadAttendance();
        setRefreshing(false);
    };

    if (isLoading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#667eea" />
            </View>
        );
    }

    const attendancePercentage = attendanceData?.attendancePercentage || 0;
    const totalDays = attendanceData?.totalDays || 0;
    const presentDays = attendanceData?.presentDays || 0;
    const absentDays = attendanceData?.absentDays || 0;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backButton}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Attendance</Text>
                <View style={{ width: 60 }} />
            </View>

            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {/* Attendance Circle */}
                <View style={styles.circleContainer}>
                    <LinearGradient
                        colors={['#43e97b', '#38f9d7']}
                        style={styles.circleGradient}
                    >
                        <View style={styles.circleInner}>
                            <Text style={styles.percentageText}>{attendancePercentage}%</Text>
                            <Text style={styles.percentageLabel}>Attendance</Text>
                        </View>
                    </LinearGradient>
                </View>

                {/* Stats Cards */}
                <View style={styles.statsGrid}>
                    <View style={[styles.statBox, { backgroundColor: '#4facfe' }]}>
                        <Text style={styles.statNumber}>{totalDays}</Text>
                        <Text style={styles.statLabel}>Total Days</Text>
                    </View>
                    <View style={[styles.statBox, { backgroundColor: '#43e97b' }]}>
                        <Text style={styles.statNumber}>{presentDays}</Text>
                        <Text style={styles.statLabel}>Present</Text>
                    </View>
                    <View style={[styles.statBox, { backgroundColor: '#fa709a' }]}>
                        <Text style={styles.statNumber}>{absentDays}</Text>
                        <Text style={styles.statLabel}>Absent</Text>
                    </View>
                </View>

                {/* Monthly Record */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Monthly Record</Text>
                    {attendanceData?.monthlyRecords?.length > 0 ? (
                        attendanceData.monthlyRecords.map((record, index) => (
                            <View key={index} style={styles.recordCard}>
                                <View style={styles.recordRow}>
                                    <Text style={styles.recordDate}>{record.date}</Text>
                                    <View
                                        style={[
                                            styles.statusBadge,
                                            {
                                                backgroundColor:
                                                    record.status === 'Present' ? '#43e97b' : '#fa709a',
                                            },
                                        ]}
                                    >
                                        <Text style={styles.statusText}>{record.status}</Text>
                                    </View>
                                </View>
                            </View>
                        ))
                    ) : (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>📊 No attendance records found</Text>
                        </View>
                    )}
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
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    backButton: {
        fontSize: 16,
        color: '#43e97b',
        fontWeight: '600',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    circleContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    circleGradient: {
        width: 200,
        height: 200,
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 10,
    },
    circleInner: {
        width: 170,
        height: 170,
        borderRadius: 85,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    percentageText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#43e97b',
    },
    percentageLabel: {
        fontSize: 16,
        color: '#666',
        marginTop: 5,
    },
    statsGrid: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    statBox: {
        flex: 1,
        padding: 20,
        borderRadius: 15,
        alignItems: 'center',
        marginHorizontal: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    statNumber: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },
    statLabel: {
        fontSize: 12,
        color: '#fff',
        fontWeight: '600',
    },
    section: {
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    recordCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    recordRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    recordDate: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    statusText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    emptyState: {
        backgroundColor: '#fff',
        padding: 40,
        borderRadius: 15,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
    },
});

export default TeacherMyAttendance;
