import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
    TextInput,
    RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { studentService } from '../../services/student.service';

const StudentLeaves = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [leaves, setLeaves] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newLeave, setNewLeave] = useState({
        startDate: '',
        endDate: '',
        reason: '',
    });

    useEffect(() => {
        loadLeaves();
    }, []);

    const loadLeaves = async () => {
        setIsLoading(true);
        const result = await studentService.getLeaves();
        if (result.success) {
            setLeaves(result.data?.leaves || []);
        }
        setIsLoading(false);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadLeaves();
        setRefreshing(false);
    };

    const handleSubmit = async () => {
        if (!newLeave.startDate || !newLeave.endDate || !newLeave.reason) {
            alert('Please fill all fields');
            return;
        }

        const result = await studentService.submitLeave(newLeave);
        if (result.success) {
            setShowForm(false);
            setNewLeave({ startDate: '', endDate: '', reason: '' });
            loadLeaves();
        }
    };

    if (isLoading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#667eea" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backButton}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Leave Applications</Text>
                <TouchableOpacity onPress={() => setShowForm(!showForm)}>
                    <Text style={styles.addButton}>{showForm ? '✕' : '+'}</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {showForm && (
                    <View style={styles.formContainer}>
                        <LinearGradient
                            colors={['#43e97b', '#38f9d7']}
                            style={styles.formGradient}
                        >
                            <Text style={styles.formTitle}>Apply for Leave</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Start Date (YYYY-MM-DD)"
                                placeholderTextColor="#999"
                                value={newLeave.startDate}
                                onChangeText={(text) =>
                                    setNewLeave({ ...newLeave, startDate: text })
                                }
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="End Date (YYYY-MM-DD)"
                                placeholderTextColor="#999"
                                value={newLeave.endDate}
                                onChangeText={(text) =>
                                    setNewLeave({ ...newLeave, endDate: text })
                                }
                            />
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Reason for leave..."
                                placeholderTextColor="#999"
                                multiline
                                numberOfLines={4}
                                value={newLeave.reason}
                                onChangeText={(text) =>
                                    setNewLeave({ ...newLeave, reason: text })
                                }
                            />
                            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                                <Text style={styles.submitText}>Submit Application</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>
                )}

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>My Applications</Text>
                    {leaves.length > 0 ? (
                        leaves.map((leave, index) => (
                            <View key={index} style={styles.leaveCard}>
                                <View style={styles.leaveHeader}>
                                    <Text style={styles.leaveDates}>
                                        📅 {leave.start_date} to {leave.end_date}
                                    </Text>
                                    <View
                                        style={[
                                            styles.statusBadge,
                                            {
                                                backgroundColor:
                                                    leave.status === 'Approved'
                                                        ? '#43e97b'
                                                        : leave.status === 'Rejected'
                                                            ? '#fa709a'
                                                            : '#ffa726',
                                            },
                                        ]}
                                    >
                                        <Text style={styles.statusText}>{leave.status}</Text>
                                    </View>
                                </View>
                                <Text style={styles.leaveReason}>{leave.reason}</Text>
                                <Text style={styles.leaveDays}>
                                    Duration: {leave.days} day{leave.days > 1 ? 's' : ''}
                                </Text>
                                {leave.admin_remarks && (
                                    <View style={styles.remarksContainer}>
                                        <Text style={styles.remarksLabel}>Admin Remarks:</Text>
                                        <Text style={styles.remarksText}>{leave.admin_remarks}</Text>
                                    </View>
                                )}
                            </View>
                        ))
                    ) : (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>
                                📝 No leave applications yet
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
    addButton: {
        fontSize: 28,
        color: '#43e97b',
        fontWeight: '300',
    },
    formContainer: {
        padding: 20,
    },
    formGradient: {
        borderRadius: 20,
        padding: 20,
    },
    formTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 15,
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        fontSize: 16,
        color: '#333',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    submitButton: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        alignItems: 'center',
    },
    submitText: {
        color: '#43e97b',
        fontSize: 16,
        fontWeight: 'bold',
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
    leaveCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 12,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    leaveHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    leaveDates: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
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
    leaveReason: {
        fontSize: 14,
        color: '#555',
        marginBottom: 8,
        lineHeight: 20,
    },
    leaveDays: {
        fontSize: 12,
        color: '#999',
    },
    remarksContainer: {
        marginTop: 15,
        padding: 12,
        backgroundColor: '#fff5e6',
        borderRadius: 10,
        borderLeftWidth: 4,
        borderLeftColor: '#ffa726',
    },
    remarksLabel: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#ffa726',
        marginBottom: 5,
    },
    remarksText: {
        fontSize: 13,
        color: '#666',
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
        textAlign: 'center',
    },
});

export default StudentLeaves;
