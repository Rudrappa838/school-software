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

const StudentAcademics = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [academicsData, setAcademicsData] = useState(null);
    const [selectedExam, setSelectedExam] = useState('All');
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        loadAcademics();
    }, [selectedDate]);

    const loadAcademics = async () => {
        setIsLoading(true);
        const month = selectedDate.getMonth();
        const year = selectedDate.getFullYear();
        const result = await studentService.getMarks(month, year);
        if (result.success) {
            setAcademicsData(result.data);
        }
        setIsLoading(false);
    };

    const changeMonth = (increment) => {
        const newDate = new Date(selectedDate);
        newDate.setMonth(newDate.getMonth() + increment);
        setSelectedDate(newDate);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadAcademics();
        setRefreshing(false);
    };

    if (isLoading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#667eea" />
            </View>
        );
    }

    const marks = academicsData?.marks || [];
    const exams = academicsData?.upcomingExams || [];

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backButton}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Academics & Exams</Text>
                <View style={{ width: 60 }} />
            </View>

            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {/* Month Selector */}
                <View style={styles.monthSelector}>
                    <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.arrowButton}>
                        <Text style={styles.arrowText}>‹</Text>
                    </TouchableOpacity>
                    <View style={styles.monthDisplay}>
                        <Text style={styles.monthText}>
                            {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
                        </Text>
                    </View>
                    <TouchableOpacity onPress={() => changeMonth(1)} style={styles.arrowButton}>
                        <Text style={styles.arrowText}>›</Text>
                    </TouchableOpacity>
                </View>
                {/* Upcoming Exams */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Upcoming Exams</Text>
                    {exams.length > 0 ? (
                        exams.map((exam, index) => (
                            <LinearGradient
                                key={index}
                                colors={['#667eea', '#764ba2']}
                                style={styles.examCard}
                            >
                                <View style={styles.examHeader}>
                                    <Text style={styles.examName}>{exam.examName}</Text>
                                    <Text style={styles.examDate}>{exam.date}</Text>
                                </View>
                                <Text style={styles.examSubject}>{exam.subject}</Text>
                                <Text style={styles.examTime}>⏰ {exam.time}</Text>
                            </LinearGradient>
                        ))
                    ) : (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>📅 No upcoming exams</Text>
                        </View>
                    )}
                </View>

                {/* Exam Filter Dropdown */}
                <View style={styles.filterSection}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.filterContainer}
                        contentContainerStyle={{ paddingRight: 20 }}
                    >
                        <TouchableOpacity
                            style={[
                                styles.filterTab,
                                selectedExam === 'All' && styles.filterTabActive
                            ]}
                            onPress={() => setSelectedExam('All')}
                        >
                            <Text style={[
                                styles.filterText,
                                selectedExam === 'All' && styles.filterTextActive
                            ]}>All Exams</Text>
                        </TouchableOpacity>

                        {[...new Set(marks.map(m => m.examType || 'Term Exams'))].map((exam, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.filterTab,
                                    selectedExam === exam && styles.filterTabActive
                                ]}
                                onPress={() => setSelectedExam(exam)}
                            >
                                <Text style={[
                                    styles.filterText,
                                    selectedExam === exam && styles.filterTextActive
                                ]}>{exam}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Marks & Results */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>My Report Card</Text>
                    {marks.length > 0 ? (
                        Object.entries(
                            marks.reduce((acc, mark) => {
                                const exam = mark.examType || 'Term Exams';
                                if (!acc[exam]) acc[exam] = [];
                                acc[exam].push(mark);
                                return acc;
                            }, {})
                        )
                            .filter(([examType]) => selectedExam === 'All' || examType === selectedExam)
                            .map(([examType, examMarks], index) => {
                                // Calculate Totals for this Exam
                                const totalObtained = examMarks.reduce((sum, m) => sum + parseFloat(m.marks || 0), 0);
                                const totalMax = examMarks.reduce((sum, m) => sum + parseFloat(m.totalMarks || 0), 0);
                                const percent = totalMax > 0 ? ((totalObtained / totalMax) * 100).toFixed(1) : 0;

                                return (
                                    <View key={index} style={styles.marksheetContainer}>
                                        <View style={styles.marksheetHeader}>
                                            <Text style={styles.marksheetTitle}>{examType}</Text>
                                            <View style={styles.scoreBadge}>
                                                <Text style={styles.scoreBadgeText}>{percent}%</Text>
                                            </View>
                                        </View>

                                        <View style={styles.tableHeader}>
                                            <Text style={[styles.tableHeadText, { flex: 2 }]}>Subject</Text>
                                            <Text style={[styles.tableHeadText, { flex: 1, textAlign: 'center' }]}>Marks</Text>
                                            <Text style={[styles.tableHeadText, { flex: 1, textAlign: 'right' }]}>Grade</Text>
                                        </View>

                                        {examMarks.map((mark, mIndex) => (
                                            <View key={mIndex} style={styles.tableRow}>
                                                <Text style={[styles.subjectText, { flex: 2 }]}>{mark.subject}</Text>
                                                <View style={{ flex: 1, alignItems: 'center' }}>
                                                    <Text style={styles.marksText}>{mark.marks}/{mark.totalMarks}</Text>
                                                </View>
                                                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                                    <View style={[
                                                        styles.miniGradeBadge,
                                                        { backgroundColor: mark.grade?.startsWith('A') ? '#43e97b' : mark.grade === 'B' ? '#4facfe' : '#ffa726' }
                                                    ]}>
                                                        <Text style={styles.miniGradeText}>{mark.grade}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        ))}

                                        <View style={styles.marksheetFooter}>
                                            <Text style={styles.footerText}>Total: {totalObtained} / {totalMax}</Text>
                                            <Text style={styles.footerText}>Result: {percent >= 35 ? 'PASS' : 'FAIL'}</Text>
                                        </View>
                                    </View>
                                );
                            })
                    ) : (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>📊 No marks available yet</Text>
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
        color: '#667eea',
        fontWeight: '600',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    section: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    examCard: {
        padding: 20,
        borderRadius: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    examHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    examName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    examDate: {
        fontSize: 14,
        color: '#fff',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    examSubject: {
        fontSize: 16,
        color: '#fff',
        marginBottom: 8,
        fontWeight: '500',
    },
    examTime: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.9)',
    },
    markCard: {
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
    markHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    markSubjectContainer: {
        flex: 1,
    },
    markSubject: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 3,
    },
    markExam: {
        fontSize: 12,
        color: '#666',
    },
    markScoreContainer: {
        alignItems: 'flex-end',
    },
    markScore: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    gradeBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    gradeText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    markRemarks: {
        fontSize: 12,
        color: '#666',
        marginTop: 10,
        fontStyle: 'italic',
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
    marksheetContainer: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 15,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    marksheetHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 10,
    },
    marksheetTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    scoreBadge: {
        backgroundColor: '#667eea',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    scoreBadgeText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    tableHeader: {
        flexDirection: 'row',
        marginBottom: 10,
        paddingHorizontal: 5,
    },
    tableHeadText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#999',
        textTransform: 'uppercase',
    },
    tableRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        paddingHorizontal: 5,
    },
    subjectText: {
        fontSize: 15,
        color: '#333',
        fontWeight: '500',
    },
    marksText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#333',
    },
    miniGradeBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
    },
    miniGradeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    marksheetFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    footerText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#667eea',
    },
    filterSection: {
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    filterContainer: {
        flexDirection: 'row',
    },
    filterTab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#fff',
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#eee',
    },
    filterTabActive: {
        backgroundColor: '#667eea',
        borderColor: '#667eea',
    },
    filterText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    filterTextActive: {
        color: '#fff',
        fontWeight: 'bold',
    },
    monthSelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginVertical: 20,
    },
    arrowButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    arrowText: {
        fontSize: 24,
        color: '#667eea',
        fontWeight: 'bold',
        marginTop: -2,
    },
    monthDisplay: {
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 25,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    monthText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
});

export default StudentAcademics;
