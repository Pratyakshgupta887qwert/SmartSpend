<div align="center">

# 💰 SmartSpend

### AI-Powered Receipt-Based Expense Tracker

[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)](https://reactjs.org/)
[![React Native](https://img.shields.io/badge/React_Native-Expo-61DAFB?logo=react)](https://expo.dev/)
[![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?logo=dotnet)](https://dotnet.microsoft.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16.x-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-Enabled-4285F4?logo=google)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**A full-stack, multi-platform expense management system that digitizes receipts, categorizes expenses, tracks budgets, and provides AI-powered financial insights via natural language queries.**

[Overview](#-project-overview) • [Features](#-core-features) • [Architecture](#️-system-architecture) • [Tech Stack](#-final-technology-stack) • [API](#-api-endpoints) • [Getting Started](#-getting-started)

</div>

---

## 📌 Project Overview

**SmartSpend** is a full-stack, **multi-platform** expense tracking system:

- 🌐 **Web Application:** React (Vite)
- 📱 **Mobile Application:** React Native (Expo) — Android & iOS
- 🖥 **Backend API:** ASP.NET Core 8 Web API
- 🗄 **Database:** PostgreSQL
- 🤖 **AI Layer:** Gemini API (Multimodal) for OCR + insights

SmartSpend enables users to upload/capture receipt images, extract structured expense details automatically, and ask natural language questions like:

- “How much did I spend on food this month?”
- “Why is my spending higher than last month?”
- “How can I save ₹2000 next month?”

> **Project Type:** Group Mini Project (Academic)  
> **Course:** Bachelor of Technology in Computer Science and Engineering  
> **Institution:** GLA University  
> **Semester:** 6th Sem  

---

## 🎯 Problem Statement

Current expense tracking systems often suffer from:

- Loss of physical receipts
- Manual data entry errors
- Lack of intelligent insights
- No natural language interaction
- Fragmented OCR and analytics workflows

**SmartSpend solves this** with a unified platform that:
- digitizes receipts automatically,
- stores structured financial data,
- provides dashboards and analytics,
- supports natural language financial queries,
- and enables budget control by category.

---

## ✅ Objectives

- Automate receipt digitization using AI
- Store structured financial data securely
- Provide real-time analytics dashboard
- Enable natural language financial queries
- Implement category-wise budget control
- Deliver cross-platform access (Web + Mobile)

---

## 🧰 Final Technology Stack

### Frontend

**Web Application**
- React.js (Vite)
- Tailwind CSS
- Axios
- React Router

**Mobile Application**
- React Native (Expo)
- React Navigation
- Expo Camera
- Expo Image Picker

### Backend
- ASP.NET Core 8 Web API
- Entity Framework Core
- JWT Authentication
- Swagger / OpenAPI

### Database
- PostgreSQL
- Npgsql EF Core Provider

Stores:
- Users
- Expenses
- Categories
- Budgets
- Receipt metadata

### AI Layer (Gemini API — Multimodal)
Used for:
- **OCR Extraction:** merchant, date, amount, items (if present)
- **Financial Insights:** explanations, saving suggestions, pattern detection, anomalies

**Important design principle**
- ✅ Backend calculates totals and analytics.
- ✅ Gemini explains insights.
- ❌ AI does not replace database logic.

---

## 🏗️ System Architecture

```
User (Web or Mobile)
        ↓
React / React Native Frontend
        ↓ (REST API)
ASP.NET Core Backend
        ↓
PostgreSQL Database
        ↓
Gemini API (OCR + Insights)
```

---


## ✨ Core Features

### 🧾 1) Receipt Scanning & Digitization
**Workflow**
1. User captures/uploads receipt image
2. Backend stores image + metadata
3. Gemini extracts structured data (OCR)
4. Backend validates response
5. Expense is saved in PostgreSQL

**Extracted fields**
- Merchant
- Total amount
- Date
- Items (if available)

**Fallback**
- Manual edit supported when OCR is incomplete

---

### 📊 2) Expense Dashboard
Displays:
- Monthly spending summary
- Category-wise breakdown
- Interactive charts
- Trend analysis (weekly / monthly)

Example endpoints:
- `GET /api/dashboard/summary`
- `GET /api/analytics/by-category`

---

### 🤖 3) AI Insights & Natural Language Queries
**How it works**
1. User asks a question
2. Backend aggregates relevant data from PostgreSQL
3. Backend sends structured JSON + question to Gemini
4. Gemini returns an explanation/insight
5. Frontend displays results

Capabilities:
- Pattern detection
- Budget comparison
- Weekend vs weekday analysis
- Spending anomaly detection
- Saving suggestions

---

### 🔔 4) Budget Management
- Set monthly limit per category
- Track current spending vs limit
- Alerts when nearing limit
- AI-based optimization suggestions

---
---

## 🔁 Project Workflow (End-to-End)

### Receipt Upload Flow
`User → Upload → API → Gemini → JSON → Validate → Save → Return`

### AI Query Flow
`User Question → API → Query DB → Structured JSON → Gemini → Insight → Return`

---

## 🧩 Non-Functional Requirements

- Responsive UI
- Secure authentication
- Scalable backend architecture
- Error handling & validation
- Modular service layer
- API documentation via Swagger

---

## 🔮 Future Scope

- Recurring expense detection
- Predictive spending forecast
- Subscription tracking
- Multi-user shared expenses
- Desktop app (Electron)
- Bank integration APIs

---

## ⚙️ Getting Started

> Note: This section describes the **final stack** (ASP.NET Core 8 + PostgreSQL + React Web + React Native Expo).

### Prerequisites
- Node.js (v18+)
- .NET SDK (8.0+)
- PostgreSQL (14+ recommended)
- Gemini API Key

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Pratyakshgupta887qwert/SmartSpend.git
cd SmartSpend
```

### 2️⃣ Backend Setup (ASP.NET Core + PostgreSQL)
```bash
cd server/SmartSpend.API
dotnet restore
```

Configure `appsettings.json` (example):
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=smartspend;Username=postgres;Password=your_password"
  },
  "JwtSettings": {
    "Secret": "your-secret-key-min-32-chars",
    "ExpiryMinutes": 1440
  },
  "GeminiApi": {
    "ApiKey": "your-gemini-api-key"
  }
}
```

Run migrations & start server:
```bash
dotnet ef database update
dotnet run
```

Swagger:
- `https://localhost:5001/swagger`

### 3️⃣ Web Frontend Setup (React + Vite)
```bash
cd client
npm install
```

Create `.env`:
```env
VITE_API_URL=https://localhost:5001/api
```

Start:
```bash
npm run dev
```

### 4️⃣ Mobile App Setup (React Native + Expo)
```bash
cd mobile
npm install
npx expo start
```

---

## 🎓 Academic Value

This project demonstrates:
- Full-stack development (Web + Mobile + Backend)
- RESTful API design
- Database modeling with PostgreSQL
- JWT authentication
- AI integration in production-style architecture
- Retrieval-Augmented Generation (RAG)
- Clean layered architecture

---

## 👥 Team

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/Pratyakshgupta887qwert">
        <img src="https://github.com/Pratyakshgupta887qwert.png" width="100px;" alt="Team Member 1"/>
        <br />
        <sub><b>Pratyaksh Gupta</b></sub>
      </a>
      <br />
      <sub>Backend Developer • Database • DevOps</sub>
      <br />
      <sub>📧 pratyaksh887@gmail.com</sub>
    </td>
    <td align="center">
      <a href="https://github.com/oversized-rythm">
        <img src="https://github.com/oversized-rythm.png" width="100px;" alt="Team Member 2"/>
        <br />
        <sub><b>Neeti Sharma</b></sub>
      </a>
      <br />
      <sub>Frontend Developer • AI Integration</sub>
      <br />
      <sub>📧 member2@example.com</sub>
    </td>
    <td align="center">
      <a href="https://github.com/aavanipachauri-hub">
        <img src="https://github.com/aavanipachauri-hub.png" width="100px;" alt="Team Member 3"/>
        <br />
        <sub><b>Aavani Pachauri</b></sub>
      </a>
      <br />
      <sub>Deployment • Documentation</sub>
      <br />
      <sub>📧 member3@example.com</sub>
    </td>
    <td align="center">
      <a href="https://github.com/Kanishkaverma013">
        <img src="https://github.com/Kanishkaverma013.png" width="100px;" alt="Team Member 4"/>
        <br />
        <sub><b>Kanshika Verma</b></sub>
      </a>
      <br />
      <sub>API Development • Security • Testing</sub>
      <br />
      <sub>📧 member4@example.com</sub>
    </td>
  </tr>
</table>

---

## 📚 Documentation
- Swagger/OpenAPI available on backend run
- (Optional) Add `/docs` links here if you maintain PRD/API docs in-repo

---

## 🤝 Contributing

1. Create feature branch from `develop`
2. Follow coding standards in `CONTRIBUTING.md`
3. Write tests for new features
4. Submit PR with a detailed description
5. Get approval before merging

**Branch naming:** `feature/feature-name`, `bugfix/bug-description`, `docs/update`

---
## 📄 Product Requirements Document (PRD)

Detailed PRD available for this project.  
Please visit the link below for complete understanding:

👉 <a href="https://gist.github.com/Pratyakshgupta887qwert/37385b65cb199f9403fb8a3fb7cf96b1">Link to Look over</a>
---

## 📜 License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE).

---

## 📧 Contact

### Faculty Guide
- **Name:** Ayush Tiwari  
- **Email:** ayush.tiwari@gla.ac.in  

### Team Maintainer
- **Pratyaksh Gupta**
- **Email:** pratyaksh.gupta_cs23@gla.ac.in
- **GitHub:** [@Pratyakshgupta887qwert](https://github.com/Pratyakshgupta887qwert)

---

<div align="center">

**Academic Project | 2026 | GLA UNIVERSITY**

</div>
