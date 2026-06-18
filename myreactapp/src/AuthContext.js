import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const username = localStorage.getItem('username');
        const email = localStorage.getItem('email');
        return username ? { username, email } : null;
    });

    const login = (authData) => {
        localStorage.setItem('access_token', authData.access);
        localStorage.setItem('refresh_token', authData.refresh);
        localStorage.setItem('username', authData.username);
        localStorage.setItem('email', authData.email);
        setUser({ username: authData.username, email: authData.email });
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        setUser(null);
    };

    const updateUser = (userData) => {
        if (userData.email) localStorage.setItem('email', userData.email);
        if (userData.username) localStorage.setItem('username', userData.username);
        setUser(prev => prev ? { ...prev, ...userData } : null);
    };

    const getAuthHeaders = () => {
        const token = localStorage.getItem('access_token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, getAuthHeaders, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
