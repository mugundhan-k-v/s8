import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { FileBarChart, Plus, Download } from 'lucide-react';

const MarksPage: React.FC = () => {
    const { marks, students, addMark } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Default form state
    const [newMark, setNewMark] = useState({
        studentId: '',
        examType: 'Mid-Term',
        subject: 'Maths',
        marksObtained: 0,
        totalMarks: 100
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const student = students.find(s => s.id === newMark.studentId);
        if (!student) return;

        // @ts-ignore
        await addMark({
            ...newMark,
            studentName: student.name
        });
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-slate-800">Academic Records</h2>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
                        <Download size={18} />
                        Export Report
                    </button>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        <Plus size={18} />
                        Enter Marks
                    </button>
                </div>
            </div>

            {/* Marks Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4">Student</th>
                            <th className="px-6 py-4">Exam Type</th>
                            <th className="px-6 py-4">Subject</th>
                            <th className="px-6 py-4">Score</th>
                            <th className="px-6 py-4">Percentage</th>
                            <th className="px-6 py-4">Grade</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {marks.length > 0 ? marks.map((mark) => {
                            const percent = (mark.marksObtained / mark.totalMarks) * 100;
                            let grade = 'F';
                            if (percent >= 90) grade = 'A+';
                            else if (percent >= 80) grade = 'A';
                            else if (percent >= 70) grade = 'B';
                            else if (percent >= 60) grade = 'C';
                            else if (percent >= 40) grade = 'D';

                            return (
                                <tr key={mark.id} className="hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-slate-800">{mark.studentName}</td>
                                    <td className="px-6 py-4">{mark.examType}</td>
                                    <td className="px-6 py-4">{mark.subject}</td>
                                    <td className="px-6 py-4 font-mono">{mark.marksObtained} / {mark.totalMarks}</td>
                                    <td className="px-6 py-4 font-mono">{percent.toFixed(1)}%</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${grade.startsWith('A') ? 'bg-emerald-100 text-emerald-700' :
                                                grade === 'F' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                            }`}>
                                            {grade}
                                        </span>
                                    </td>
                                </tr>
                            );
                        }) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                                    No marks recorded yet. Click "Enter Marks" to begin.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-lg text-slate-800">Enter Marks</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">&times;</button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Student</label>
                                <select
                                    className="w-full px-3 py-2 border rounded-lg"
                                    required
                                    value={newMark.studentId}
                                    onChange={e => setNewMark({ ...newMark, studentId: e.target.value })}
                                >
                                    <option value="">Select Student...</option>
                                    {students.map(s => (
                                        <option key={s.id} value={s.id}>{s.name} (Roll: {s.rollNo})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Exam Type</label>
                                    <select
                                        className="w-full px-3 py-2 border rounded-lg"
                                        value={newMark.examType}
                                        onChange={e => setNewMark({ ...newMark, examType: e.target.value })}
                                    >
                                        <option>Mid-Term</option>
                                        <option>Final</option>
                                        <option>Unit Test</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                                    <select
                                        className="w-full px-3 py-2 border rounded-lg"
                                        value={newMark.subject}
                                        onChange={e => setNewMark({ ...newMark, subject: e.target.value })}
                                    >
                                        <option>Maths</option>
                                        <option>Science</option>
                                        <option>English</option>
                                        <option>Social Studies</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Marks Obtained</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full px-3 py-2 border rounded-lg"
                                        value={newMark.marksObtained}
                                        onChange={e => setNewMark({ ...newMark, marksObtained: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Total Marks</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full px-3 py-2 border rounded-lg"
                                        value={newMark.totalMarks}
                                        onChange={e => setNewMark({ ...newMark, totalMarks: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Record</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MarksPage;
