import React from 'react';
import { useNetwork } from '../../context/NetworkContext';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import clsx from 'clsx';
import NotificationPanel from './NotificationPanel';

const Header: React.FC = () => {
    const { isOnline } = useNetwork();
    const { syncData, isSyncing, lastSyncTime, pendingChanges } = useData();
    const { user } = useAuth();

    return (
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-10">

            {/* Left: Breadcrumb / Title (Placeholder) */}
            <div>
                <h1 className="text-xl font-semibold text-slate-800">
                    Welcome back, {user?.name.split(' ')[0]}
                </h1>
            </div>

            {/* Right: Actions & Status */}
            <div className="flex items-center gap-4">

                {/* Sync Status Button */}
                <button
                    onClick={syncData}
                    disabled={!isOnline || isSyncing}
                    className={clsx(
                        "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                        isSyncing
                            ? "bg-blue-50 text-blue-600 border-blue-200"
                            : !isOnline
                                ? "bg-rose-50 text-rose-600 border-rose-200 cursor-not-allowed"
                                : pendingChanges > 0
                                    ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                                    : "bg-slate-50 text-slate-500 border-slate-200"
                    )}
                    title={
                        !isOnline
                            ? "Central server is offline — data saved locally"
                            : lastSyncTime
                                ? `Last synced: ${lastSyncTime.toLocaleTimeString()}`
                                : "Not synced yet"
                    }
                >
                    <RefreshCw size={14} className={clsx({ "animate-spin": isSyncing })} />
                    {isSyncing
                        ? 'Syncing...'
                        : !isOnline
                            ? 'Unsynced'
                            : pendingChanges > 0
                                ? `${pendingChanges} Pending`
                                : 'Synced'}
                </button>

                {/* Network Status Indicator */}
                <div className={clsx(
                    "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border",
                    isOnline
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-rose-50 text-rose-700 border-rose-200"
                )}>
                    {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
                    {isOnline ? 'Online' : 'Offline'}
                </div>

                {/* Notifications */}
                <NotificationPanel />

                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
                    <img
                        src={`https://ui-avatars.com/api/?name=${user?.name}&background=0D8ABC&color=fff`}
                        alt="Profile"
                    />
                </div>

            </div>
        </header>
    );
};

export default Header;
