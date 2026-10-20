package com.surveillance.engine.rules;

import com.surveillance.engine.model.Transaction;
import org.jeasy.rules.annotation.*;
import org.springframework.stereotype.Component;
import java.time.LocalTime;

@Component
@Rule(name = "LateNightRule", description = "Flag late night transactions")
public class LateNightRule {

    @Condition
    public boolean when(@Fact("transaction") Transaction transaction) {
        LocalTime now = LocalTime.now();
        return now.isAfter(LocalTime.of(0, 0)) &&
                now.isBefore(LocalTime.of(5, 0));
    }

    @Action
    public void then(@Fact("transaction") Transaction transaction) {
        transaction.setRiskScore(transaction.getRiskScore() + 20);
        transaction.setManagerHint("⚠️ Unusual: Transaction made between 12am-5am");
    }
}