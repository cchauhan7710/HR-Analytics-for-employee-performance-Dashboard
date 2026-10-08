USE hr_analytics;
 
CREATE TABLE IF NOT EXISTS employee_performance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employeeName VARCHAR(100) NOT NULL,
    employee_ID VARCHAR(50) NOT NULL,
    department VARCHAR(50) NOT NULL,
    performance_year INT NOT NULL,
    appraisal_rating DECIMAL(3,1) NOT NULL,
    goal_attainment DECIMAL(5,2) NOT NULL,
    performance_category VARCHAR(20) NOT NULL,
    FOREIGN KEY (employee_ID) REFERENCES employee(employee_ID)
);
 