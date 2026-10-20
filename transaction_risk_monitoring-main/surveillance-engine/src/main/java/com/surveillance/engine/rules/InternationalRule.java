package com.surveillance.engine.rules;

import com.surveillance.engine.model.Transaction;
import org.jeasy.rules.annotation.*;
import org.springframework.stereotype.Component;

@Component
@Rule(name = "InternationalRule", description = "Flag international transactions")
public class InternationalRule {

    @Condition
    public boolean when(@Fact("transaction") Transaction transaction) {
        return "INTERNATIONAL".equalsIgnoreCase(transaction.getTransactionType());
    }

    @Action
    public void then(@Fact("transaction") Transaction transaction) {
        transaction.setRiskScore(transaction.getRiskScore() + 25);
    }
}
