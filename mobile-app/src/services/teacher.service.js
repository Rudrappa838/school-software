import api from './api.service';
import { ENDPOINTS } from '../config/api';

export const teacherService = {
    // Get teacher profile
    getProfile: async () => {
        try {
            const response = await api.get(ENDPOINTS.TEACHER_PROFILE);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Failed to fetch profile' };
        }
    },

    // Get attendance
    getAttendance: async () => {
        try {
            const response = await api.get(ENDPOINTS.TEACHER_ATTENDANCE);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Failed to fetch attendance' };
        }
    },

    // Get salary
    getSalary: async () => {
        try {
            const response = await api.get(ENDPOINTS.TEACHER_SALARY);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Failed to fetch salary' };
        }
    },

    // Get timetable
    getTimetable: async () => {
        try {
            const response = await api.get(ENDPOINTS.TEACHER_TIMETABLE);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Failed to fetch timetable' };
        }
    },

    // Get my students
    getMyStudents: async () => {
        try {
            const response = await api.get(ENDPOINTS.TEACHER_STUDENTS);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Failed to fetch students' };
        }
    },

    // Get leaves
    getLeaves: async () => {
        try {
            const response = await api.get(ENDPOINTS.TEACHER_LEAVES);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Failed to fetch leaves' };
        }
    },

    // Submit leave
    submitLeave: async (leaveData) => {
        try {
            const response = await api.post(ENDPOINTS.TEACHER_LEAVES, leaveData);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Failed to submit leave' };
        }
    },

    // Get doubts
    getDoubts: async () => {
        try {
            const response = await api.get(ENDPOINTS.TEACHER_DOUBTS);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Failed to fetch doubts' };
        }
    },

    // Respond to doubt
    respondToDoubt: async (doubtId, response) => {
        try {
            const result = await api.post(`${ENDPOINTS.TEACHER_DOUBTS}/${doubtId}/respond`, { response });
            return { success: true, data: result.data };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Failed to respond to doubt' };
        }
    },

    // Get daily status
    getDailyStatus: async () => {
        try {
            const response = await api.get(ENDPOINTS.TEACHER_DAILY_STATUS);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Failed to fetch daily status' };
        }
    },

    // Submit daily status
    submitDailyStatus: async (statusData) => {
        try {
            const response = await api.post(ENDPOINTS.TEACHER_DAILY_STATUS, statusData);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Failed to submit daily status' };
        }
    },
};
