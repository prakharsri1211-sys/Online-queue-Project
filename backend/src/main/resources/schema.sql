CREATE TABLE IF NOT EXISTS vitals_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL,
    heart_rate INT,
    status VARCHAR(50)
);
