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

const TeacherSalary = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [salaryData, setSalaryData] = useState(null);

    useEffect(() => {
        loadSalary();
    }, []);

    const loadSalary = async () => {
        setIsLoading(true);
        const result = await teacherService.getSalary();
        if (result.success) {
            setSalaryData(result.data);
        }
        setIsLoading(false);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadSalary();
        setRefreshing(false);
    };

    if (isLoading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#43e97b" />
            </View>
        );
    }

    const basicSalary = salaryData?.basicSalary || 0;
    const allowances = salaryData?.allowances || 0;
    const deductions = salaryData?.deductions || 0;
    const netSalary = salaryData?.netSalary || 0;
    const paymentHistory = salaryData?.paymentHistory || [];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backButton}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Salary</Text>
                <View style={{ width: 60 }} />
            </View>

            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {/* Salary Summary Card */}
                <View style={styles.section}>
                    <LinearGradient
                        colors={['#43e97b', '#38f9d7']}
                        style={styles.summaryCard}
                    >
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Basic Salary</Text>
                            <Text style={styles.summaryValue}>₹{basicSalary}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Allowances</Text>
                            <Text style={[styles.summaryValue, { color: '#fff' }]}>
                                +₹{allowances}
                            </Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Deductions</Text>
                            <Text style={[styles.summaryValue, { color: '#ff6b6b' }]}>
                                -₹{deductions}
                            </Text>
                        </View>
                        <View style={[styles.divider, { backgroundColor: 'rgba(255,255,255,0.5)' }]} />
                        <View style={styles.summaryRow}>
                            <Text style={[styles.summaryLabel, { fontSize: 18, fontWeight: 'bold' }]}>
                                Net Salary
                            </Text>
                            <Text style={[styles.summaryValue, { fontSize: 24 }]}>₹{netSalary}</Text>
                        </View>
                    </LinearGradient>
                </View>

                {/* Payment History */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Payment History</Text>
                    {paymentHistory.length > 0 ? (
                        paymentHistory.map((payment, index) => (
                            <View key={index} style={styles.historyCard}>
                                <View style={styles.historyHeader}>
                                    <View>
                                        <Text style={styles.historyMonth}>{payment.month}</Text>
                                        <Text style={styles.historyDate}>Paid on: {payment.paidDate}</Text>
                                    </View>
                                    <View style={styles.historyAmountContainer}>
                                        <Text style={styles.historyAmount}>₹{payment.amount}</Text>
                                        <View style={[styles.statusBadge, { backgroundColor: '#43e97b' }]}>
                                            <Text style={styles.statusText}>Paid</Text>
                                        </View>
                                    </View>
                                </View>
                                <TouchableOpacity style={styles.viewSlipButton}>
                                    <Text style={styles.viewSlipText}>📄 View Slip</Text>
                                </TouchableOpacity>
                            </View>
                        ))
                    ) : (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>💰 No payment history available</Text>
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
    section: {
        padding: 20,
    },
    summaryCard: {
        borderRadius: 20,
        padding: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 10,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    summaryLabel: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '500',
    },
    summaryValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        marginVertical: 5,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    historyCard: {
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
    historyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    historyMonth: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 3,
    },
    historyDate: {
        fontSize: 12,
        color: '#999',
    },
    historyAmountContainer: {
        alignItems: 'flex-end',
    },
    historyAmount: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: 'bold',
    },
    viewSlipButton: {
        backgroundColor: '#f0f4ff',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
    },
    viewSlipText: {
        color: '#43e97b',
        fontSize: 14,
        fontWeight: '600',
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

export default TeacherSalary;
