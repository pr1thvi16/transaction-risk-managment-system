package com.surveillance.engine.rules;

import com.surveillance.engine.model.Transaction;
import org.jeasy.rules.annotation.*;
import org.springframework.stereotype.Component;

@Component
@Rule(name = "AmountRule", description = "Flag suspicious amounts")
public class AmountRule {

    @Condition
    public boolean when(@Fact("transaction") Transaction transaction) {
        return transaction.getAmount() != null;
    }

    @Action
    public void then(@Fact("transaction") Transaction transaction) {
        double amount = transaction.getAmount();

        if (amount < 0) {
            transaction.setRiskScore(100);
            transaction.setManagerHint("🔴 REJECT: Negative amount detected");
            return;
        }

        if (amount > 1000000) {
            transaction.setRiskScore(transaction.getRiskScore() + 40);
            transaction.setManagerHint("🚨 Very high value: Amount > ₹10L");
        } else if (amount > 500000) {
            transaction.setRiskScore(transaction.getRiskScore() + 20);
            transaction.setManagerHint("⚠️ High value: Amount > ₹5L");
        } else if (amount > 100000) {
            transaction.setRiskScore(transaction.getRiskScore() + 10);
            transaction.setManagerHint("ℹ️ Review needed: Amount > ₹1L");
        }

        if (amount == 10000 || amount == 50000 || amount == 100000 ||
                amount == 500000 || amount == 1000000) {
            transaction.setRiskScore(transaction.getRiskScore() + 15);
            transaction.setManagerHint("⚠️ Suspicious: Exact round number amount");
        }
    }
}