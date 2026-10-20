package com.surveillance.engine.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
@Data
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fromAccount;
    private String toAccount;
    private Double amount;
    private String transactionType;
    private Integer riskScore = 0;
    private String status = "PENDING";
    private LocalDateTime createdAt = LocalDateTime.now();
    private String assignedTo;
    private String approvalStatus = "PENDING";
    private String approvedBy;
    private String customerUsername;
    private String managerHint;
    private String description;

}