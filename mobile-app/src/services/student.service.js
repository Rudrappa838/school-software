import api from './api.service';
import { ENDPOINTS } from '../config/api';

export const studentService = {
    // Get student profile
    getProfile: async () => {
        try {
            const response = await api.get(ENDPOINTS.STUDENT_PROFILE);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Failed to fetch profile' };
        }
    },

    // Get attendance
    getAttendance: async (month, year) => {
        try {
            let url = ENDPOINTS.STUDENT_ATTENDANCE;
            if (month !== undefined && year !== undefined) {
                url += `?month=${month + 1}&year=${year}`;
            }
            const response = await api.get(url);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Failed to fetch attendance' };
        }
    },

    // Get fees
    getFees: async () => {
        try {
            const response = await api.get(ENDPOINTS.STUDENT_FEES);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Failed to fetch fees' };
        }
    },

    // Get marks
    getMarks: async (month, year) => {
        try {
            let url = ENDPOINTS.STUDENT_MARKS;
            if (month !== undefined && year !== undefined) {
                // Backend expects 1-based month for EXTRACT function
                url += `?month=${month + 1}&year=${year}`;
            }
            const response = await api.get(url);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Failed to fetch marks' };
        }
    },

    // Get timetable
    getTimetable: async () => {
        try {
            const response = await api.get(ENDPOINTS.STUDENT_TIMETABLE);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Failed to fetch timetable' };
        }
    },

    // Get library books
    getLibraryBooks: async () => {
        try {
            const response = await api.get(ENDPOINTS.STUDENT_LIBRARY);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Failed to fetch library books' };
        }
    },

    // Get transport details
    getTransport: async () => {
        try {
            const response = await api.get(ENDPOINTS.STUDENT_TRANSPORT);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Failed to fetch transport details' };
        }
    },

    // Get hostel details
    getHostel: async () => {
        try {
            const response = await api.get(ENDPOINTS.STUDENT_HOSTEL);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Failed to fetch hostel details' };
        }
    },

    // Get certificates
    getCertificates: async () => {
        try {
            const response = await api.get(ENDPOINTS.STUDENT_CERTIFICATES);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Failed to fetch certificates' };
        }
    },

    // Get leaves
    getLeaves: async () => {
        try {
            const response = await api.get(ENDPOINTS.STUDENT_LEAVES);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Failed to fetch leaves' };
        }
    },

    // Submit leave
    submitLeave: async (leaveData) => {
        try {
            const response = await api.post(ENDPOINTS.STUDENT_LEAVES, leaveData);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Failed to submit leave' };
        }
    },

    // Get doubts
    getDoubts: async () => {
        try {
            const response = await api.get(ENDPOINTS.STUDENT_DOUBTS + '/student');
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Failed to fetch doubts' };
        }
    },

    // Submit doubt
    submitDoubt: async (doubtData) => {
        try {
            const response = await api.post(ENDPOINTS.STUDENT_DOUBTS, doubtData);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Failed to submit doubt' };
        }
    },

    // Get calendar events
    getCalendarEvents: async () => {
        try {
            const response = await api.get(ENDPOINTS.STUDENT_CALENDAR);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Failed to fetch events' };
        }
    },
};
