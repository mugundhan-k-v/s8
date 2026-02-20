import React, { useState, useRef, useEffect } from 'react';
import { Bell, Wifi, WifiOff, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useNetwork } from '../../context/NetworkContext';
import { useData } from '../../context/DataContext';
import clsx from 'clsx';

interface Notification {
    id: string;
    type: 'success' | 'warning' | 'info' | 'error';
    title: string;
    body: string;
    time: Date;
    read: boolean;
}

const NotificationPanel: React.FC = () => {
    const { isOnline } = useNetwork();
    const { lastSyncTime, pendingChanges, students, attendance } = useData();
    const [open, setOpen] = useState(false);
    const [readIds, setReadIds] = useState<Set<string>>(new Set());
    const panelRef = useRef<HTMLDivElement>(null);

    // Build notifications dynamically from app state
    const notifications: Notification[] = [];

    if (!isOnline) {
        notifications.push({
            id: 'offline',
            type: 'error',
            title: 'Central Server Offline',
            body: 'Working in offline mode. Data is saved locally and will sync when connection is restored.',
            time: new Date(),
            read: false,
        });
    }

    if (pendingChanges > 0) {
        notifications.push({
            id: 'pending',
            type: 'warning',
            title: `${pendingChanges} Unsynced Changes`,
            body: 'You have offline entries that have not been synced to the central server yet.',
            time: new Date(),
            read: false,
        });
    }

    if (lastSyncTime && isOnline) {
        notifications.push({
            id: 'synced',
            type: 'success',
            title: 'Data Synced Successfully',
            body: `Last synced at ${lastSyncTime.toLocaleTimeString()}. All local data is up to date.`,
            time: lastSyncTime,
            read: false,
        });
    }

    if (students.length > 0) {
        notifications.push({
            id: 'students-loaded',
            type: 'info',
            title: `${students.length} Students Loaded`,
            body: `Student data is available from the local database.`,
            time: new Date(),
            read: false,
        });
    }

    if (attendance.length === 0) {
        notifications.push({
            id: 'no-attendance',
            type: 'warning',
            title: 'No Attendance Records',
            body: 'No attendance has been marked yet. Go to Attendance to start tracking.',
            time: new Date(),
            read: false,
        });
    }

    // Mark as read if in readIds
    const finalNotifications = notifications.map(n => ({ ...n, read: readIds.has(n.id) }));
    const unreadCount = finalNotifications.filter(n => !n.read).length;

    const markAllRead = () => setReadIds(new Set(finalNotifications.map(n => n.id)));
    const markRead = (id: string) => setReadIds(prev => new Set([...prev, id]));

    // Close on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const iconMap = {
        success: <CheckCircle size={16} className="text-emerald-500 shrink-0" />,
        warning: <AlertCircle size={16} className="text-amber-500 shrink-0" />,
        error: <WifiOff size={16} className="text-rose-500 shrink-0" />,
        info: <Info size={16} className="text-blue-500 shrink-0" />,
    };

    return (
        <div ref={panelRef} className="relative">
            {/* Bell Button */}
            <button
                onClick={() => setOpen(o => !o)}
                className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
                title="Notifications"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center border border-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Panel */}
            {open && (
                <div className="absolute right-0 top-12 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                        <div>
                            <h3 className="text-sm font-semibold text-slate-800">Notifications</h3>
                            {unreadCount > 0 && (
                                <p className="text-xs text-slate-400">{unreadCount} unread</p>
                            )}
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllRead}
                                className="text-xs text-blue-600 hover:underline font-medium"
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    {/* Notification List */}
                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                        {finalNotifications.length === 0 ? (
                            <div className="py-10 text-center text-sm text-slate-400">
                                <Bell size={28} className="mx-auto mb-2 opacity-30" />
                                No notifications
                            </div>
                        ) : (
                            finalNotifications.map(n => (
                                <div
                                    key={n.id}
                                    onClick={() => markRead(n.id)}
                                    className={clsx(
                                        "flex gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors",
                                        !n.read && "bg-blue-50/40"
                                    )}
                                >
                                    <div className="mt-0.5">{iconMap[n.type]}</div>
                                    <div className="flex-1 min-w-0">
                                        <p className={clsx("text-sm font-medium text-slate-800", !n.read && "font-semibold")}>
                                            {n.title}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{n.body}</p>
                                        <p className="text-[10px] text-slate-300 mt-1">
                                            {n.time.toLocaleTimeString()}
                                        </p>
                                    </div>
                                    {!n.read && (
                                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 shrink-0" />
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-4 py-2 border-t border-slate-100 bg-slate-50">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                            {isOnline
                                ? <><Wifi size={12} className="text-emerald-500" /> Connected to Central Server</>
                                : <><WifiOff size={12} className="text-rose-500" /> Central Server Offline — Local Mode</>
                            }
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationPanel;
