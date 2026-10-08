USE Hr_Analytics;
 
CREATE TABLE IF NOT EXISTS attendance_summary (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employeeName VARCHAR(100) NOT NULL,
    employee_ID VARCHAR(50) NOT NULL,
    department VARCHAR(50) NOT NULL,
    month VARCHAR(20) NOT NULL,
    month_start_date DATE NOT NULL,
    month_end_date DATE NOT NULL,
    total_working_days INT NOT NULL,
    present_days INT NOT NULL,
    absent_days INT NOT NULL,
    leave_days INT NOT NULL,
    total_accounted_days INT NOT NULL,
    attendance_rate DECIMAL(5,2) NOT NULL,
    absenteeism_rate DECIMAL(5,2) NOT NULL,
    FOREIGN KEY (employee_ID) REFERENCES employee(employee_ID)
);
 