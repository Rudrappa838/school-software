import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { studentService } from '../../services/student.service';

const StudentFees = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [feesData, setFeesData] = useState(null);

    useEffect(() => {
        loadFees();
    }, []);

    const loadFees = async () => {
        setIsLoading(true);
        const result = await studentService.getFees();
        if (result.success) {
            setFeesData(result.data);
        }
        setIsLoading(false);
    };

    if (isLoading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#667eea" />
            </View>
        );
    }

    const totalFees = feesData?.totalFees || 0;
    const paidAmount = feesData?.paidAmount || 0;
    const pendingAmount = feesData?.pendingAmount || 0;
    const paymentHistory = feesData?.paymentHistory || [];

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backButton}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Fee Status</Text>
                <View style={{ width: 60 }} />
            </View>

            <ScrollView>
                {/* Fee Summary Card */}
                <View style={styles.summarySection}>
                    <LinearGradient
                        colors={['#4facfe', '#00f2fe']}
                        style={styles.summaryCard}
                    >
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Total Fees</Text>
                            <Text style={styles.summaryValue}>₹{totalFees}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Paid Amount</Text>
                            <Text style={[styles.summaryValue, { color: '#43e97b' }]}>
                                ₹{paidAmount}
                            </Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Pending Amount</Text>
                            <Text style={[styles.summaryValue, { color: '#ff6b6b' }]}>
                                ₹{pendingAmount}
                            </Text>
                        </View>
                    </LinearGradient>
                </View>

                {/* Payment Status */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Payment Status</Text>
                    <View style={styles.statusCard}>
                        {pendingAmount > 0 ? (
                            <View>
                                <Text style={styles.statusIcon}>⚠️</Text>
                                <Text style={styles.statusText}>Payment Pending</Text>
                                <Text style={styles.statusDesc}>
                                    You have ₹{pendingAmount} pending fees
                                </Text>

                            </View>
                        ) : (
                            <View>
                                <Text style={styles.statusIcon}>✅</Text>
                                <Text style={styles.statusText}>All Paid</Text>
                                <Text style={styles.statusDesc}>
                                    No pending fees at the moment
                                </Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Payment History */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Payment History</Text>
                    {paymentHistory.length > 0 ? (
                        paymentHistory.map((payment, index) => (
                            <View key={index} style={styles.historyCard}>
                                <View style={styles.historyHeader}>
                                    <View>
                                        <Text style={styles.historyDate}>{payment.date}</Text>
                                        <Text style={styles.historyType}>{payment.feeType}</Text>
                                    </View>
                                    <View style={styles.historyAmountContainer}>
                                        <Text style={styles.historyAmount}>₹{payment.amount}</Text>
                                        <View
                                            style={[
                                                styles.historyStatus,
                                                {
                                                    backgroundColor:
                                                        payment.status === 'Paid' ? '#43e97b' : '#ffa726',
                                                },
                                            ]}
                                        >
                                            <Text style={styles.historyStatusText}>
                                                {payment.status}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                {payment.receiptNo && (
                                    <Text style={styles.receiptNo}>
                                        Receipt: {payment.receiptNo}
                                    </Text>
                                )}
                            </View>
                        ))
                    ) : (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>
                                💳 No payment history available
                            </Text>
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
    summarySection: {
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
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        marginVertical: 5,
    },
    section: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    statusCard: {
        backgroundColor: '#fff',
        padding: 30,
        borderRadius: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    statusIcon: {
        fontSize: 50,
        textAlign: 'center',
        marginBottom: 10,
    },
    statusText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 5,
    },
    statusDesc: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
    payButton: {
        backgroundColor: '#667eea',
        paddingHorizontal: 40,
        paddingVertical: 12,
        borderRadius: 25,
        shadowColor: '#667eea',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    payButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
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
    },
    historyDate: {
        fontSize: 14,
        color: '#666',
        marginBottom: 3,
    },
    historyType: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    historyAmountContainer: {
        alignItems: 'flex-end',
    },
    historyAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    historyStatus: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    historyStatusText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: 'bold',
    },
    receiptNo: {
        fontSize: 12,
        color: '#999',
        marginTop: 8,
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

export default StudentFees;
