"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiService } from '@/lib/api';

interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    booksRead: number;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const isAuthenticated = !!user;

    useEffect(() => {
        // Check if user is already logged in (token exists)
        const token = apiService.getToken();
        if (token) {
            // You could decode the JWT token here to get user info
            // For now, we'll just set a basic authenticated state
            // In a real app, you'd make an API call to get user details
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await apiService.login({ email, password });

            if (response.token) {
                apiService.setToken(response.token);

                // If the response includes user data, use it
                if (response.user) {
                    setUser(response.user);
                }
            }
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        apiService.removeToken();
        setUser(null);
    };

    const value: AuthContextType = {
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
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
