CREATE TABLE todolist_simple (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT DEFAULT NULL,

    is_done BOOL DEFAULT 0,
    
    start_time DATETIME DEFAULT NULL,
    end_time DATETIME DEFAULT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_user_id (user_id),
    
    INDEX idx_user_status (user_id, is_done),

    CONSTRAINT fk_todolist_user_id FOREIGN KEY (user_id) REFERENCES users(id)
);