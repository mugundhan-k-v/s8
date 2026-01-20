import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    GraduationCap,
    CalendarCheck,
    UploadCloud,
    Settings,
    LogOut,
    BookOpen
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';

const Sidebar: React.FC = () => {
    const { logout, user } = useAuth();

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: Users, label: 'Students', path: '/students' },
        ...(user?.role !== 'TEACHER' ? [{ icon: BookOpen, label: 'Teachers', path: '/teachers' }] : []),
        { icon: CalendarCheck, label: 'Attendance', path: '/attendance' },
        { icon: GraduationCap, label: 'Marks & Records', path: '/marks' },
        { icon: UploadCloud, label: 'Uploads', path: '/uploads' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    return (
        <aside className="w-64 bg-slate-900 text-white flex flex-col transition-all duration-300">
            <div className="p-6 border-b border-slate-700 flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-blue-500 flex items-center justify-center font-bold">
                    S
                </div>
                <div>
                    <h2 className="text-lg font-bold tracking-wide">Sikkim Edu</h2>
                    <p className="text-xs text-slate-400 capitalize">{user?.role?.toLowerCase() || 'Guest'}</p>
                </div>
            </div>

            <nav className="flex-1 py-6 space-y-1 px-3">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => clsx(
                            "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium",
                            isActive
                                ? "bg-blue-600 text-white shadow-md"
                                : "text-slate-300 hover:bg-slate-800 hover:text-white"
                        )}
                    >
                        <item.icon size={20} />
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-700">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 w-full text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors text-sm font-medium"
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
