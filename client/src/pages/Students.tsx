import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Search, Plus, Filter } from 'lucide-react';

const StudentsPage: React.FC = () => {
    const { students, teachers, addStudent } = useData();
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Default new student state with teacher's class if applicable
    const [newStudent, setNewStudent] = useState({
        name: '',
        class: user?.role === 'TEACHER' && user.assignedClass ? user.assignedClass : '',
        rollNo: '',
        guardianName: '',
        assignedTeacherId: user?.role === 'TEACHER' ? user.id : ''
    });

    const filteredStudents = students.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.rollNo.includes(searchTerm);

        // If teacher, only show their class
        if (user?.role === 'TEACHER' && user.assignedClass) {
            return matchesSearch && student.class === user.assignedClass;
        }

        return matchesSearch;
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newStudent.name || !newStudent.class) return;

        await addStudent(newStudent);
        setIsModalOpen(false);
        setNewStudent({
            name: '',
            class: user?.role === 'TEACHER' && user.assignedClass ? user.assignedClass : '',
            rollNo: '',
            guardianName: '',
            assignedTeacherId: user?.role === 'TEACHER' ? user.id : ''
        });
    };

    return (
        <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-slate-800">Student Directory</h2>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search students..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
                        <Filter size={18} />
                        Filter
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        <Plus size={18} />
                        Add Student
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Class</th>
                                <th className="px-6 py-4">Roll No</th>
                                <th className="px-6 py-4">Guardian</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredStudents.length > 0 ? (
                                filteredStudents.map((student) => (
                                    <tr key={student._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-800">{student.name}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-slate-100 rounded text-xs font-semibold text-slate-600">
                                                {student.class}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-slate-500">{student.rollNo}</td>
                                        <td className="px-6 py-4">{student.guardianName}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-blue-600 hover:text-blue-800 font-medium text-xs px-3 py-1 bg-blue-50 rounded-md">
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                                        No students found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                    <span>{filteredStudents.length} records found</span>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 bg-white border border-slate-200 rounded disabled:opacity-50" disabled>Previous</button>
                        <button className="px-3 py-1 bg-white border border-slate-200 rounded disabled:opacity-50" disabled>Next</button>
                    </div>
                </div>
            </div>

            {/* Add Student Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-lg text-slate-800">Add New Student</h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Student Name</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    value={newStudent.name}
                                    onChange={e => setNewStudent({ ...newStudent, name: e.target.value })}
                                    placeholder="e.g. Rahul Verma"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Class</label>
                                    <input
                                        required
                                        type="text"
                                        className={`w-full px-3 py-2 border rounded-lg ${user?.role === 'TEACHER' ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'border-slate-300 focus:ring-2 focus:ring-blue-500'}`}
                                        value={newStudent.class}
                                        onChange={e => setNewStudent({ ...newStudent, class: e.target.value })}
                                        readOnly={user?.role === 'TEACHER'}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Roll No</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        value={newStudent.rollNo}
                                        onChange={e => setNewStudent({ ...newStudent, rollNo: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Guardian Name</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    value={newStudent.guardianName}
                                    onChange={e => setNewStudent({ ...newStudent, guardianName: e.target.value })}
                                />
                            </div>

                            {/* Assign Teacher Dropdown (Only for Admins/School Operators) */}
                            {user?.role !== 'TEACHER' && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Assign Class Teacher</label>
                                    <select
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        // @ts-ignore
                                        value={newStudent.assignedTeacherId || ''}
                                        // @ts-ignore
                                        onChange={e => setNewStudent({ ...newStudent, assignedTeacherId: e.target.value })}
                                    >
                                        <option value="">Select a teacher...</option>
                                        {teachers.map(t => (
                                            <option key={t.id} value={t.id}>{t.name} ({t.subject})</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm"
                                >
                                    Save Student
                                </button>
                            </div>
                        </form>
                    </div>
                </div >
            )}
        </div >
    );
};

export default StudentsPage;
