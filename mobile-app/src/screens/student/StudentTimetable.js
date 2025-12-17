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
import { studentService } from '../../services/student.service';

const StudentTimetable = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [timetable, setTimetable] = useState([]);

    useEffect(() => {
        loadTimetable();
    }, []);

    const loadTimetable = async () => {
        setIsLoading(true);
        const result = await studentService.getTimetable();
        if (result.success) {
            setTimetable(result.data);
        }
        setIsLoading(false);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadTimetable();
        setRefreshing(false);
    };

    if (isLoading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#667eea" />
            </View>
        );
    }

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayMap = { 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday', 6: 'Saturday', 7: 'Sunday' };

    // Group by Day
    const groupedTimetable = days.reduce((acc, day) => {
        acc[day] = timetable.filter(item => {
            // Handle both string and integer formats
            const itemDay = typeof item.day_of_week === 'number' ? dayMap[item.day_of_week] : item.day_of_week;
            return itemDay === day;
        }).sort((a, b) => a.period_number - b.period_number);
        return acc;
    }, {});

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backButton}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Class Timetable</Text>
                <View style={{ width: 60 }} />
            </View>

            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {timetable.length > 0 ? (
                    days.map(day => {
                        const daySchedule = groupedTimetable[day];
                        if (!daySchedule || daySchedule.length === 0) return null;

                        return (
                            <View key={day} style={styles.daySection}>
                                <Text style={styles.dayTitle}>{day}</Text>
                                {daySchedule.map((slot, index) => (
                                    <View key={index} style={styles.slotCard}>
                                        <View style={styles.timeContainer}>
                                            <Text style={styles.timeText}>{slot.start_time?.slice(0, 5)}</Text>
                                            <Text style={styles.timeSubtext}>Start</Text>
                                        </View>
                                        <View style={styles.divider} />
                                        <View style={styles.subjectContainer}>
                                            <Text style={styles.subjectName}>{slot.subject_name || slot.subject || 'Free Period'}</Text>
                                            <Text style={styles.teacherName}>{slot.teacher_name || 'No Teacher'}</Text>
                                        </View>
                                        <View style={styles.periodBadge}>
                                            <Text style={styles.periodText}>P{slot.period_number}</Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        );
                    })
                ) : (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>📅 No timetable available</Text>
                    </View>
                )}
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
        color: '#667eea',
        fontWeight: '600',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    daySection: {
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    dayTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 20,
        marginBottom: 10,
        paddingHorizontal: 5,
    },
    slotCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 10,
        padding: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    timeContainer: {
        width: 60,
        alignItems: 'center',
    },
    timeText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    timeSubtext: {
        fontSize: 10,
        color: '#999',
    },
    divider: {
        width: 1,
        height: 40,
        backgroundColor: '#eee',
        marginHorizontal: 15,
    },
    subjectContainer: {
        flex: 1,
    },
    subjectName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    teacherName: {
        fontSize: 12,
        color: '#666',
    },
    periodBadge: {
        backgroundColor: '#f0f4ff',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    periodText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#667eea',
    },
    emptyState: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
    }
});

export default StudentTimetable;
