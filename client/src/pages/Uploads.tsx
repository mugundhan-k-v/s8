import React from 'react';
import { useData } from '../context/DataContext';
import { UploadCloud, FileText, CheckCircle, Clock } from 'lucide-react';

const UploadsPage: React.FC = () => {
    const { uploads, addUpload } = useData();

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Simulate upload process
            addUpload({
                fileName: file.name,
                size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
                type: file.type,
                date: new Date().toISOString().split('T')[0],
                status: 'Queued' // Default to queued for offline simulation
            });
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-800">Document Uploads</h2>

            {/* Drag Drop Area */}
            <div className="bg-white border-2 border-dashed border-slate-300 rounded-xl p-12 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors relative cursor-pointer">
                <input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    onChange={handleFileUpload}
                />
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                    <UploadCloud size={32} />
                </div>
                <h3 className="text-lg font-semibold text-slate-800">Click to upload or drag and drop</h3>
                <p className="text-slate-500 mt-2 max-w-sm">
                    Upload monthly reports, attendance sheets, or exam results (PDF, Excel, CSV)
                </p>
                <p className="text-xs text-slate-400 mt-4">Max file size: 10MB</p>
            </div>

            {/* History List */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 font-semibold text-slate-700">
                    Upload History
                </div>
                <div className="divide-y divide-slate-100">
                    {uploads.map((upload) => (
                        <div key={upload.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-slate-100 rounded text-slate-500">
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <h4 className="font-medium text-slate-800">{upload.fileName}</h4>
                                    <p className="text-xs text-slate-500">{upload.size} • {upload.date}</p>
                                </div>
                            </div>
                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${upload.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                                    upload.status === 'Queued' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                                }`}>
                                {upload.status === 'Completed' ? <CheckCircle size={14} /> : <Clock size={14} />}
                                {upload.status}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UploadsPage;
