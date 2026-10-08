-- ==============================================================================
-- HR Analytics Dashboard for Employee Performance
-- Database Schema Definition (MySQL)
-- ==============================================================================
-- This schema defines the database structure for tracking employee records,
-- periodic performance reviews, monthly attendance statistics, and task executions.
--
-- Tables:
-- 1. employees             : Master profile for each employee
-- 2. performance_reviews   : Semi-annual / periodic performance appraisal ratings
-- 3. attendance_monthly    : Monthly work/presence/absence/leave tracking
-- 4. tasks                 : Operational task assignments and completion status
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS Hr_Analytics;
USE Hr_Analytics;

-- ------------------------------------------------------------------------------
-- 1. EMPLOYEES TABLE (Master Table)
-- ------------------------------------------------------------------------------
-- Stores unique employee profiles. Every other metric table references employee_id.
CREATE TABLE IF NOT EXISTS employees (
    employee_id VARCHAR(50) NOT NULL,
    department VARCHAR(100) NOT NULL,
    job_title VARCHAR(100) NOT NULL,
    date_joined DATE NOT NULL,
    employment_status VARCHAR(50) NOT NULL DEFAULT 'Active',
    PRIMARY KEY (employee_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------------------------
-- 2. PERFORMANCE REVIEWS TABLE
-- ------------------------------------------------------------------------------
-- Records half-yearly appraisal metrics (e.g., 2023-H1 to 2025-H2).
-- rating_out_of_5: Recorded score on a 1.0 - 5.0 scale.
-- goals_completed_percent: % of goals achieved (0 - 100).
CREATE TABLE IF NOT EXISTS performance_reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(50) NOT NULL,
    review_date DATE NOT NULL,
    review_period VARCHAR(20) NOT NULL,
    rating_out_of_5 DECIMAL(3, 2) NOT NULL,
    goals_completed_percent DECIMAL(5, 2) NOT NULL,
    review_summary TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_perf_emp (employee_id),
    INDEX idx_perf_period (review_period),
    CONSTRAINT fk_perf_employee 
        FOREIGN KEY (employee_id) REFERENCES employees(employee_id) 
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------------------------
-- 3. ATTENDANCE MONTHLY TABLE
-- ------------------------------------------------------------------------------
-- Records monthly working days, days present, absent, and approved leaves.
-- attendance_rate_percent: (present_days / working_days) * 100
-- absenteeism_rate_percent: (absent_days / working_days) * 100
CREATE TABLE IF NOT EXISTS attendance_monthly (
    attendance_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(50) NOT NULL,
    month VARCHAR(7) NOT NULL, -- Format: YYYY-MM (e.g., '2025-01')
    working_days INT NOT NULL,
    present_days INT NOT NULL,
    absent_days INT NOT NULL,
    leave_days INT NOT NULL,
    attendance_rate_percent DECIMAL(5, 2) NOT NULL,
    absenteeism_rate_percent DECIMAL(5, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_att_emp (employee_id),
    INDEX idx_att_month (month),
    CONSTRAINT fk_att_employee 
        FOREIGN KEY (employee_id) REFERENCES employees(employee_id) 
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------------------------
-- 4. TASKS TABLE
-- ------------------------------------------------------------------------------
-- Operational tasks assigned to employees.
-- completed_date is NULL if task is still open (e.g., In Progress, Not Started).
CREATE TABLE IF NOT EXISTS tasks (
    task_id VARCHAR(50) NOT NULL,
    employee_id VARCHAR(50) NOT NULL,
    assigned_date DATE NOT NULL,
    due_date DATE NOT NULL,
    completed_date DATE NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'In Progress',
    priority VARCHAR(20) NOT NULL DEFAULT 'Medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (task_id),
    INDEX idx_tasks_emp (employee_id),
    INDEX idx_tasks_status (status),
    CONSTRAINT fk_tasks_employee 
        FOREIGN KEY (employee_id) REFERENCES employees(employee_id) 
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
