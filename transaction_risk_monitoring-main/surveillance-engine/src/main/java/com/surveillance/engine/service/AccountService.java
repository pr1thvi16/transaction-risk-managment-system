package com.surveillance.engine.service;

import com.surveillance.engine.model.Account;
import com.surveillance.engine.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.Optional;

@Service
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;

    public Optional<Account> getByUsername(String username) {
        return accountRepository.findByUsername(username);
    }

    public Optional<Account> getByAccountNumber(String accountNumber) {
        return accountRepository.findByAccountNumber(accountNumber);
    }

    public boolean transfer(String fromAccountNumber, String toAccountNumber, BigDecimal amount) {
        Optional<Account> fromOpt = accountRepository.findByAccountNumber(fromAccountNumber);
        Optional<Account> toOpt = accountRepository.findByAccountNumber(toAccountNumber);

        if (fromOpt.isEmpty() || toOpt.isEmpty()) {
            return false;
        }

        Account from = fromOpt.get();
        Account to = toOpt.get();

        if (from.getBalance().compareTo(amount) < 0) {
            return false;
        }

        from.setBalance(from.getBalance().subtract(amount));
        to.setBalance(to.getBalance().add(amount));

        accountRepository.save(from);
        accountRepository.save(to);

        return true;
    }
}
