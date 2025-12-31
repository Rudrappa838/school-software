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

const StudentTransport = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [transportData, setTransportData] = useState(null);

    useEffect(() => {
        loadTransport();
    }, []);

    const loadTransport = async () => {
        setIsLoading(true);
        const result = await studentService.getTransport();
        if (result.success) {
            setTransportData(result.data);
        }
        setIsLoading(false);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadTransport();
        setRefreshing(false);
    };

    if (isLoading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#667eea" />
            </View>
        );
    }

    if (!transportData?.route_id) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={styles.backButton}>← Back</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>School Bus</Text>
                    <View style={{ width: 60 }} />
                </View>
                <View style={styles.notAllocated}>
                    <Text style={styles.notAllocatedIcon}>🚌</Text>
                    <Text style={styles.notAllocatedTitle}>No Transport Allocated</Text>
                    <Text style={styles.notAllocatedText}>
                        You have not subscribed to school transport.
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
                <Text style={styles.headerTitle}>Track School Bus</Text>
                <View style={{ width: 60 }} />
            </View>

            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {/* Route Info */}
                <View style={styles.section}>
                    <LinearGradient
                        colors={['#4facfe', '#00f2fe']}
                        style={styles.routeCard}
                    >
                        <View style={styles.routeHeader}>
                            <Text style={styles.busIcon}>🚌</Text>
                            <View style={styles.routeInfo}>
                                <Text style={styles.routeLabel}>Route</Text>
                                <Text style={styles.routeName}>{transportData.route_name}</Text>
                            </View>
                        </View>
                        <View style={styles.routeDetails}>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Vehicle:</Text>
                                <Text style={styles.detailValue}>{transportData.vehicle_number}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Pickup Point:</Text>
                                <Text style={styles.detailValue}>{transportData.pickup_point}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Pickup Time:</Text>
                                <Text style={styles.detailValue}>{transportData.pickup_time}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.detailLabel}>Drop Time:</Text>
                                <Text style={styles.detailValue}>{transportData.drop_time}</Text>
                            </View>
                        </View>
                    </LinearGradient>
                </View>

                {/* Driver Info */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>👨‍✈️ Driver Details</Text>
                    <View style={styles.driverCard}>
                        <View style={styles.driverAvatar}>
                            <Text style={styles.driverIcon}>👨‍✈️</Text>
                        </View>
                        <View style={styles.driverInfo}>
                            <Text style={styles.driverName}>{transportData.driver_name}</Text>
                            <Text style={styles.driverPhone}>📞 {transportData.driver_phone}</Text>
                        </View>
                    </View>
                </View>

                {/* Live Tracking (Placeholder) */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📍 Live Location</Text>
                    <View style={styles.mapPlaceholder}>
                        {transportData.current_lat ? (
                            <>
                                <Text style={styles.mapIcon}>🛰️</Text>
                                <Text style={styles.mapText}>Real-time Location</Text>
                                <Text style={styles.coordinates}>
                                    Lat: {parseFloat(transportData.current_lat).toFixed(4)} | Lng: {parseFloat(transportData.current_lng).toFixed(4)}
                                </Text>
                                <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
                                    <Text style={styles.refreshText}>🔄 Refresh Status</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                <Text style={styles.mapIcon}>🗺️</Text>
                                <Text style={styles.mapText}>Bus Tracking</Text>
                                <Text style={styles.mapSubtext}>
                                    {transportData.is_tracking ? 'Waiting for GPS signal...' : 'Tracking not available'}
                                </Text>
                            </>
                        )}
                    </View>
                </View>

                {/* Monthly Pass */}
                {transportData.monthly_fee && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>💰 Monthly Fee</Text>
                        <View style={styles.feeCard}>
                            <Text style={styles.feeAmount}>₹{transportData.monthly_fee}</Text>
                            <Text style={styles.feeLabel}>Per Month</Text>
                            {transportData.payment_status && (
                                <View
                                    style={[
                                        styles.paymentBadge,
                                        {
                                            backgroundColor:
                                                transportData.payment_status === 'Paid' ? '#43e97b' : '#ffa726',
                                        },
                                    ]}
                                >
                                    <Text style={styles.paymentText}>{transportData.payment_status}</Text>
                                </View>
                            )}
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
    routeCard: {
        borderRadius: 20,
        padding: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 10,
    },
    routeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    busIcon: {
        fontSize: 50,
        marginRight: 15,
    },
    routeInfo: {
        flex: 1,
    },
    routeLabel: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: 5,
    },
    routeName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    routeDetails: {
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
    driverCard: {
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
    driverAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#f0f4ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    driverIcon: {
        fontSize: 30,
    },
    driverInfo: {
        flex: 1,
    },
    driverName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    driverPhone: {
        fontSize: 14,
        color: '#4facfe',
    },
    mapPlaceholder: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 40,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    mapIcon: {
        fontSize: 60,
        marginBottom: 15,
    },
    mapText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    mapSubtext: {
        fontSize: 14,
        color: '#666',
    },
    coordinates: {
        fontSize: 16,
        color: '#4facfe',
        fontWeight: 'bold',
        marginBottom: 15,
    },
    refreshButton: {
        backgroundColor: '#f0f4ff',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    refreshText: {
        color: '#4facfe',
        fontSize: 14,
        fontWeight: '600',
    },
    feeCard: {
        backgroundColor: '#fff',
        padding: 25,
        borderRadius: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    feeAmount: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#4facfe',
        marginBottom: 8,
    },
    feeLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 15,
    },
    paymentBadge: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
    },
    paymentText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default StudentTransport;
