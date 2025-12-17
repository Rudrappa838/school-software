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

const StudentDoubts = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [doubts, setDoubts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [newDoubt, setNewDoubt] = useState({ subject: '', question: '' });

    useEffect(() => {
        loadDoubts();
    }, []);

    const loadDoubts = async () => {
        setIsLoading(true);
        const result = await studentService.getDoubts();
        if (result.success) {
            setDoubts(result.data?.doubts || []);
        }
        setIsLoading(false);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadDoubts();
        setRefreshing(false);
    };

    const handleSubmit = async () => {
        if (!newDoubt.subject || !newDoubt.question) {
            alert('Please fill all fields');
            return;
        }

        const result = await studentService.submitDoubt(newDoubt);
        if (result.success) {
            setShowForm(false);
            setNewDoubt({ subject: '', question: '' });
            loadDoubts();
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
                <Text style={styles.headerTitle}>Ask Doubts</Text>
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
                            colors={['#667eea', '#764ba2']}
                            style={styles.formGradient}
                        >
                            <Text style={styles.formTitle}>Ask a Question</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Subject"
                                placeholderTextColor="#999"
                                value={newDoubt.subject}
                                onChangeText={(text) =>
                                    setNewDoubt({ ...newDoubt, subject: text })
                                }
                            />
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Your question..."
                                placeholderTextColor="#999"
                                multiline
                                numberOfLines={4}
                                value={newDoubt.question}
                                onChangeText={(text) =>
                                    setNewDoubt({ ...newDoubt, question: text })
                                }
                            />
                            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                                <Text style={styles.submitText}>Submit Question</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>
                )}

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>My Questions</Text>
                    {doubts.length > 0 ? (
                        doubts.map((doubt, index) => (
                            <View key={index} style={styles.doubtCard}>
                                <View style={styles.doubtHeader}>
                                    <Text style={styles.doubtSubject}>{doubt.subject}</Text>
                                    <View
                                        style={[
                                            styles.statusBadge,
                                            {
                                                backgroundColor:
                                                    doubt.status === 'Answered' ? '#43e97b' : '#ffa726',
                                            },
                                        ]}
                                    >
                                        <Text style={styles.statusText}>{doubt.status}</Text>
                                    </View>
                                </View>
                                <Text style={styles.doubtQuestion}>❓ {doubt.question}</Text>
                                <Text style={styles.doubtDate}>{doubt.created_at}</Text>
                                {doubt.answer && (
                                    <View style={styles.answerContainer}>
                                        <Text style={styles.answerLabel}>💡 Teacher's Answer:</Text>
                                        <Text style={styles.answerText}>{doubt.answer}</Text>
                                        {doubt.answered_by && (
                                            <Text style={styles.answeredBy}>- {doubt.answered_by}</Text>
                                        )}
                                    </View>
                                )}
                            </View>
                        ))
                    ) : (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>
                                ❓ No questions yet. Ask your first question!
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
        color: '#667eea',
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
        color: '#667eea',
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
    doubtCard: {
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
    doubtHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    doubtSubject: {
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
    doubtQuestion: {
        fontSize: 14,
        color: '#555',
        marginBottom: 8,
        lineHeight: 20,
    },
    doubtDate: {
        fontSize: 11,
        color: '#999',
    },
    answerContainer: {
        marginTop: 15,
        padding: 15,
        backgroundColor: '#f0f4ff',
        borderRadius: 10,
        borderLeftWidth: 4,
        borderLeftColor: '#667eea',
    },
    answerLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#667eea',
        marginBottom: 8,
    },
    answerText: {
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
        marginBottom: 8,
    },
    answeredBy: {
        fontSize: 11,
        color: '#666',
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
        textAlign: 'center',
    },
});

export default StudentDoubts;
