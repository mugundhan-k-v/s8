import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { User, Database, Globe, Bell, Server } from 'lucide-react';

const SettingsPage: React.FC = () => {
    const { user, logout } = useAuth();
    const { pendingChanges, lastSyncTime } = useData();

    return (
        <div className="space-y-6 max-w-3xl">
            <h2 className="text-2xl font-bold text-slate-800">App Settings</h2>

            {/* Profile Section */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-slate-200 border-4 border-white shadow-sm overflow-hidden">
                        <img
                            src={`https://ui-avatars.com/api/?name=${user?.name}&background=0D8ABC&color=fff&size=128`}
                            alt="Profile"
                        />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">{user?.name}</h3>
                        <p className="text-slate-500">{user?.role} • ID: {user?.id.toUpperCase()}</p>
                    </div>
                </div>
                <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 text-right">
                    <button onClick={logout} className="text-red-600 font-medium text-sm hover:underline">
                        Sign Out
                    </button>
                </div>
            </div>

            {/* Sync & Storage */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 font-semibold text-slate-700 flex items-center gap-2">
                    <Database size={20} /> Storage & Sync
                </div>
                <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-medium text-slate-800">Local Data Storage</h4>
                            <p className="text-xs text-slate-500">Data stored locally on this device</p>
                        </div>
                        <span className="text-sm font-bold text-blue-600">~4.2 MB Used</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-medium text-slate-800">Pending Changes</h4>
                            <p className="text-xs text-slate-500">Records waiting to be synced to cloud</p>
                        </div>
                        <span className="text-sm font-bold text-amber-600">{pendingChanges} Records</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-medium text-slate-800">Last Successful Sync</h4>
                            <p className="text-xs text-slate-500">Cloud synchronization timestamp</p>
                        </div>
                        <span className="text-sm text-slate-600">{lastSyncTime ? lastSyncTime.toLocaleString() : 'Never'}</span>
                    </div>
                </div>
            </div>

            {/* Application Preferences */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 font-semibold text-slate-700 flex items-center gap-2">
                    <Server size={20} /> Preferences
                </div>
                <div className="divide-y divide-slate-100">
                    <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Globe size={18} className="text-slate-400" />
                            <span className="text-slate-700 text-sm">Offline Mode Only</span>
                        </div>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                            <input type="checkbox" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-slate-300" />
                            <label className="toggle-label block overflow-hidden h-6 rounded-full bg-slate-300 cursor-pointer"></label>
                        </div>
                    </div>
                    <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Bell size={18} className="text-slate-400" />
                            <span className="text-slate-700 text-sm">Notifications</span>
                        </div>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none">
                            {/* Mock Toggle */}
                            <span className="text-emerald-600 text-sm font-bold">Enabled</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
