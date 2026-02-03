import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNetwork } from './NetworkContext';
import api from '../utils/api';

// Types
export interface Student {
    _id: string; // MongoDB uses _id
    name: string;
    class: string;
    rollNo: string;
    guardianName: string;
    assignedTeacherId?: any; // Populated object or string
    schoolId?: any;
}

export interface Teacher {
    _id: string;
    name: string;
    email: string; // Changed from subject/phone for now based on User model
    role: string;
}

export interface MarkRecord {
    _id: string;
    studentId: any;
    examType: string;
    subject: string;
    marksObtained: number;
    totalMarks: number;
}

export interface UploadRecord {
    _id: string;
    fileName: string;
    createdAt: string; // Date string
    fileSizeBytes: number;
    uploadStatus: string;
    fileType: string;
}

export interface AttendanceRecord {
    _id: string;
    date: string;
    presentStudentIds: string[];
    totalStudents: number;
}

interface DataContextType {
    students: Student[];
    teachers: Teacher[];
    attendance: AttendanceRecord[];
    marks: MarkRecord[];
    uploads: UploadRecord[];
    addStudent: (student: any) => Promise<void>;
    markAttendance: (data: any) => Promise<void>;
    addTeacher: (teacher: any) => Promise<void>;
    addMark: (mark: any) => Promise<void>;
    addUpload: (formData: FormData) => Promise<void>;
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

    const fetchData = async () => {
        if (!isOnline) {
            // Fallback to localstorage or offline behavior?
            // For now just return if offline as we rely on backend for "connection" verification
            return;
        }
        setIsSyncing(true);
        try {
            const [studentsRes, usersRes, marksRes, attendanceRes, uploadsRes] = await Promise.all([
                api.get('/students'),
                api.get('/users'), // Need to filter for teachers
                api.get('/marks'),
                api.get('/attendance'),
                api.get('/upload')
            ]);

            setStudents(studentsRes.data);

            // Filter users for teachers (Assuming role 'TEACHER')
            const teacherList = usersRes.data.filter((u: any) => u.role === 'TEACHER');
            setTeachers(teacherList);

            setMarks(marksRes.data);
            setAttendance(attendanceRes.data);
            setUploads(uploadsRes.data);

            setLastSyncTime(new Date());
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsSyncing(false);
        }
    };

    // Load initial data
    useEffect(() => {
        fetchData();
    }, [isOnline]);

    const addStudent = async (studentData: any) => {
        try {
            await api.post('/students', studentData);
            fetchData(); // Refresh
        } catch (error) {
            console.error("Error adding student", error);
        }
    };

    const addTeacher = async (teacherData: any) => {
        try {
            await api.post('/users', { ...teacherData, role: 'TEACHER' });
            fetchData();
        } catch (error) {
            console.error("Error adding teacher", error);
        }
    };

    const addMark = async (markData: any) => {
        try {
            await api.post('/marks', markData);
            fetchData();
        } catch (error) {
            console.error("Error adding mark", error);
        }
    };

    const addUpload = async (formData: FormData) => {
        try {
            await api.post('/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            fetchData();
        } catch (error) {
            console.error("Error uploading file", error);
        }
    };

    const markAttendance = async (data: any) => {
        try {
            await api.post('/attendance', data);
            fetchData();
        } catch (error) {
            console.error("Error marking attendance", error);
        }
    };

    const syncData = async () => {
        await fetchData();
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
