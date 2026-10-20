package com.surveillance.engine.controller;

import com.surveillance.engine.model.Transaction;
import com.surveillance.engine.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
//import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired
    private TransactionService service;

    @GetMapping
    public List<Transaction> getTransactions(
            @RequestHeader(value = "X-Username", required = false) String username,
            @RequestHeader(value = "X-Role", required = false) String role) {

        if (role == null) return service.getAll();

        if (role.equals("CUSTOMER")) {
            return service.getByCustomerUsername(username);
        } else if (role.equals("MANAGER_1")) {
            return service.getByAssignedTo("MANAGER_1");
        } else if (role.equals("MANAGER_2")) {
            return service.getByAssignedTo("MANAGER_2");
        } else if (role.equals("MANAGER_3")) {
            return service.getAll();
        }
        return service.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Transaction> getById(@PathVariable Long id) {
        return service.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Transaction createTransaction(
            @RequestBody Transaction transaction,
            @RequestHeader(value = "X-Username", required = false) String username) {
        if (username != null) {
            transaction.setCustomerUsername(username);
            transaction.setManagerHint("This is Manager Hint");
        }
        return service.save(transaction);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Transaction> updateTransaction(
            @PathVariable Long id,
            @RequestBody Transaction transaction) {
        return ResponseEntity.ok(service.update(id, transaction));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<Transaction> approve(
            @PathVariable Long id,
            @RequestHeader(value = "X-Username", required = false) String username) {
        return ResponseEntity.ok(service.approve(id, username != null ? username : "manager"));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<Transaction> reject(
            @PathVariable Long id,
            @RequestHeader(value = "X-Username", required = false) String username) {
        return ResponseEntity.ok(service.reject(id, username != null ? username : "manager"));
    }
}
