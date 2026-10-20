package com.surveillance.engine.service;

import com.surveillance.engine.model.Transaction;
import com.surveillance.engine.repository.TransactionRepository;
import com.surveillance.engine.rules.RuleEngineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository repo;

    @Autowired
    private RuleEngineService ruleEngineService;

    @Autowired
    private AccountService accountService;

    public List<Transaction> getAll() {
        return repo.findAll();
    }

    public List<Transaction> getByCustomerUsername(String username) {
        return repo.findByCustomerUsername(username);
    }

    public List<Transaction> getByAssignedTo(String assignedTo) {
        return repo.findByAssignedTo(assignedTo);
    }

    public Optional<Transaction> getById(Long id) {
        return repo.findById(id);
    }

    public Transaction save(Transaction transaction) {
        ruleEngineService.evaluate(transaction);
        assignToManager(transaction);

        if (transaction.getAmount() != null &&
            transaction.getFromAccount() != null &&
            transaction.getToAccount() != null) {
            boolean success = accountService.transfer(
                transaction.getFromAccount(),
                transaction.getToAccount(),
                BigDecimal.valueOf(transaction.getAmount())
            );
            if (!success) {
                transaction.setStatus("FAILED");
                transaction.setApprovalStatus("REJECTED");
            }
        }

        return repo.save(transaction);
    }

    public Transaction update(Long id, Transaction updated) {
        updated.setId(id);
        ruleEngineService.evaluate(updated);
        assignToManager(updated);
        return repo.save(updated);
    }

    public Transaction approve(Long id, String approvedBy) {
        Transaction transaction = repo.findById(id).orElseThrow();
        transaction.setApprovalStatus("APPROVED");
        transaction.setApprovedBy(approvedBy);
        return repo.save(transaction);
    }

    public Transaction reject(Long id, String rejectedBy) {
        Transaction transaction = repo.findById(id).orElseThrow();
        transaction.setApprovalStatus("REJECTED");
        transaction.setApprovedBy(rejectedBy);
        return repo.save(transaction);
    }

    private void assignToManager(Transaction transaction) {
        if (transaction.getAmount() == null) return;
        if (transaction.getAmount() < 1000) {
            transaction.setAssignedTo("MANAGER_1");
        } else if (transaction.getAmount() < 10000) {
            transaction.setAssignedTo("MANAGER_2");
        } else {
            transaction.setAssignedTo("MANAGER_3");
        }
    }
}
