package com.surveillance.engine.rules;

import com.surveillance.engine.model.Transaction;
import org.jeasy.rules.annotation.*;
import org.springframework.stereotype.Component;

@Component
@Rule(name = "TransactionTypeRule", description = "Flag by transaction type")
public class TransactionTypeRule {

    @Condition
    public boolean when(@Fact("transaction") Transaction transaction) {
        return transaction.getTransactionType() != null;
    }

    @Action
    public void then(@Fact("transaction") Transaction transaction) {
        String type = transaction.getTransactionType();
        double amount = transaction.getAmount() != null ? transaction.getAmount() : 0;
        boolean noDescription = transaction.getDescription() == null ||
                transaction.getDescription().trim().isEmpty();

        if ("INTERNATIONAL".equalsIgnoreCase(type)) {
            transaction.setRiskScore(transaction.getRiskScore() + 25);
            transaction.setManagerHint("⚠️ International transfer detected");
            if (amount > 500000) {
                transaction.setRiskScore(transaction.getRiskScore() + 40);
                transaction.setManagerHint("🚨 Large international transfer > ₹5L");
            }
        }

        if ("CRYPTO".equalsIgnoreCase(type)) {
            transaction.setRiskScore(transaction.getRiskScore() + 30);
            transaction.setManagerHint("⚠️ Crypto transaction detected");
            if (amount > 100000) {
                transaction.setRiskScore(transaction.getRiskScore() + 50);
                transaction.setManagerHint("🚨 Large crypto transaction > ₹1L");
            }
        }

        if ("WITHDRAWAL".equalsIgnoreCase(type)) {
            if (amount > 200000) {
                transaction.setRiskScore(transaction.getRiskScore() + 30);
                transaction.setManagerHint("⚠️ Large withdrawal > ₹2L");
            }
            if (noDescription) {
                transaction.setRiskScore(transaction.getRiskScore() + 15);
                transaction.setManagerHint("ℹ️ Withdrawal with no description");
            }
        }

        if ("TRANSFER".equalsIgnoreCase(type) && noDescription) {
            transaction.setRiskScore(transaction.getRiskScore() + 10);
            transaction.setManagerHint("ℹ️ Transfer with no description");
        }
    }
}