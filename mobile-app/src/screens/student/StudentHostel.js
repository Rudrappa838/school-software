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

const StudentHostel = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [hostelData, setHostelData] = useState(null);

    useEffect(() => {
        loadHostelData();
    }, []);

    const loadHostelData = async () => {
        setIsLoading(true);
        const result = await studentService.getHostel();
        if (result.success) {
            setHostelData(result.data);
        }
        setIsLoading(false);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadHostelData();
        setRefreshing(false);
    };

    if (isLoading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#667eea" />
            </View>
        );
    }

    if (!hostelData?.is_allocated) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={styles.backButton}>← Back</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Hostel Rooms</Text>
                    <View style={{ width: 60 }} />
                </View>
                <View style={styles.notAllocated}>
                    <Text style={styles.notAllocatedIcon}>🏠</Text>
                    <Text style={styles.notAllocatedTitle}>No Hostel Allocated</Text>
                    <Text style={styles.notAllocatedText}>
                        You have not been allocated a hostel room yet.
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backButton}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Hostel Room</Text>
                <View style={{ width: 60 }} />
            </View>

            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {/* Room Info Card */}
                <View style={styles.section}>
                    <LinearGradient
                        colors={['#667eea', '#764ba2']}
                        style={styles.roomCard}
                    >
                        <View style={styles.roomHeader}>
                            <Text style={styles.roomIcon}>🏠</Text>
                            <View style={styles.roomInfo}>
                                <Text style={styles.roomLabel}>Room Number</Text>
                                <Text style={styles.roomNumber}>{hostelData.room_number}</Text>
                            </View>
                        </View>
                        <View style={styles.roomDetails}>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Hostel:</Text>
                                <Text style={styles.detailValue}>{hostelData.hostel_name}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Block:</Text>
                                <Text style={styles.detailValue}>{hostelData.block_name}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Floor:</Text>
                                <Text style={styles.detailValue}>{hostelData.floor}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Bed Number:</Text>
                                <Text style={styles.detailValue}>{hostelData.bed_number}</Text>
                            </View>
                        </View>
                    </LinearGradient>
                </View>

                {/* Roommates */}
                {hostelData.roommates && hostelData.roommates.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>👥 Roommates</Text>
                        {hostelData.roommates.map((roommate, index) => (
                            <View key={index} style={styles.roommateCard}>
                                <View style={styles.roommateAvatar}>
                                    <Text style={styles.roommateInitial}>
                                        {roommate.name?.[0]}
                                    </Text>
                                </View>
                                <View style={styles.roommateInfo}>
                                    <Text style={styles.roommateName}>{roommate.name}</Text>
                                    <Text style={styles.roommateClass}>
                                        {roommate.class_name} - {roommate.section_name}
                                    </Text>
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                {/* Fees/Bills */}
                {hostelData.bills && hostelData.bills.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>💰 Hostel Fees</Text>
                        {hostelData.bills.map((bill, index) => (
                            <View key={index} style={styles.billCard}>
                                <View style={styles.billHeader}>
                                    <Text style={styles.billMonth}>{bill.month}</Text>
                                    <View
                                        style={[
                                            styles.billStatus,
                                            {
                                                backgroundColor:
                                                    bill.status === 'Paid' ? '#43e97b' : '#ffa726',
                                            },
                                        ]}
                                    >
                                        <Text style={styles.billStatusText}>{bill.status}</Text>
                                    </View>
                                </View>
                                <Text style={styles.billAmount}>₹{bill.amount}</Text>
                            </View>
                        ))}
                    </View>
                )}

                {/* Warden Info */}
                {hostelData.warden_name && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>👨‍🏫 Hostel Warden</Text>
                        <View style={styles.wardenCard}>
                            <View style={styles.wardenAvatar}>
                                <Text style={styles.wardenIcon}>👨‍🏫</Text>
                            </View>
                            <View style={styles.wardenInfo}>
                                <Text style={styles.wardenName}>{hostelData.warden_name}</Text>
                                {hostelData.warden_phone && (
                                    <Text style={styles.wardenPhone}>
                                        📞 {hostelData.warden_phone}
                                    </Text>
                                )}
                            </View>
                        </View>
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
    notAllocated: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    notAllocatedIcon: {
        fontSize: 80,
        marginBottom: 20,
    },
    notAllocatedTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    notAllocatedText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    section: {
        padding: 20,
    },
    roomCard: {
        borderRadius: 20,
        padding: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 10,
    },
    roomHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    roomIcon: {
        fontSize: 50,
        marginRight: 15,
    },
    roomInfo: {
        flex: 1,
    },
    roomLabel: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: 5,
    },
    roomNumber: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
    },
    roomDetails: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 15,
        padding: 15,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    detailLabel: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    detailValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#fff',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    roommateCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    roommateAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#f0f4ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    roommateInitial: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#667eea',
    },
    roommateInfo: {
        flex: 1,
    },
    roommateName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    roommateClass: {
        fontSize: 13,
        color: '#666',
    },
    billCard: {
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
    billHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    billMonth: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    billStatus: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    billStatusText: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#fff',
    },
    billAmount: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#667eea',
    },
    wardenCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    wardenAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#f0f4ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    wardenIcon: {
        fontSize: 30,
    },
    wardenInfo: {
        flex: 1,
    },
    wardenName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    wardenPhone: {
        fontSize: 14,
        color: '#667eea',
    },
});

export default StudentHostel;
