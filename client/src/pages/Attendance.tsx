import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Calendar as CalendarIcon, Save, Users, CheckCircle } from 'lucide-react';

const AttendancePage: React.FC = () => {
    const { students, markAttendance } = useData();
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    // Initialize all as present by default
    const [presentIds, setPresentIds] = useState<Set<string>>(new Set(students.map(s => s._id)));
    const [isSaved, setIsSaved] = useState(false);

    const toggleAttendance = (id: string) => {
        const newSet = new Set(presentIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setPresentIds(newSet);
        setIsSaved(false);
    };

    const handleSave = async () => {
        // Assuming we need to pass schoolId and class, hardcoding for now or need to fetch from students/context
        const schoolId = students.length > 0 ? students[0].schoolId : null; // Fallback

        await markAttendance({
            date: selectedDate,
            presentStudentIds: Array.from(presentIds),
            totalStudents: students.length,
            schoolId: schoolId?._id || schoolId || "000000000000000000000000", // Fallback dummy ID if logic fails
            class: "10-A", // Hardcoded as per UI
            section: "A"
        });
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Daily Attendance</h2>
                    <p className="text-slate-500 text-sm">Mark attendance for {new Date(selectedDate).toDateString()}</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-2 rounded-lg text-sm text-slate-600">
                        <CalendarIcon size={16} />
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={e => setSelectedDate(e.target.value)}
                            className="outline-none bg-transparent"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div className="flex items-center gap-2 text-slate-700 font-semibold">
                        <Users size={20} />
                        <span>Class 10-A Students</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-sm">
                            <span className="font-bold text-emerald-600">{presentIds.size}</span> Possible
                            <span className="mx-2 text-slate-300">|</span>
                            <span className="font-bold text-rose-600">{students.length - presentIds.size}</span> Absent
                        </div>
                        <button
                            onClick={handleSave}
                            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-white font-medium transition-all ${isSaved ? 'bg-emerald-500' : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                        >
                            {isSaved ? <CheckCircle size={18} /> : <Save size={18} />}
                            {isSaved ? 'Saved Locally' : 'Save Attendance'}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 divide-y divide-slate-100 md:divide-y-0 md:gap-4 p-6">
                    {students.map((student) => {
                        const isPresent = presentIds.has(student._id);
                        return (
                            <div
                                key={student._id}
                                onClick={() => toggleAttendance(student._id)}
                                className={`
                                    cursor-pointer p-4 rounded-lg border  transition-all flex items-center justify-between
                                    ${isPresent
                                        ? 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
                                        : 'bg-rose-50 border-rose-200 hover:bg-rose-100'
                                    }
                                `}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs
                                         ${isPresent ? 'bg-emerald-200 text-emerald-800' : 'bg-rose-200 text-rose-800'}
                                    `}>
                                        {student.rollNo}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-800 text-sm">{student.name}</h4>
                                        <span className="text-xs text-slate-500">Roll: {student.rollNo}</span>
                                    </div>
                                </div>
                                <div className={`px-2 py-1 rounded text-xs font-bold uppercase
                                    ${isPresent ? 'text-emerald-700' : 'text-rose-700'}
                                `}>
                                    {isPresent ? 'P' : 'A'}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default AttendancePage;
