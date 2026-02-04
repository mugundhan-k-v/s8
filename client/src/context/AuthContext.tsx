import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    User as FirebaseUser,
    createUserWithEmailAndPassword
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';

export type UserRole = 'SCHOOL' | 'BLOCK' | 'DISTRICT' | 'STATE_ADMIN' | 'TEACHER';

interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    schoolId?: string; // For SCHOOL role
    assignedClass?: string; // For TEACHER role
    photoURL?: string;
}

interface AuthContextType {
    user: User | null;
    firebaseUser: FirebaseUser | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    signup: (email: string, password: string, name: string) => Promise<void>;
    logout: () => Promise<void>;
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
    const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Listen to Firebase auth state changes
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                setFirebaseUser(firebaseUser);

                // Try to get user data from localStorage first
                const storedUser = localStorage.getItem('sikkim_app_user');
                if (storedUser) {
                    try {
                        setUser(JSON.parse(storedUser));
                    } catch (e) {
                        console.error('Failed to parse stored user', e);
                        localStorage.removeItem('sikkim_app_user');
                    }
                } else {
                    // Create a basic user object from Firebase user
                    const appUser: User = {
                        id: firebaseUser.uid,
                        name: firebaseUser.displayName || 'User',
                        email: firebaseUser.email || '',
                        role: 'TEACHER', // Default role, can be updated
                        photoURL: firebaseUser.photoURL || undefined
                    };
                    setUser(appUser);
                    localStorage.setItem('sikkim_app_user', JSON.stringify(appUser));
                }
            } else {
                setFirebaseUser(null);
                setUser(null);
                localStorage.removeItem('sikkim_app_user');
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Email/Password Login
    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            // Create app user object
            const appUser: User = {
                id: firebaseUser.uid,
                name: firebaseUser.displayName || email.split('@')[0],
                email: firebaseUser.email || email,
                role: 'TEACHER', // Default role
                photoURL: firebaseUser.photoURL || undefined
            };

            setUser(appUser);
            localStorage.setItem('sikkim_app_user', JSON.stringify(appUser));
        } catch (error: any) {
            console.error('Login error:', error);
            throw new Error(error.message || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    // Google Sign-In
    const loginWithGoogle = async () => {
        setIsLoading(true);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const firebaseUser = result.user;

            // Create app user object
            const appUser: User = {
                id: firebaseUser.uid,
                name: firebaseUser.displayName || 'User',
                email: firebaseUser.email || '',
                role: 'TEACHER', // Default role
                photoURL: firebaseUser.photoURL || undefined
            };

            setUser(appUser);
            localStorage.setItem('sikkim_app_user', JSON.stringify(appUser));
        } catch (error: any) {
            console.error('Google sign-in error:', error);
            throw new Error(error.message || 'Google sign-in failed');
        } finally {
            setIsLoading(false);
        }
    };

    // Email/Password Signup
    const signup = async (email: string, password: string, name: string) => {
        setIsLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            // Create app user object
            const appUser: User = {
                id: firebaseUser.uid,
                name: name,
                email: firebaseUser.email || email,
                role: 'TEACHER', // Default role
            };

            setUser(appUser);
            localStorage.setItem('sikkim_app_user', JSON.stringify(appUser));
        } catch (error: any) {
            console.error('Signup error:', error);
            throw new Error(error.message || 'Signup failed');
        } finally {
            setIsLoading(false);
        }
    };

    // Logout
    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            setFirebaseUser(null);
            localStorage.removeItem('sikkim_app_user');
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            firebaseUser,
            isAuthenticated: !!user,
            login,
            loginWithGoogle,
            signup,
            logout,
            isLoading
        }}>
            {children}
        </AuthContext.Provider>
    );
};
