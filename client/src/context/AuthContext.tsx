
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
    login: (role: UserRole) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};

// Mock Users
const MOCK_USERS: Record<UserRole, User> = {
    SCHOOL: { id: 's1', name: 'Govt School Sikkim', role: 'SCHOOL', schoolId: 'SKM-001' },
    BLOCK: { id: 'b1', name: 'Gangtok Block Officer', role: 'BLOCK' },
    DISTRICT: { id: 'd1', name: 'East District Officer', role: 'DISTRICT' },
    STATE_ADMIN: { id: 'a1', name: 'State Admin', role: 'STATE_ADMIN' },
    TEACHER: { id: 't1', name: 'Mr. Pradhan', role: 'TEACHER', schoolId: 'SKM-001', assignedClass: '10-A' },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check local storage for persisted session (Mocking "Remember Me" / Offline Auth)
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
        setIsLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));

        const mockUser = MOCK_USERS[role];
        setUser(mockUser);
        localStorage.setItem('sikkim_app_user', JSON.stringify(mockUser));
        setIsLoading(false);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('sikkim_app_user');
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
