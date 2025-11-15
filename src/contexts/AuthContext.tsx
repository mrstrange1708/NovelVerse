"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiService, User } from '@/lib/api';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUserState] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Load user and auth state from localStorage on mount
        const token = apiService.getToken();
        const storedUser = apiService.getUser();
        
        if (token && storedUser) {
            setUserState(storedUser);
            setIsAuthenticated(true);
        }
        
        setIsLoading(false);
    }, []);

    const setUser = (newUser: User) => {
        setUserState(newUser);
        apiService.setUser(newUser);
    };

    const login = async (email: string, password: string) => {
        try {
            const response = await apiService.login({ email, password });
            console.log('Login response:', response);
            
            if (response.user) {
                setUserState(response.user);
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const logout = () => {
        apiService.logout();
        setUserState(null);
        setIsAuthenticated(false);
    };

    const value: AuthContextType = {
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        setUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
