import api from './api.service';
import { ENDPOINTS } from '../config/api';

export const staffService = {
    // Get staff profile
    getProfile: async () => {
        try {
            const response = await api.get(ENDPOINTS.STAFF_PROFILE);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Failed to fetch profile' };
        }
    },

    // Get attendance
    getAttendance: async () => {
        try {
            const response = await api.get(ENDPOINTS.STAFF_ATTENDANCE);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Failed to fetch attendance' };
        }
    },

    // Get salary
    getSalary: async () => {
        try {
            const response = await api.get(ENDPOINTS.STAFF_SALARY);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Failed to fetch salary' };
        }
    },

    // Get leaves
    getLeaves: async () => {
        try {
            const response = await api.get(ENDPOINTS.STAFF_LEAVES);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Failed to fetch leaves' };
        }
    },

    // Submit leave
    submitLeave: async (leaveData) => {
        try {
            const response = await api.post(ENDPOINTS.STAFF_LEAVES, leaveData);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Failed to submit leave' };
        }
    },

    // Get daily status
    getDailyStatus: async () => {
        try {
            const response = await api.get(ENDPOINTS.STAFF_DAILY_STATUS);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Failed to fetch daily status' };
        }
    },

    // Submit daily status
    submitDailyStatus: async (statusData) => {
        try {
            const response = await api.post(ENDPOINTS.STAFF_DAILY_STATUS, statusData);
            return { success: true, data: response.data };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Failed to submit daily status' };
        }
    },
};
