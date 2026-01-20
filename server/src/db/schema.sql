-- UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table (Role-based Access)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) CHECK (role IN ('SCHOOL', 'BLOCK', 'DISTRICT', 'STATE_ADMIN', 'TEACHER')),
    school_id UUID, -- Nullable if not a school/teacher
    assigned_class VARCHAR(50), -- Only for TEACHER
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Schools Table
CREATE TABLE schools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL, -- UDISE Code
    name VARCHAR(255) NOT NULL,
    block_id UUID,
    district_id UUID,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Students Table
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES schools(id),
    name VARCHAR(255) NOT NULL,
    roll_no VARCHAR(50),
    class VARCHAR(50) NOT NULL,
    section VARCHAR(10),
    guardian_name VARCHAR(255),
    assigned_teacher_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_synced_at TIMESTAMP WITH TIME ZONE
);

-- 4. Teachers Table (Staff Profiles)
CREATE TABLE teachers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES schools(id),
    user_id UUID REFERENCES users(id), -- Link to login user if applicable
    name VARCHAR(255) NOT NULL,
    subject_specialization VARCHAR(255),
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Attendance Records
CREATE TABLE attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    school_id UUID REFERENCES schools(id),
    class VARCHAR(50),
    section VARCHAR(10),
    total_students INT,
    present_student_ids JSONB, -- Array of UUIDs
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    source_device_id UUID
);

-- 6. Marks / Academic Records
CREATE TABLE marks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id),
    exam_type VARCHAR(50),
    subject VARCHAR(100),
    marks_obtained DECIMAL(5,2),
    total_marks DECIMAL(5,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    source_device_id UUID
);

-- 7. Monthly File Uploads
CREATE TABLE file_uploads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES schools(id),
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size_bytes BIGINT,
    file_type VARCHAR(50),
    upload_status VARCHAR(50) DEFAULT 'COMPLETED',
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Sync Logs (For Audit & Debugging)
CREATE TABLE sync_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID NOT NULL,
    school_id UUID,
    sync_start_time TIMESTAMP WITH TIME ZONE,
    sync_end_time TIMESTAMP WITH TIME ZONE,
    records_processed INT,
    status VARCHAR(50) CHECK (status IN ('SUCCESS', 'PARTIAL', 'FAILED')),
    error_message TEXT
);
