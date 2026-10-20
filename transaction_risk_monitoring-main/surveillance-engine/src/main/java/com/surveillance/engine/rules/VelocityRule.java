package com.surveillance.engine.rules;

import com.surveillance.engine.model.Transaction;
import com.surveillance.engine.repository.TransactionRepository;
import org.jeasy.rules.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Component
@Rule(name = "VelocityRule", description = "Flag high velocity transactions")
public class VelocityRule {

    @Autowired
    private TransactionRepository repo;

    @Condition
    public boolean when(@Fact("transaction") Transaction transaction) {
        return transaction.getFromAccount() != null;
    }

    @Action
    public void then(@Fact("transaction") Transaction transaction) {
        String from = transaction.getFromAccount();
        LocalDateTime now = LocalDateTime.now();

        try {
            List<Transaction> last5Min = repo.findByFromAccountAndCreatedAtAfter(from, now.minusMinutes(5));
            List<Transaction> lastHour = repo.findByFromAccountAndCreatedAtAfter(from, now.minusHours(1));
            List<Transaction> lastDay = repo.findByFromAccountAndCreatedAtAfter(from, now.minusDays(1));

            if (last5Min.size() >= 3) {
                transaction.setRiskScore(transaction.getRiskScore() + 35);
                transaction.setManagerHint("⚠️ High velocity: 3+ transactions in 5 minutes");
            }
            if (lastHour.size() >= 5) {
                transaction.setRiskScore(transaction.getRiskScore() + 45);
                transaction.setManagerHint("🚨 Suspicious: 5+ transactions in 1 hour");
            }
            if (lastDay.size() >= 10) {
                transaction.setRiskScore(transaction.getRiskScore() + 60);
                transaction.setManagerHint("🔴 BLOCK: 10+ transactions in 1 day");
            }

            if (transaction.getToAccount() != null) {
                List<Transaction> samePair = repo.findByFromAccountAndToAccountAndCreatedAtAfter(
                        from, transaction.getToAccount(), now.minusDays(1));
                if (samePair.size() >= 3) {
                    transaction.setRiskScore(transaction.getRiskScore() + 30);
                    transaction.setManagerHint("⚠️ Same pair repeated 3+ times today");
                }
            }

            long failed = lastDay.stream()
                    .filter(t -> "FAILED".equals(t.getStatus())).count();
            if (failed >= 2) {
                transaction.setRiskScore(transaction.getRiskScore() + 40);
                transaction.setManagerHint("🚨 2+ failed transactions detected");
            }

            List<String> distinctTo = lastDay.stream()
                    .map(Transaction::getToAccount)
                    .filter(a -> a != null)
                    .distinct()
                    .collect(Collectors.toList());
            if (distinctTo.size() >= 5) {
                transaction.setRiskScore(transaction.getRiskScore() + 40);
                transaction.setManagerHint("🚨 Sending to 5+ different accounts today");
            }

            double totalToday = lastDay.stream()
                    .mapToDouble(t -> t.getAmount() != null ? t.getAmount() : 0).sum();
            if (totalToday > 1000000) {
                transaction.setRiskScore(transaction.getRiskScore() + 50);
                transaction.setManagerHint("🔴 Total transactions exceed ₹10L today");
            }
        } catch (Exception e) {
            // Skip velocity check if error
        }
    }
}