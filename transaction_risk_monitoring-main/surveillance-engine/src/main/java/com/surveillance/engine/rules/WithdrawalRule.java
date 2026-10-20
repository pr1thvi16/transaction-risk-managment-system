package com.surveillance.engine.rules;

import com.surveillance.engine.model.Transaction;
import org.jeasy.rules.annotation.*;
import org.springframework.stereotype.Component;

@Component
@Rule(name = "WithdrawalRule", description = "Flag withdrawal transactions")
public class WithdrawalRule {

    @Condition
    public boolean when(@Fact("transaction") Transaction transaction) {
        return "WITHDRAWAL".equalsIgnoreCase(transaction.getTransactionType());
    }

    @Action
    public void then(@Fact("transaction") Transaction transaction) {
        transaction.setRiskScore(transaction.getRiskScore() + 15);
    }
}
