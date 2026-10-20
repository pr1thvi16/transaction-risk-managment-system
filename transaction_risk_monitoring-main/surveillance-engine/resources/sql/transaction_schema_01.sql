CREATE DATABASE `surveillance_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
CREATE TABLE `transactions` (
                                `id` BINARY(16) NOT NULL,
                                `from_account` varchar(255) NOT NULL,
                                `to_account` varchar(255) NOT NULL,
                                `amount` double NOT NULL,
                                `transaction_type` varchar(255) DEFAULT NULL,
                                `risk_score` int DEFAULT 0,
                                `description` varchar(255) DEFAULT NULL,
                                `status` varchar(255) DEFAULT "INITIATED",
                                `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;