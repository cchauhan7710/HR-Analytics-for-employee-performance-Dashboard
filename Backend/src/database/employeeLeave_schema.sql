
USE hr_analytics;
 
CREATE TABLE IF NOT EXISTS employee_leave (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employeeName VARCHAR(100) NOT NULL,
    employee_ID VARCHAR(50) NOT NULL,
    leave_Type VARCHAR(20) NOT NULL,
    leave_Start_Date DATE NOT NULL,
    leave_end_date DATE NOT NULL,
    total_leave_days INT NOT NULL,
    entitled_leave_days INT NOT NULL,
    Year INT NOT NULL,
    leave_reason VARCHAR(255) NOT NULL,
    FOREIGN KEY (employee_ID) REFERENCES employee(employee_ID)
);
 
-- -- Sample data matching your sheet
-- INSERT INTO employee_leave (
--     employeeName, employee_ID, leave_Type, leave_Start_Date, leave_end_date,
--     total_leave_days, entitled_leave_days, Year, leave_reason
-- ) VALUES
-- ('Ravinder Bhatia', 'EMP001', 'Casual', '2026-04-07', '2026-04-08', 2, 8, 2026, 'Personal work'),
-- ('Ravinder Bhatia', 'EMP001', 'Sick', '2026-04-08', '2026-04-09', 2, 12, 2026, 'Illness');
 