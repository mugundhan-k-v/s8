import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
    const { login, isLoading } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = React.useState('pradhan@school.com');
    const [password, setPassword] = React.useState('password123');
    const [error, setError] = React.useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[500px]">
                {/* Left Side - Branding */}
                <div className="md:w-1/2 bg-blue-600 p-8 md:p-12 flex flex-col justify-between text-white relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        {/* Abstract Pattern */}
                        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white blur-3xl"></div>
                        <div className="absolute bottom-0 right-0 w-60 h-60 rounded-full bg-purple-500 blur-3xl"></div>
                    </div>

                    <div className="relative z-10">
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">Sikkim School<br />Analytics Platform</h1>
                        <p className="text-blue-100 text-lg opacity-90">
                            Offline-first data management and monitoring system for schools across the state.
                        </p>
                    </div>

                    <div className="relative z-10 text-sm text-blue-200">
                        © 2024 Education Dept. Sikkim
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-800">Welcome Back</h2>
                        <p className="text-slate-500">Sign in to your account</p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-slate-500">
                        <p>Demo Credentials:</p>
                        <p>teacher: pradhan@school.com / password123</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
