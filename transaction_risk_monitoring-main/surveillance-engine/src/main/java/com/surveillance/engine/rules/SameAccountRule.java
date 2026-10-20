package com.surveillance.engine.rules;

import com.surveillance.engine.model.Transaction;
import org.jeasy.rules.annotation.*;
import org.springframework.stereotype.Component;

@Component
@Rule(name = "SameAccountRule", description = "Flag same account transactions")
public class SameAccountRule {

    @Condition
    public boolean when(@Fact("transaction") Transaction transaction) {
        return transaction.getFromAccount() != null &&
                transaction.getFromAccount().equals(transaction.getToAccount());
    }

    @Action
    public void then(@Fact("transaction") Transaction transaction) {
        transaction.setRiskScore(transaction.getRiskScore() + 50);
        transaction.setManagerHint("🔴 SUSPICIOUS: Transfer to same account detected");
    }
}