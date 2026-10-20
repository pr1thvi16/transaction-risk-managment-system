package com.surveillance.engine.controller;

import com.surveillance.engine.model.Account;
import com.surveillance.engine.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    @Autowired
    private AccountService accountService;

    @GetMapping("/my")
    public ResponseEntity<Account> getMyAccount(
            @RequestHeader(value = "X-Username", required = false) String username) {
        Optional<Account> account = accountService.getByUsername(username);
        return account.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{accountNumber}")
    public ResponseEntity<Account> getByAccountNumber(@PathVariable String accountNumber) {
        Optional<Account> account = accountService.getByAccountNumber(accountNumber);
        return account.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
