
import React from 'react';
import { useAuth, UserRole } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Building2, School, GraduationCap, ShieldCheck, User } from 'lucide-react';

const LoginPage: React.FC = () => {
    const { login, isLoading } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (role: UserRole) => {
        await login(role);
        navigate('/');
    };

    const roles = [
        { id: 'SCHOOL', label: 'School Operator', icon: School, desc: 'Manage your school data', color: 'bg-blue-500' },
        { id: 'TEACHER', label: 'Class Teacher', icon: User, desc: 'Manage your class students', color: 'bg-teal-500' },
        { id: 'BLOCK', label: 'Block Level Officer', icon: Building2, desc: 'Monitor block schools', color: 'bg-emerald-500' },
        { id: 'DISTRICT', label: 'District Officer', icon: GraduationCap, desc: 'District-wide analytics', color: 'bg-indigo-500' },
        { id: 'STATE_ADMIN', label: 'State Admin', icon: ShieldCheck, desc: 'Full system control', color: 'bg-slate-700' },
    ];

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

                {/* Right Side - Login Options */}
                <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-800">Welcome Back</h2>
                        <p className="text-slate-500">Select your role to continue</p>
                    </div>

                    <div className="space-y-3">
                        {roles.map((role) => (
                            <button
                                key={role.id}
                                onClick={() => handleLogin(role.id as UserRole)}
                                disabled={isLoading}
                                className="w-full flex items-center p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all group text-left"
                            >
                                <div className={`w-10 h-10 rounded-lg ${role.color} text-white flex items-center justify-center mr-4 shadow-sm group-hover:scale-110 transition-transform`}>
                                    <role.icon size={20} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-800">{role.label}</h3>
                                    <p className="text-xs text-slate-500">{role.desc}</p>
                                </div>
                            </button>
                        ))}
                    </div>

                    {isLoading && (
                        <div className="mt-4 text-center text-sm text-blue-600 animate-pulse">
                            Authenticating...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
