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

const StudentCertificates = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [certificates, setCertificates] = useState([]);

    useEffect(() => {
        loadCertificates();
    }, []);

    const loadCertificates = async () => {
        setIsLoading(true);
        const result = await studentService.getCertificates();
        if (result.success) {
            setCertificates(result.data?.certificates || []);
        }
        setIsLoading(false);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadCertificates();
        setRefreshing(false);
    };

    if (isLoading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#667eea" />
            </View>
        );
    }

    const availableCertificates = [
        { id: 'bonafide', name: 'Bonafide Certificate', icon: '📜' },
        { id: 'tc', name: 'Transfer Certificate', icon: '📄' },
        { id: 'conduct', name: 'Conduct Certificate', icon: '🎓' },
        { id: 'attendance', name: 'Attendance Certificate', icon: '✅' },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backButton}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Certificates</Text>
                <View style={{ width: 60 }} />
            </View>

            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {/* Request New Certificate */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📋 Request Certificate</Text>
                    {availableCertificates.map((cert) => (
                        <TouchableOpacity key={cert.id} style={styles.certTypeCard}>
                            <Text style={styles.certIcon}>{cert.icon}</Text>
                            <View style={styles.certInfo}>
                                <Text style={styles.certName}>{cert.name}</Text>
                                <Text style={styles.certAction}>Tap to request</Text>
                            </View>
                            <Text style={styles.arrowIcon}>→</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Previous Requests */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📚 My Certificates</Text>
                    {certificates.length > 0 ? (
                        certificates.map((cert, index) => (
                            <View key={index} style={styles.certificateCard}>
                                <View style={styles.certHeader}>
                                    <Text style={styles.certTitle}>{cert.certificate_type}</Text>
                                    <View
                                        style={[
                                            styles.statusBadge,
                                            {
                                                backgroundColor:
                                                    cert.status === 'Approved'
                                                        ? '#43e97b'
                                                        : cert.status === 'Rejected'
                                                            ? '#fa709a'
                                                            : '#ffa726',
                                            },
                                        ]}
                                    >
                                        <Text style={styles.statusText}>{cert.status}</Text>
                                    </View>
                                </View>
                                <Text style={styles.certDate}>Requested: {cert.request_date}</Text>
                                {cert.status === 'Approved' && cert.issue_date && (
                                    <Text style={styles.issueDate}>Issued: {cert.issue_date}</Text>
                                )}
                                {cert.status === 'Approved' && (
                                    <TouchableOpacity style={styles.downloadButton}>
                                        <Text style={styles.downloadText}>📥 Download</Text>
                                    </TouchableOpacity>
                                )}
                                {cert.remarks && (
                                    <View style={styles.remarksBox}>
                                        <Text style={styles.remarksLabel}>Remarks:</Text>
                                        <Text style={styles.remarksText}>{cert.remarks}</Text>
                                    </View>
                                )}
                            </View>
                        ))
                    ) : (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>
                                📜 No certificates requested yet
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
    section: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    certTypeCard: {
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
    certIcon: {
        fontSize: 30,
        marginRight: 15,
    },
    certInfo: {
        flex: 1,
    },
    certName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 3,
    },
    certAction: {
        fontSize: 12,
        color: '#667eea',
    },
    arrowIcon: {
        fontSize: 20,
        color: '#ccc',
    },
    certificateCard: {
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
    certHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    certTitle: {
        fontSize: 16,
        fontWeight: 'bold',
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
    certDate: {
        fontSize: 12,
        color: '#999',
        marginBottom: 4,
    },
    issueDate: {
        fontSize: 12,
        color: '#43e97b',
        fontWeight: '600',
        marginBottom: 10,
    },
    downloadButton: {
        backgroundColor: '#667eea',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    downloadText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    remarksBox: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#f0f4ff',
        borderRadius: 8,
        borderLeftWidth: 3,
        borderLeftColor: '#667eea',
    },
    remarksLabel: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#667eea',
        marginBottom: 4,
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

export default StudentCertificates;
