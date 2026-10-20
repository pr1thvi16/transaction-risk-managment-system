USE surveillance_db;

CREATE TABLE users (
                       id BIGINT AUTO_INCREMENT PRIMARY KEY,
                       username VARCHAR(50) NOT NULL UNIQUE,
                       password VARCHAR(100) NOT NULL,
                       role VARCHAR(20) NOT NULL,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE transactions ADD COLUMN assigned_to VARCHAR(20);
ALTER TABLE transactions ADD COLUMN approval_status VARCHAR(20) DEFAULT 'PENDING';
ALTER TABLE transactions ADD COLUMN approved_by VARCHAR(50);
ALTER TABLE transactions ADD COLUMN customer_username VARCHAR(50);


INSERT INTO users (username, password, role) VALUES
                                                 ('customer1', 'password123', 'CUSTOMER'),
                                                 ('customer2', 'password123', 'CUSTOMER'),
                                                 ('manager1', 'password123', 'MANAGER_1'),
                                                 ('manager2', 'password123', 'MANAGER_2'),
                                                 ('manager3', 'password123', 'MANAGER_3');