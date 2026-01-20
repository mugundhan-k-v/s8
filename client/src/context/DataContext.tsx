import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNetwork } from './NetworkContext';

// Types
export interface Student {
    id: string;
    name: string;
    class: string;
    rollNo: string;
    guardianName: string;
    assignedTeacherId?: string; // Link to a Teacher
}

export interface Teacher {
    id: string;
    name: string;
    subject: string;
    status: 'Present' | 'Absent' | 'Leave';
    phone: string;
}

export interface MarkRecord {
    id: string;
    studentId: string;
    studentName: string;
    examType: 'Mid-Term' | 'Final' | 'Unit Test';
    subject: string;
    marksObtained: number;
    totalMarks: number;
}

export interface UploadRecord {
    id: string;
    fileName: string;
    date: string;
    size: string;
    status: 'Completed' | 'Queued' | 'Failed';
    type: string;
}

export interface AttendanceRecord {
    id: string;
    date: string; // ISO Date string YYYY-MM-DD
    presentStudentIds: string[];
    totalStudents: number;
}

interface DataContextType {
    students: Student[];
    teachers: Teacher[];
    attendance: AttendanceRecord[];
    marks: MarkRecord[];
    uploads: UploadRecord[];
    addStudent: (student: Omit<Student, 'id'>) => Promise<void>;
    markAttendance: (date: string, presentIds: string[], total: number) => Promise<void>;
    addTeacher: (teacher: Omit<Teacher, 'id'>) => Promise<void>;
    addMark: (mark: Omit<MarkRecord, 'id'>) => Promise<void>;
    addUpload: (upload: Omit<UploadRecord, 'id'>) => Promise<void>;
    syncData: () => Promise<void>;
    lastSyncTime: Date | null;
    isSyncing: boolean;
    pendingChanges: number;
}

const DataContext = createContext<DataContextType | null>(null);

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) throw new Error('useData must be used within a DataProvider');
    return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isOnline } = useNetwork();

    const [students, setStudents] = useState<Student[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
    const [marks, setMarks] = useState<MarkRecord[]>([]);
    const [uploads, setUploads] = useState<UploadRecord[]>([]);

    const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
    const [isSyncing, setIsSyncing] = useState(false);
    const [pendingChanges, setPendingChanges] = useState(0);

    // Load initial data from LocalStorage
    useEffect(() => {
        const loadData = () => {
            const storedStudents = localStorage.getItem('sikkim_students');
            if (storedStudents) setStudents(JSON.parse(storedStudents));
            else {
                // Dummy Initial Data Students
                const dummy: Student[] = [
                    { id: '1', name: 'Rohan Sharma', class: '10-A', rollNo: '01', guardianName: 'Suresh Sharma' },
                    { id: '2', name: 'Aditi Rao', class: '10-A', rollNo: '02', guardianName: 'Rajesh Rao' },
                    { id: '3', name: 'Pemba Sherpa', class: '10-A', rollNo: '03', guardianName: 'Dorjee Sherpa' }
                ];
                setStudents(dummy);
                localStorage.setItem('sikkim_students', JSON.stringify(dummy));
            }

            // Teachers
            const storedTeachers = localStorage.getItem('sikkim_teachers');
            if (storedTeachers) setTeachers(JSON.parse(storedTeachers));
            else {
                const dummyTeachers: Teacher[] = [
                    { id: 't1', name: 'Mr. Pradhan', subject: 'Mathematics', status: 'Present', phone: '9800000001' },
                    { id: 't2', name: 'Ms. Rai', subject: 'Science', status: 'Present', phone: '9800000002' },
                    { id: 't3', name: 'Mr. Bhutia', subject: 'English', status: 'Leave', phone: '9800000003' },
                ];
                setTeachers(dummyTeachers);
                localStorage.setItem('sikkim_teachers', JSON.stringify(dummyTeachers));
            }

            // Marks
            const storedMarks = localStorage.getItem('sikkim_marks');
            if (storedMarks) setMarks(JSON.parse(storedMarks));

            // Uploads
            const storedUploads = localStorage.getItem('sikkim_uploads');
            if (storedUploads) setUploads(JSON.parse(storedUploads));
            else {
                const dummyUploads: UploadRecord[] = [
                    { id: 'u1', fileName: 'Monthly_Report_Nov.pdf', date: '2024-11-30', size: '2.4 MB', status: 'Completed', type: 'application/pdf' }
                ];
                setUploads(dummyUploads);
                localStorage.setItem('sikkim_uploads', JSON.stringify(dummyUploads));
            }

            const storedAttendance = localStorage.getItem('sikkim_attendance');
            if (storedAttendance) setAttendance(JSON.parse(storedAttendance));

            const storedSync = localStorage.getItem('sikkim_last_sync');
            if (storedSync) setLastSyncTime(new Date(storedSync));
        };
        loadData();
    }, []);

    const addStudent = async (studentData: Omit<Student, 'id'>) => {
        const newStudent: Student = { ...studentData, id: crypto.randomUUID() };
        const updatedStudents = [...students, newStudent];
        setStudents(updatedStudents);
        localStorage.setItem('sikkim_students', JSON.stringify(updatedStudents));
        setPendingChanges(prev => prev + 1);
    };

    const addTeacher = async (teacherData: Omit<Teacher, 'id'>) => {
        const newTeacher: Teacher = { ...teacherData, id: crypto.randomUUID() };
        const updated = [...teachers, newTeacher];
        setTeachers(updated);
        localStorage.setItem('sikkim_teachers', JSON.stringify(updated));
        setPendingChanges(prev => prev + 1);
    };

    const addMark = async (markData: Omit<MarkRecord, 'id'>) => {
        const newMark: MarkRecord = { ...markData, id: crypto.randomUUID() };
        const updated = [...marks, newMark];
        setMarks(updated);
        localStorage.setItem('sikkim_marks', JSON.stringify(updated));
        setPendingChanges(prev => prev + 1);
    };

    const addUpload = async (uploadData: Omit<UploadRecord, 'id'>) => {
        const newUpload: UploadRecord = { ...uploadData, id: crypto.randomUUID() };
        const updated = [newUpload, ...uploads];
        setUploads(updated);
        localStorage.setItem('sikkim_uploads', JSON.stringify(updated));
        setPendingChanges(prev => prev + 1);
    };

    const markAttendance = async (date: string, presentIds: string[], total: number) => {
        const record: AttendanceRecord = { id: crypto.randomUUID(), date, presentStudentIds: presentIds, totalStudents: total };
        // Filter out existing for same date to overwrite
        const filtered = attendance.filter(a => a.date !== date);
        const updated = [...filtered, record];
        setAttendance(updated);
        localStorage.setItem('sikkim_attendance', JSON.stringify(updated));
        setPendingChanges(prev => prev + 1);
    };

    const syncData = async () => {
        if (!isOnline) {
            alert("Cannot sync: Offline");
            return;
        }
        setIsSyncing(true);
        // Simulate API Sync
        await new Promise(resolve => setTimeout(resolve, 2000));

        setLastSyncTime(new Date());
        localStorage.setItem('sikkim_last_sync', new Date().toISOString());
        setPendingChanges(0);
        setIsSyncing(false);
    };

    return (
        <DataContext.Provider value={{
            students,
            teachers,
            marks,
            uploads,
            attendance,

            addStudent,
            addTeacher,
            addMark,
            addUpload,
            markAttendance,

            syncData,
            lastSyncTime,
            isSyncing,
            pendingChanges
        }}>
            {children}
        </DataContext.Provider>
    );
};
