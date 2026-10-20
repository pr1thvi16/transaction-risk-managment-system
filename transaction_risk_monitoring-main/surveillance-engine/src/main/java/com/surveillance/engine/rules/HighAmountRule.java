package com.surveillance.engine.rules;

import com.surveillance.engine.model.Transaction;
import org.jeasy.rules.annotation.Action;
import org.jeasy.rules.annotation.Condition;
import org.jeasy.rules.annotation.Fact;
import org.jeasy.rules.annotation.Rule;
import org.springframework.stereotype.Component;

@Component
@Rule(name = "HighAmountRule", description = "Flag high value transactions")
public class HighAmountRule {

    @Condition
    public boolean when(@Fact("transaction") Transaction transaction) {
        return transaction.getAmount() != null &&
               transaction.getAmount() > 1000000;
    }

    @Action
    public void then(@Fact("transaction") Transaction transaction) {
        transaction.setRiskScore(transaction.getRiskScore() + 40);
    }
}
