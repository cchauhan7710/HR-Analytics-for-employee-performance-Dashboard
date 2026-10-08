
USE Hr_Analytics;
SHOW TABLES;

CREATE TABLE IF NOT EXISTS employee (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employeeName VARCHAR(100) NOT NULL,
    employee_ID VARCHAR(50) NOT NULL UNIQUE,
    gender VARCHAR(20) NOT NULL,
    department VARCHAR(50) NOT NULL,
    designation VARCHAR(50) NOT NULL,
    grade VARCHAR(10) NOT NULL,
    date_of_Joining DATE NOT NULL,
    current_Status VARCHAR(20) NOT NULL,
    annual_CTC INT NOT NULL,
    annual_leave_entitlement INT NOT NULL,
    sick_leave_entitlement INT NOT NULL
);


USE Hr_Analytics;
SHOW TABLES;

CREATE TABLE IF NOT EXISTS Leave (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employeeName VARCHAR(100) NOT NULL,
    employee_ID VARCHAR(50) NOT NULL UNIQUE,
    leave_Type VARCHAR(20) NOT NULL,
    leave_Start_Date DATE NOT NULL,
    leave_end_date DATE NOT NULL,
    total_leave_days INT NOT NULL,
    entitled_leave_days INT NOT NULL,
    Year INT NOT NULL
    leave_reason VARCHAR NOT NULL,
    
);