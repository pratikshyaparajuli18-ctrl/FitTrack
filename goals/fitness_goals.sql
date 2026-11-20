CREATE TABLE fitness_goals (
    goal_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    goal_type VARCHAR(50) NOT NULL,
    target_value DECIMAL(10,2) NOT NULL,
    current_value DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
