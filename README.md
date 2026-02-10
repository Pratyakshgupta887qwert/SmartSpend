<div align="center">

# 💰 SmartSpend

### AI-Powered Receipt-Based Expense Tracker

[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)](https://reactjs.org/)
[![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?logo=dotnet)](https://dotnet.microsoft.com/)
[![SQL Server](https://img.shields.io/badge/SQL_Server-2022-CC2927?logo=microsoftsqlserver)](https://www.microsoft.com/sql-server)
[![Firebase](https://img.shields.io/badge/Firebase-10.x-FFCA28?logo=firebase)](https://firebase.google.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-Enabled-4285F4?logo=google)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**An intelligent expense management platform that digitizes receipts using OCR, automatically categorizes expenses, and provides AI-powered financial insights through natural language queries.**

[Features](#-key-features) • [Getting Started](#-getting-started) • [Team](#-team) • [Documentation](#-documentation)

</div>

---

## 📌 Project Overview

**SmartSpend** is a full-stack expense tracking application built with **ASP.NET Core Web API** and **React** that combines receipt digitization with AI-powered financial analytics.

Unlike traditional expense apps that only scan receipts OR only analyze data, SmartSpend provides a **unified platform** where users can upload receipts, get automatic OCR extraction, intelligent categorization, and ask natural language questions to understand their spending patterns.

> **Project Type:** Group Mini Project (Academic)  
> **Course:** Bachelor of Technology in Computer Science and Engineering  
> **Institution:** GLA University  
> **Semester:** 6th Sem

---

## 🎯 Problem Statement

Modern expense tracking faces critical pain points:
- **Lost physical receipts** leading to incomplete records
- **Manual data entry** is time-consuming and error-prone
- **Existing apps are fragmented** – either do OCR or analytics, not both
- **No natural way to query expense data** or get actionable insights

**SmartSpend solves this** by providing an end-to-end intelligent system that handles everything from receipt upload to AI-powered insights.

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 📸 **Receipt Upload** | Drag-and-drop upload with support for JPG, PNG, PDF. Cloud storage via Firebase |
| 🔍 **OCR Extraction** | Automatic extraction of merchant, amount, date, items using Google Vision API |
| 🎯 **Auto-Categorization** | AI-powered expense categorization (Food, Travel, Utilities, etc.) |
| 📊 **Visual Dashboard** | Interactive charts showing spending trends, category breakdowns, top merchants |
| 🤖 **AI Query Module** | Ask questions in natural language: "How much did I spend on groceries last month?" |
| 💡 **Smart Insights** | Proactive suggestions: "You're overspending on dining by 23%" |
| 📈 **Export Reports** | Generate CSV/PDF reports for tax filing or reimbursement |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────┐
│      React Frontend (Vite)          │
│  Receipt Upload • Dashboard • AI    │
└──────────────┬──────────────────────┘
               │ REST API
┌──────────────▼──────────────────────┐
│     ASP.NET Core Web API            │
│  Controllers • Services • Middleware│
└──┬────────┬────────┬─────────────┬──┘
   │        │        │             │
   ▼        ▼        ▼             ▼
┌─────┐ ┌────────┐ ┌────────┐ ┌────────┐
│ SQL │ │Firebase│ │Gemini  │ │ OCR    │
│Server│ │Storage │ │  API   │ │Service │
└─────┘ └────────┘ └────────┘ └────────┘
```

---

## 🧰 Technology Stack

### Frontend
- React.js (Vite), Tailwind CSS, Axios, React Router, Chart.js

### Backend
- ASP.NET Core 8.0, Entity Framework Core, JWT Auth, Swagger/OpenAPI

### Database & Storage
- SQL Server 2022 (Relational data), Firebase Storage (Receipt images)

### AI & ML
- Google Gemini API (NLP queries), Google Cloud Vision API (OCR), ML Categorization

### DevOps
- Git & GitHub, Docker, CI/CD (GitHub Actions)

---

## 📂 Project Structure

```
SmartSpend/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── components/        # UI components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API services
│   │   └── App.jsx
│   └── package.json
│
├── server/                    # ASP.NET Core Backend
│   ├── SmartSpend.API/
│   │   ├── Controllers/
│   │   ├── Services/
│   │   ├── Models/
│   │   ├── Data/
│   │   └── Program.cs
│   └── SmartSpend.sln
│
├── docs/
│   ├── PRD.md
│   ├── API_DOCUMENTATION.md
│   └── TEAM_CONTRIBUTIONS.md
│
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18+), .NET SDK (8.0+), SQL Server (2019+)
- Firebase Account, Google Cloud Account (for Gemini & OCR APIs)

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Pratyakshgupta887qwert/SmartSpend.git
cd SmartSpend
```

### 2️⃣ Backend Setup
```bash
cd server/SmartSpend.API
dotnet restore
```

**Configure `appsettings.json`:**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=SmartSpendDB;Trusted_Connection=True"
  },
  "JwtSettings": {
    "Secret": "your-secret-key-min-32-chars",
    "ExpiryMinutes": 1440
  },
  "Firebase": {
    "StorageBucket": "your-bucket.appspot.com",
    "ApiKey": "your-firebase-api-key"
  },
  "GeminiAPI": {
    "ApiKey": "your-gemini-api-key"
  }
}
```

**Run migrations & start server:**
```bash
dotnet ef database update
dotnet run
```
API runs on `https://localhost:5001` | Swagger: `https://localhost:5001/swagger`

### 3️⃣ Frontend Setup
```bash
cd client
npm install
```

**Create `.env` file:**
```env
VITE_API_URL=https://localhost:5001/api
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
```

**Start development server:**
```bash
npm run dev
```
Frontend runs on `http://localhost:5173`

---

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| **Authentication** |
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login with credentials |
| GET | `/api/auth/profile` | Get user profile |
| **Receipts** |
| POST | `/api/receipts/upload` | Upload receipt (triggers OCR) |
| GET | `/api/receipts` | Get all receipts |
| DELETE | `/api/receipts/{id}` | Delete receipt |
| **Expenses** |
| GET | `/api/expenses` | Get all expenses (with filters) |
| POST | `/api/expenses` | Create manual expense |
| PUT | `/api/expenses/{id}` | Update expense |
| **AI Queries** |
| POST | `/api/ai/query` | Ask natural language question |
| GET | `/api/ai/insights` | Get AI suggestions |
| **Analytics** |
| GET | `/api/analytics/summary` | Overall spending summary |
| GET | `/api/analytics/by-category` | Category breakdown |
| POST | `/api/analytics/export` | Export data (CSV/PDF) |

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
      <sub> Backend Developer & Database & DevOps </sub>
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
      <sub>Frontend Developer & AI/ML Integration</sub>
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
      <sub>Deployment & Documentation</sub>
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
      <sub>API Development , Security & Testing </sub>
      <br />
      <sub>📧 member4@example.com</sub>
    </td>
  </tr>
</table>

---

## 🔮 Future Enhancements

### Post-MVP Features
- 💰 Budget management with real-time alerts
- 📊 Monthly AI-generated spending reports
- 🔄 Recurring expense detection (subscriptions)
- 📈 Predictive analytics & forecasting
- 👥 Multi-user expense sharing
- 📱 React Native mobile app
- 🏦 Bank account integration (Plaid API)

---

## 🎓 Academic Context

This project demonstrates:

**Technical Skills:**
- ✅ Full-Stack Development (ASP.NET Core + React)
- ✅ AI/ML Integration (Gemini API, OCR)
- ✅ Cloud Services (Firebase, Google Cloud)
- ✅ RESTful API Design & Authentication
- ✅ Database Design & Optimization

**Soft Skills:**
- ✅ Team Collaboration & Git Workflow
- ✅ Agile Project Management
- ✅ Problem Solving & System Design
- ✅ Technical Documentation

---

## 📚 Documentation

> 📘 **Complete Documentation:**  
> - **[Product Requirements Document (PRD)](https://gist.github.com/Pratyakshgupta887qwert/37385b65cb199f9403fb8a3fb7cf96b1)** - Full technical specs

---

## 🤝 Contributing

### For Team Members
1. Create feature branch from `develop`
2. Follow coding standards in [CONTRIBUTING.md](CONTRIBUTING.md)
3. Write tests for new features
4. Submit PR with detailed description
5. Get approval before merging

**Branch Naming:** `feature/feature-name`, `bugfix/bug-description`, `docs/update`

---

## 📜 License

This project is licensed under the **MIT License** - see [LICENSE](LICENSE) for details.

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

## 🙏 Acknowledgments

- **Ayush Tiwari** for project guidance
- **GLA University** for infrastructure
- **Google** for Gemini API & Cloud Vision API
- **Open Source Community** for tools & libraries

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

**Made with ❤️ for smarter spending decisions**

---

### Quick Links

[🚀 Live Demo](#) • [📖 Documentation](https://gist.github.com/Pratyakshgupta887qwert/37385b65cb199f9403fb8a3fb7cf96b1) • [🐛 Issues](https://github.com/Pratyakshgupta887qwert/SmartSpend/issues)

---

**Academic Project | 2026 | GLA UNIVERSITY**

</div>
