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

const StudentLibrary = ({ navigation }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [books, setBooks] = useState([]);

    useEffect(() => {
        loadBooks();
    }, []);

    const loadBooks = async () => {
        setIsLoading(true);
        const result = await studentService.getLibraryBooks();
        if (result.success) {
            setBooks(result.data?.books || []);
        }
        setIsLoading(false);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadBooks();
        setRefreshing(false);
    };

    const isOverdue = (dueDate) => {
        return new Date(dueDate) < new Date();
    };

    if (isLoading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#667eea" />
            </View>
        );
    }

    const activeBooks = books.filter((b) => b.status === 'Issued');
    const returnedBooks = books.filter((b) => b.status === 'Returned');

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backButton}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Library Books</Text>
                <View style={{ width: 60 }} />
            </View>

            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {/* Stats */}
                <View style={styles.statsContainer}>
                    <LinearGradient
                        colors={['#667eea', '#764ba2']}
                        style={styles.statCard}
                    >
                        <Text style={styles.statNumber}>{activeBooks.length}</Text>
                        <Text style={styles.statLabel}>Currently Issued</Text>
                    </LinearGradient>
                    <LinearGradient
                        colors={['#43e97b', '#38f9d7']}
                        style={styles.statCard}
                    >
                        <Text style={styles.statNumber}>{returnedBooks.length}</Text>
                        <Text style={styles.statLabel}>Returned</Text>
                    </LinearGradient>
                </View>

                {/* Active Books */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📚 Issued Books</Text>
                    {activeBooks.length > 0 ? (
                        activeBooks.map((book, index) => (
                            <View key={index} style={styles.bookCard}>
                                <View style={styles.bookHeader}>
                                    <View style={styles.bookIcon}>
                                        <Text style={styles.bookIconText}>📖</Text>
                                    </View>
                                    <View style={styles.bookInfo}>
                                        <Text style={styles.bookTitle}>{book.title}</Text>
                                        <Text style={styles.bookAuthor}>by {book.author}</Text>
                                        <Text style={styles.bookISBN}>ISBN: {book.isbn}</Text>
                                    </View>
                                </View>
                                <View style={styles.bookDates}>
                                    <View style={styles.dateRow}>
                                        <Text style={styles.dateLabel}>Issued:</Text>
                                        <Text style={styles.dateValue}>{book.issue_date}</Text>
                                    </View>
                                    <View style={styles.dateRow}>
                                        <Text style={styles.dateLabel}>Due:</Text>
                                        <Text
                                            style={[
                                                styles.dateValue,
                                                isOverdue(book.due_date) && styles.overdueText,
                                            ]}
                                        >
                                            {book.due_date}
                                        </Text>
                                    </View>
                                </View>
                                {isOverdue(book.due_date) && (
                                    <View style={styles.overdueWarning}>
                                        <Text style={styles.overdueWarningText}>
                                            ⚠️ Book is overdue! Please return soon.
                                        </Text>
                                    </View>
                                )}
                            </View>
                        ))
                    ) : (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>📚 No books currently issued</Text>
                        </View>
                    )}
                </View>

                {/* History */}
                {returnedBooks.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>📋 History</Text>
                        {returnedBooks.map((book, index) => (
                            <View key={index} style={styles.historyCard}>
                                <Text style={styles.historyTitle}>{book.title}</Text>
                                <Text style={styles.historyDate}>
                                    Returned on {book.return_date}
                                </Text>
                            </View>
                        ))}
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
    statsContainer: {
        flexDirection: 'row',
        padding: 20,
        gap: 15,
    },
    statCard: {
        flex: 1,
        padding: 20,
        borderRadius: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    statNumber: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },
    statLabel: {
        fontSize: 12,
        color: '#fff',
        fontWeight: '600',
        textAlign: 'center',
    },
    section: {
        padding: 20,
        paddingTop: 0,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    bookCard: {
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
    bookHeader: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    bookIcon: {
        width: 60,
        height: 60,
        backgroundColor: '#f0f4ff',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    bookIconText: {
        fontSize: 30,
    },
    bookInfo: {
        flex: 1,
    },
    bookTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    bookAuthor: {
        fontSize: 13,
        color: '#666',
        marginBottom: 2,
    },
    bookISBN: {
        fontSize: 11,
        color: '#999',
    },
    bookDates: {
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 12,
    },
    dateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    dateLabel: {
        fontSize: 13,
        color: '#666',
    },
    dateValue: {
        fontSize: 13,
        fontWeight: '600',
        color: '#333',
    },
    overdueText: {
        color: '#fa709a',
    },
    overdueWarning: {
        marginTop: 12,
        padding: 10,
        backgroundColor: '#fff0f0',
        borderRadius: 8,
        borderLeftWidth: 3,
        borderLeftColor: '#fa709a',
    },
    overdueWarningText: {
        fontSize: 12,
        color: '#fa709a',
        fontWeight: '600',
    },
    historyCard: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
        borderLeftWidth: 3,
        borderLeftColor: '#43e97b',
    },
    historyTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    historyDate: {
        fontSize: 12,
        color: '#999',
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

export default StudentLibrary;
