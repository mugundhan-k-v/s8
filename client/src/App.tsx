
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { NetworkProvider, AuthProvider, DataProvider } from './context';

// Layouts & Pages
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/layout/ProtectedRoute';
import LoginPage from './pages/Login';
import Dashboard from './pages/Dashboard';
import StudentsPage from './pages/Students';
import TeachersPage from './pages/Teachers';
import AttendancePage from './pages/Attendance';
import MarksPage from './pages/Marks';
import UploadsPage from './pages/Uploads';
import SettingsPage from './pages/Settings';


function App() {
    return (
        <NetworkProvider>
            <AuthProvider>
                <DataProvider>
                    <Router>
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/login" element={<LoginPage />} />

                            {/* Protected Routes */}
                            <Route element={<ProtectedRoute />}>
                                <Route element={<Layout />}>
                                    <Route path="/" element={<Dashboard />} />
                                    <Route path="/students" element={<StudentsPage />} />
                                    <Route path="/teachers" element={<TeachersPage />} />
                                    <Route path="/attendance" element={<AttendancePage />} />
                                    <Route path="/marks" element={<MarksPage />} />
                                    <Route path="/uploads" element={<UploadsPage />} />
                                    <Route path="/settings" element={<SettingsPage />} />
                                </Route>
                            </Route>

                            {/* Fallback */}
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </Router>
                </DataProvider>
            </AuthProvider>
        </NetworkProvider>
    );
}

export default App;
