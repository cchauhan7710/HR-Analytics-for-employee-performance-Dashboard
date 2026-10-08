CREATE DATABASE IF NOT EXISTS Hr_Analytics;

USE Hr_Analytics;

CREATE TABLE IF NOT EXISTS users(
    id int AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL ,
    role ENUM('admin' , 'hr_manager' , 'viewer') DEFAULT 'viewer',
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP     
);

-- Master Employees Table
CREATE TABLE IF NOT EXISTS employees (
    employee_id VARCHAR(50) NOT NULL,
    department VARCHAR(100) NOT NULL,
    job_title VARCHAR(100) NOT NULL,
    date_joined DATE NOT NULL,
    employment_status VARCHAR(50) NOT NULL DEFAULT 'Active',
    PRIMARY KEY (employee_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Performance Reviews Table
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

-- Monthly Attendance Table
CREATE TABLE IF NOT EXISTS attendance_monthly (
    attendance_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(50) NOT NULL,
    month VARCHAR(7) NOT NULL,
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

-- Tasks Table
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