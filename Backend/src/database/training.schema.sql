USE hr_analytics;
 
CREATE TABLE IF NOT EXISTS employee_training (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employeeName VARCHAR(100) NOT NULL,
    employee_ID VARCHAR(50) NOT NULL,
    department VARCHAR(50) NOT NULL,
    training_name VARCHAR(100) NOT NULL,
    training_date DATE NOT NULL,
    training_hours DECIMAL(5,2) NOT NULL,
    completion_status VARCHAR(20) NOT NULL,
    pre_training_score DECIMAL(5,2) NOT NULL,
    post_training_score DECIMAL(5,2) NOT NULL,
    score_improvement DECIMAL(5,2) NOT NULL,
    FOREIGN KEY (employee_ID) REFERENCES employee(employee_ID)
);
 