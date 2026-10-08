Synthetic HR Analytics Dataset

Contents
- employees.csv: 1,000 employees
- performance_reviews.csv: 6,000 reviews (six half-yearly periods per employee, 2023-H1 through 2025-H2)
- attendance_monthly.csv: 12,000 monthly attendance records (12 months per employee in calendar year 2025)
- tasks.csv: 10,000 tasks (10 per employee)

All records are fictional and generated for software development and demonstration. Employee IDs are the join key across files. No real names or personal information are included. Performance scores and operational records are simulated; do not use them to make real employment decisions.

Suggested MySQL import order: employees, then performance_reviews, attendance_monthly, and tasks. Define employee_id as the primary key in employees and as a foreign key in the other tables.

Metric notes
- rating_out_of_5 is a synthetic review score, not a validated assessment instrument.
- goals_completed_percent is a simulated percentage.
- Attendance rates are provided for convenience and can be recalculated from day counts. Leave days are excluded from present days in this sample.
- For completed tasks, completion time is completed_date minus assigned_date; on-time status can be calculated by comparing completed_date with due_date. Open tasks have a blank completed_date.
