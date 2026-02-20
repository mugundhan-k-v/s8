
import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'SCHOOL' | 'BLOCK' | 'DISTRICT' | 'STATE_ADMIN' | 'TEACHER';

interface User {
    id: string;
    name: string;
    role: UserRole;
    schoolId?: string; // For SCHOOL role
    assignedClass?: string; // For TEACHER role
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('sikkim_app_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error('Failed to parse stored user', e);
                localStorage.removeItem('sikkim_app_user');
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (role: UserRole) => {
        // Implementation moved to Login component or needs refactoring
        // For now, let's keep it generic but it should really be accepting credentials
        // We will overload this or change the signature in the Step below
    };

    // Changing signature to accept email and password
    const loginUser = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            // Use the API utility which points to the correct backend (local or central)
            const response = await fetch('http://localhost:5001/api/auth/login', { // Pointing to local server
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.msg || 'Login failed');
            }

            setUser(data.user);
            localStorage.setItem('sikkim_app_user', JSON.stringify(data.user));
            // Store token if needed: localStorage.setItem('token', data.token);
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('sikkim_app_user');
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login: loginUser as any, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
