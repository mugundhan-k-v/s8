import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Search, Plus, Phone, BookOpen, Briefcase } from 'lucide-react';

const TeachersPage: React.FC = () => {
    const { teachers, addTeacher } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTeacher, setNewTeacher] = useState({ name: '', subject: '', phone: '', status: 'Present' });

    const filteredTeachers = teachers.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.subject ?? '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // @ts-ignore
        await addTeacher(newTeacher);
        setIsModalOpen(false);
        setNewTeacher({ name: '', subject: '', phone: '', status: 'Present' });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-slate-800">Teacher Management</h2>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search teachers..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
                        />
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        <Plus size={18} />
                        Add Teacher
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTeachers.map((teacher) => (
                    <div key={teacher._id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-4">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg">
                                    {teacher.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">{teacher.name}</h3>
                                    <span className="text-xs text-slate-500 flex items-center gap-1">
                                        <BookOpen size={12} /> {teacher.subject}
                                    </span>
                                </div>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${teacher.status === 'Present' ? 'bg-emerald-100 text-emerald-700' :
                                teacher.status === 'Absent' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                                }`}>
                                {teacher.status}
                            </span>
                        </div>

                        <div className="border-t border-slate-100 pt-4 flex flex-col gap-2 text-sm text-slate-600">
                            <div className="flex items-center gap-3">
                                <Phone size={16} className="text-slate-400" />
                                {teacher.phone}
                            </div>
                            <div className="flex items-center gap-3">
                                <Briefcase size={16} className="text-slate-400" />
                                Full Time
                            </div>
                        </div>

                        <button className="mt-auto w-full py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium">
                            View Profile
                        </button>
                    </div>
                ))}
            </div>

            {/* Add Teacher Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-lg text-slate-800">Add New Teacher</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">&times;</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                                <input required type="text" className="w-full px-3 py-2 border rounded-lg" value={newTeacher.name} onChange={e => setNewTeacher({ ...newTeacher, name: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                                <input required type="text" className="w-full px-3 py-2 border rounded-lg" value={newTeacher.subject} onChange={e => setNewTeacher({ ...newTeacher, subject: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                                <input required type="text" className="w-full px-3 py-2 border rounded-lg" value={newTeacher.phone} onChange={e => setNewTeacher({ ...newTeacher, phone: e.target.value })} />
                            </div>
                            <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Teacher</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeachersPage;
