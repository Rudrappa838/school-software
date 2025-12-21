import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initial load
    useEffect(() => {
        const storedUser = sessionStorage.getItem('user');
        const token = sessionStorage.getItem('token');
        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    // Broadcast Channel for Multi-tab management
    useEffect(() => {
        const channel = new BroadcastChannel('school_auth_channel');

        channel.onmessage = (event) => {
            if (event.data.type === 'LOGIN_SUCCESS') {
                // If another tab logged in, and we are not the one who just initiated it (though difficult to distinguish without ID, 
                // but generally if we are already logged in, we might want to close/logout to enforce "single window" feel,
                // OR arguably, if we are already logged in, do we stay? Content says "old window should close")

                // If we are logged in, and someone else logs in, we should probably logout/close.
                if (user) {
                    // alert('New login detected in another window. This window will be closed/logged out.');
                    logout(false, true); // remote logout
                    // Try to close window (often blocked by browser, but worth a try if requested)
                    try { window.close(); } catch (e) { }
                }
            }
            if (event.data.type === 'LOGOUT') {
                // Keep states in sync? Maybe not needed for this specific request but good practice.
                if (user) logout(false, true);
            }
        };

        return () => {
            channel.close();
        };
    }, [user]);

    const login = async (email, password, role) => {
        try {
            const response = await api.post('/auth/login', { email, password, role });
            const { token, user } = response.data;

            sessionStorage.setItem('token', token);
            sessionStorage.setItem('user', JSON.stringify(user));
            setUser(user);

            // Broadcast login to other tabs
            const channel = new BroadcastChannel('school_auth_channel');
            channel.postMessage({ type: 'LOGIN_SUCCESS' });
            channel.close();

            return { success: true };
        } catch (error) {
            console.error("Login failed", error);
            return {
                success: false,
                message: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const logout = async (isAutoLogout = false, isRemote = false) => {
        try {
            if (!isRemote && !isAutoLogout) {
                // Only broadcast if WE initiated the logout
                const channel = new BroadcastChannel('school_auth_channel');
                channel.postMessage({ type: 'LOGOUT' });
                channel.close();

                // Call API
                await api.post('/auth/logout');
            }
        } catch (error) {
            console.error("Logout API failed", error);
        } finally {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('user');
            setUser(null);
            if (isAutoLogout) alert("Session timed out due to inactivity.");
        }
    };

    // Auto-logout on inactivity
    useEffect(() => {
        if (!user) return;

        const TIMEOUT_DURATION = 10 * 60 * 1000; // 10 minutes
        let timeoutId;

        const resetTimer = () => {
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                logout(true);
            }, TIMEOUT_DURATION);
        };

        const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove'];
        events.forEach(event => document.addEventListener(event, resetTimer));

        resetTimer(); // Start timer

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
            events.forEach(event => document.removeEventListener(event, resetTimer));
        };
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
