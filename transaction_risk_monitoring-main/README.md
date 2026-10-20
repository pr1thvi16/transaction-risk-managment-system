# Transaction Risk Monitoring

A full-stack financial surveillance system that monitors transactions in real-time, applies configurable business rules, computes risk scores automatically, and displays actionable alerts on a live dashboard.

## Table of Contents
- [Introduction](#introduction)
- [Problem Statement](#problem-statement)
- [Objectives](#objectives)
- [System Architecture](#system-architecture)
- [Technologies Used](#technologies-used)
- [Prerequisites](#prerequisites)
- [Core Features](#core-features)
- [Rule Engine](#rule-engine)
- [Risk Scoring](#risk-scoring)
- [Project Structure](#project-structure)
- [Local Setup](#local-setup)
- [AWS EC2 Deployment](#aws-ec2-deployment)
- [API Endpoints](#api-endpoints)
- [Dashboard](#dashboard)
- [Future Enhancements](#future-enhancements)

## Introduction
In modern financial systems, digital transactions have exploded due to online banking, UPI, securities trading, and cross-border payments. This growth amplifies risks like fraud, money laundering, and compliance violations.

**transaction_risk_monitoring** continuously monitors transaction streams, applies configurable rules, computes risk scores, and presents alerts on a live dashboard. Perfect for investment banking, payments, AML, and audit teams.

## Problem Statement
Legacy surveillance systems suffer from:
- **Batch processing** - End-of-day analysis misses real-time fraud
- **Rigid rules** - Code changes needed for new scenarios
- **No live visibility** - Risk teams lack unified real-time views
- **Weak audit trails** - Flagged transactions lack clear justification

## Objectives
- Build real-time transaction monitoring system
- Create configurable rule engine (thresholds, velocity, patterns)
- Compute per-transaction risk scores automatically
- Deliver live compliance dashboard with alerts
- Maintain complete audit-ready logs
- Design scalable architecture for financial environments

## System Architecture
```text
┌─────────────────────────────────────────────────────────────┐
│                    React.js Dashboard                        │
│              (Live UI - localhost:3000)                      │
└─────────────────────┬───────────────────────────────────────┘
                      │ REST API Calls (axios)
┌─────────────────────▼───────────────────────────────────────┐
│              Spring Boot Backend (Port 8080)                 │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │ Transaction │  │  Rule Engine  │  │   Transaction    │   │
│  │ Controller  │→ │  (Easy Rules) │→ │    Service       │   │
│  └─────────────┘  └──────────────┘  └──────────────────┘   │
│         │                                    │               │
│  ┌──────▼────────────────────────────────────▼────────────┐ │
│  │              Transaction Repository (JPA)               │ │
│  └─────────────────────────┬───────────────────────────────┘ │
└────────────────────────────┼────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────┐
│                    MySQL Database                            │
│                  (surveillance_db)                           │
└─────────────────────────────────────────────────────────────┘
```

## Technologies Used
| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React.js | Live compliance dashboard |
| **Backend** | Java 21 + Spring Boot | REST APIs, business logic |
| **Rule Engine** | Easy Rules | Configurable risk evaluation |
| **Database** | MySQL 8.0 | Transaction & risk score storage |
| **ORM** | Spring Data JPA + Hibernate | Database operations |
| **Charts** | Recharts | Risk visualization |
| **HTTP** | Axios | Frontend-backend communication |
| **Build** | Maven (Backend), npm (Frontend) | Dependency management |

## Prerequisites
- **Java 21** (OpenJDK recommended)
- **Maven 3.9+**
- **MySQL 8.0+**
- **Node.js v20+** and **npm**
- **IntelliJ IDEA** (recommended for Java)
- **VS Code** (optional for React)

## Project Structure
```text
surveillance-engine/          # Spring Boot Backend
├── src/main/java/com/surveillance/
│   ├── model/Transaction.java
│   ├── repository/TransactionRepository.java
│   ├── service/TransactionService.java
│   ├── controller/TransactionController.java
│   └── rules/*.java
└── pom.xml

surveillance-ui/              # React Frontend
├── src/App.js
├── package.json
└── public/
```

## Local Setup
### Backend
1. Update `surveillance-engine/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/surveillance_db
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
server.port=8080
```

2. Start the backend:
```bash
cd surveillance-engine
./mvnw clean install
./mvnw spring-boot:run
```

3. Verify the backend:
```bash
curl http://localhost:8080
```

### Frontend
1. Update the API URL in `surveillance-ui/src/App.js`:
```js
const API_URL = 'http://localhost:8080';
```

2. Start the frontend:
```bash
cd surveillance-ui
npm install
npm start
```

3. Open the dashboard:
```text
http://localhost:3000
```

## AWS EC2 Deployment
### 1. SSH into the EC2 instance
```bash
ssh -i "your-keypair.pem" ubuntu@<ec2-public-ip>
```

### 2. Build and run the Spring Boot backend
```bash
cd ~/javaproject/transaction_risk_monitoring/surveillance-engine
./mvnw clean package
nohup java -jar target/*.jar > app.log 2>&1 &
```

### 3. Build and run the React frontend
```bash
cd ~/javaproject/transaction_risk_monitoring/surveillance-ui
npm install
npm run build
sudo npm install -g serve
nohup serve -s build -l 3000 > react.log 2>&1 &
```

### 4. Update the frontend API URL for AWS
In `surveillance-ui/src/App.js`, use the EC2 public IP or domain:
```js
const API_URL = 'http://<ec2-public-ip>:8080';
```

### 5. Open the app
```text
http://<ec2-public-ip>:3000
```

### 6. Ensure AWS security group allows traffic
Open inbound ports:
- **3000** for React frontend
- **8080** for Spring Boot backend
- **22** for SSH access

## Core Features
1. **Real-Time Transaction Ingestion** via REST API
2. **Configurable Rule Engine** - Add rules without code changes
3. **Automatic Risk Scoring** (0-100 scale)
4. **Live Dashboard** with color-coded alerts
5. **Full Audit Trail** for every decision

## Rule Engine
Active Rules (from RuleEngineService): AmountRule, TransactionTypeRule, VelocityRule, SameAccountRule, LateNightRule

| Rule                | Triggers                               | Risk Score | Manager Hint                                   |
| ------------------- | -------------------------------------- | ---------- | ---------------------------------------------- |
| AmountRule          | Amount < 0                             | +100       | 🔴 REJECT: Negative amount detected            |
|                     | Amount > ₹10L                          | +40        | 🚨 Very high value: Amount > ₹10L              |
|                     | Amount > ₹5L                           | +20        | ⚠️ High value: Amount > ₹5L                    |
|                     | Amount > ₹1L                           | +10        | ℹ️ Review needed: Amount > ₹1L                 |
|                     | Exact round amounts (₹10K, ₹50K, etc.) | +15        | ⚠️ Suspicious: Exact round number amount       |
| TransactionTypeRule | INTERNATIONAL                          | +25        | ⚠️ International transfer detected             |
|                     | INTERNATIONAL > ₹5L                    | +40        | 🚨 Large international transfer > ₹5L          |
|                     | CRYPTO                                 | +30        | ⚠️ Crypto transaction detected                 |
|                     | CRYPTO > ₹1L                           | +50        | 🚨 Large crypto transaction > ₹1L              |
|                     | WITHDRAWAL > ₹2L                       | +30        | ⚠️ Large withdrawal > ₹2L                      |
| VelocityRule        | 3+ txns/5min                           | +35        | ⚠️ High velocity: 3+ transactions in 5 minutes |
|                     | 5+ txns/1hr                            | +45        | 🚨 Suspicious: 5+ transactions in 1 hour       |
|                     | 10+ txns/1day                          | +60        | 🔴 BLOCK: 10+ transactions in 1 day            |
| SameAccountRule     | from=to account                        | +50        | 🔴 SUSPICIOUS: Transfer to same account        |
| LateNightRule       | 12am-5am                               | +20        | ⚠️ Unusual: Transaction made between 12am-5am  |

**Example Rule:**
```java
@Component
@Rule(name = "HighAmountRule")
public class HighAmountRule {
    @Condition
    public boolean when(@Fact("transaction") Transaction t) {
        return t.getAmount() > 1000000;
    }

    @Action
    public void then(@Fact("transaction") Transaction t) {
        t.setRiskScore(t.getRiskScore() + 40);
    }
}
```

## Risk Scoring
| Score | Status | Indicator |
|-------|--------|-----------|
| 0-39 | PENDING | 🟢 |
| 40-74 | FLAGGED | 🟡 |
| 75-100 | ESCALATED | 🔴 |

## API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/transactions` | List all transactions |
| `GET` | `/api/transactions/{id}` | Get transaction by ID |
| `POST` | `/api/transactions` | Create + auto-score |
| `PUT` | `/api/transactions/{id}` | Update transaction |

**Sample POST:**
```json
{
  "fromAccount": "ACC001",
  "toAccount": "ACC002",
  "amount": 1500000,
  "transactionType": "TRANSFER"
}
```

## Dashboard
- **Transaction Form** - Add transactions instantly
- **Live Table** - Color-coded risk indicators
- **Edit Mode** - Update any transaction
- **Risk Visualization** - 🟢🟡🔴 indicators

## Future Enhancements
- Kafka for high-throughput streaming
- WebSockets for real-time updates
- ML anomaly detection
- Graph analysis for networks
- Docker/Kubernetes deployment
- Multi-tenant support
