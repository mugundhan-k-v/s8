import React, { useMemo } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    Legend
} from 'recharts';
import { useData } from '../context/DataContext';

// Compute last 6 days labels
const getLast6Days = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const result = [];
    for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        result.push({ label: days[d.getDay()], dateStr: d.toISOString().split('T')[0] });
    }
    return result;
};

const Dashboard: React.FC = () => {
    const { students, teachers, attendance, marks, isSyncing, lastSyncTime } = useData();

    // --- Stat Cards ---
    const totalStudents = students.length;
    const totalTeachers = teachers.length;

    // Average attendance: mean of (present / total) across all records
    const avgAttendance = useMemo(() => {
        if (attendance.length === 0) return null;
        const sum = attendance.reduce((acc, rec) => {
            const total = rec.totalStudents || 1;
            const present = rec.presentStudentIds?.length ?? 0;
            return acc + (present / total) * 100;
        }, 0);
        return Math.round(sum / attendance.length);
    }, [attendance]);

    // Offline (unsynced) entries — students not yet synced
    const offlineEntries = useMemo(
        () => (students as any[]).filter(s => s.isSynced === false || s.isSynced === 0).length,
        [students]
    );

    // --- Attendance Chart Data (last 6 days) ---
    const last6Days = getLast6Days();
    const attendanceChartData = useMemo(() => {
        return last6Days.map(({ label, dateStr }) => {
            // Find attendance records for this date
            const recs = attendance.filter(r => r.date && r.date.startsWith(dateStr));
            if (recs.length === 0) return { name: label, attendance: 0 };
            const avg = recs.reduce((acc, r) => {
                const total = r.totalStudents || 1;
                const present = r.presentStudentIds?.length ?? 0;
                return acc + (present / total) * 100;
            }, 0) / recs.length;
            return { name: label, attendance: Math.round(avg) };
        });
    }, [attendance, last6Days]);

    // --- Performance Chart Data (last 6 days by marks) ---
    const performanceChartData = useMemo(() => {
        return last6Days.map(({ label, dateStr }) => {
            const dayMarks = marks.filter(m => (m as any).date && (m as any).date.startsWith(dateStr));
            if (dayMarks.length === 0) return { name: label, performance: 0 };
            const avg = dayMarks.reduce((acc, m) => acc + (m.marksObtained / (m.totalMarks || 1)) * 100, 0) / dayMarks.length;
            return { name: label, performance: Math.round(avg) };
        });
    }, [marks, last6Days]);

    // Merge both into one dataset for the charts
    const combinedChartData = useMemo(() =>
        last6Days.map(({ label }, i) => ({
            name: label,
            attendance: attendanceChartData[i]?.attendance ?? 0,
            performance: performanceChartData[i]?.performance ?? 0,
        })),
        [attendanceChartData, performanceChartData, last6Days]
    );

    const formatSyncTime = () => {
        if (!lastSyncTime) return 'Never';
        return lastSyncTime.toLocaleTimeString();
    };

    return (
        <div className="p-1 space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-800">Dashboard Overview</h2>
                <div className="text-sm text-slate-500">
                    {isSyncing ? 'Loading…' : `Last updated: ${formatSyncTime()}`}
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* Total Students */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-slate-500">Total Students</h3>
                            <p className="text-3xl font-bold text-slate-800 mt-2">
                                {isSyncing ? '…' : totalStudents.toLocaleString()}
                            </p>
                        </div>
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                        </div>
                    </div>
                    <span className="text-xs text-slate-400 font-medium mt-2 block">From local database</span>
                </div>

                {/* Avg Attendance */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-slate-500">Avg Attendance</h3>
                            <p className="text-3xl font-bold text-slate-800 mt-2">
                                {isSyncing ? '…' : avgAttendance !== null ? `${avgAttendance}%` : 'N/A'}
                            </p>
                        </div>
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /><path d="M9 16l2 2 4-4" /></svg>
                        </div>
                    </div>
                    <span className="text-xs text-emerald-600 font-medium mt-2 block">
                        {attendance.length > 0 ? `Based on ${attendance.length} records` : 'No records yet'}
                    </span>
                </div>

                {/* Teachers Active */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-slate-500">Teachers Active</h3>
                            <p className="text-3xl font-bold text-slate-800 mt-2">
                                {isSyncing ? '…' : totalTeachers}
                            </p>
                        </div>
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10v6" /><path d="M20 20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12Z" /><path d="M10 12h4" /><path d="M10 16h4" /></svg>
                        </div>
                    </div>
                    <span className="text-xs text-slate-400 font-medium mt-2 block">From local database</span>
                </div>

                {/* Offline Entries */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-slate-500">Offline Entries</h3>
                            <p className="text-3xl font-bold text-slate-800 mt-2">
                                {isSyncing ? '…' : offlineEntries}
                            </p>
                        </div>
                        <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 1l22 22" /><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" /><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" /><path d="M10.71 5.05A16 16 0 0 1 22.58 9" /><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><line x1="12" y1="20" x2="12.01" y2="20" /></svg>
                        </div>
                    </div>
                    <span className="text-xs text-amber-600 font-medium mt-2 block">
                        {offlineEntries > 0 ? 'Requires Sync' : 'All Synced'}
                    </span>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Attendance Trend */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-1">Weekly Attendance Trend</h3>
                    <p className="text-xs text-slate-400 mb-4">Last 6 days from attendance records</p>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={combinedChartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                                <Tooltip
                                    cursor={{ fill: '#f1f5f9' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(v: any) => `${v}%`}
                                />
                                <Bar dataKey="attendance" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} name="Attendance %" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Performance Overview */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-1">Student Performance Overview</h3>
                    <p className="text-xs text-slate-400 mb-4">Last 6 days from marks records</p>
                    <div className="h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={combinedChartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(v: any) => `${v}%`}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="performance" stroke="#10b981" strokeWidth={3} name="Performance %" dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Quick Summary Table */}
            {students.length > 0 && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Students</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    <th className="pb-3 text-slate-500 font-medium">Name</th>
                                    <th className="pb-3 text-slate-500 font-medium">Roll No</th>
                                    <th className="pb-3 text-slate-500 font-medium">Class</th>
                                    <th className="pb-3 text-slate-500 font-medium">Section</th>
                                    <th className="pb-3 text-slate-500 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.slice(0, 5).map(s => (
                                    <tr key={s._id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                        <td className="py-3 font-medium text-slate-800">{s.name}</td>
                                        <td className="py-3 text-slate-600">{s.rollNo}</td>
                                        <td className="py-3 text-slate-600">{s.class}</td>
                                        <td className="py-3 text-slate-600">{(s as any).section || '—'}</td>
                                        <td className="py-3">
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${(s as any).isSynced ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                                                {(s as any).isSynced ? 'Synced' : 'Offline'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
