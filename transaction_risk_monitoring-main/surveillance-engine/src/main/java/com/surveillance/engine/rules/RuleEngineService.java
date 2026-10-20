package com.surveillance.engine.rules;

import com.surveillance.engine.model.Transaction;
import org.jeasy.rules.api.Facts;
import org.jeasy.rules.api.Rules;
import org.jeasy.rules.api.RulesEngine;
import org.jeasy.rules.core.DefaultRulesEngine;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RuleEngineService {

    @Autowired
    private AmountRule amountRule;

    @Autowired
    private TransactionTypeRule transactionTypeRule;

    @Autowired
    private VelocityRule velocityRule;

    @Autowired
    private SameAccountRule sameAccountRule;

    @Autowired
    private LateNightRule lateNightRule;

    public void evaluate(Transaction transaction) {
        transaction.setRiskScore(0);
        transaction.setManagerHint("");

        Facts facts = new Facts();
        facts.put("transaction", transaction);

        Rules rules = new Rules();
        rules.register(amountRule);
        rules.register(transactionTypeRule);
        rules.register(velocityRule);
        rules.register(sameAccountRule);
        rules.register(lateNightRule);

        RulesEngine engine = new DefaultRulesEngine();
        engine.fire(rules, facts);

        int score = Math.min(transaction.getRiskScore(), 100);
        transaction.setRiskScore(score);

        if (transaction.getManagerHint() == null || transaction.getManagerHint().isEmpty()) {
            transaction.setManagerHint("✅ No Risk Detected");
        }

        if (score >= 75) {
            transaction.setStatus("ESCALATED");
        } else if (score >= 40) {
            transaction.setStatus("FLAGGED");
        } else {
            transaction.setStatus("PENDING");
        }
    }
}