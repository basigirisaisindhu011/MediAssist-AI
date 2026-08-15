# 🏥 MediAssist AI — Smart Healthcare Intelligence Platform

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-success?style=for-the-badge&logo=vercel&logoColor=white)](https://mediassist-ai.vercel.app)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge&logo=github-actions&logoColor=white)](https://github.com/basigirisaisindhu011/MediAssist-AI)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)

> **Live Demo:** [https://mediassist-ai.vercel.app](https://mediassist-ai.vercel.app)

---

## 🌟 Overview

**MediAssist AI** is an end-to-end, AI-powered healthcare assistant and patient record management system. It combines modern web UI, robust Spring Boot backend architecture, and FastAPI microservices for machine learning and natural language report analysis.

---

## 🚀 Live Demo & Deployment

- **Vercel Web App (Live Link):** [https://mediassist-ai.vercel.app](https://mediassist-ai.vercel.app)
- **GitHub Repository:** [https://github.com/basigirisaisindhu011/MediAssist-AI](https://github.com/basigirisaisindhu011/MediAssist-AI)

---

## ✨ Features

- 🤖 **AI Symptom Checker**: Smart diagnostic guidance based on patient-reported symptoms.
- 📊 **Health Risk Evaluator**: Machine learning risk assessment for chronic conditions.
- 📄 **Medical Report Summarizer**: Automatic extraction and summarization of complex lab reports.
- 📅 **Appointment Management**: Seamless scheduling and status tracking for medical visits.
- 📋 **Digital Medical Records**: Secure storage and retrieval of health history and diagnostic files.
- 👤 **Health Profile & Metrics**: Dynamic tracking of vital signs, medical history, and user settings.
- 🌓 **Theme Customization**: Sleek dark and light mode user interfaces.

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 19, Vite, TailwindCSS v4, Lucide Icons, React Router DOM | Modern SPA UI hosted on Vercel |
| **Backend API** | Java Spring Boot 3, Spring Security, JWT Auth, Hibernate/JPA | Core REST API & Business Logic |
| **AI Microservice**| Python FastAPI, Scikit-learn, PyPDF2, Natural Language Processing | Machine Learning & NLP Service |
| **Database** | MySQL 8.0 | Relational Data Storage |
| **Deployment** | Vercel (Frontend), Docker / Docker Compose (Full Stack) | Cloud Hosting & Containerization |

---

## 📁 Repository Structure

```
MediAssist-AI/
├── frontend/             # React 19 + Vite frontend application
│   ├── src/              # React components, pages, contexts, services
│   ├── public/           # Static assets
│   ├── vercel.json       # SPA routing configuration for Vercel
│   └── package.json      # Dependencies and scripts
├── backend/              # Java Spring Boot backend service
│   ├── src/              # Controllers, services, entities, security
│   └── pom.xml           # Maven configuration
├── ai-service/           # Python FastAPI AI microservice
│   ├── app/              # ML risk evaluators, symptom checkers, NLP
│   └── requirements.txt  # Python dependencies
├── vercel.json           # Root Vercel build configuration for monorepo
├── docker-compose.yml    # Full stack container orchestration
└── README.md             # Project documentation
```

---

## ⚡ Deployment Instructions (Vercel)

This repository is optimized for direct, error-free Vercel deployments.

### Automatic Vercel Deployment (Recommended)

1. Push your changes to GitHub:
   ```bash
   git add .
   git commit -m "Configure Vercel deployment and update README"
   git push origin main
   ```
2. Import the repository in [Vercel Dashboard](https://vercel.com/new).
3. Vercel automatically detects the root `vercel.json` and builds the frontend target cleanly!

### Manual Root Directory Setting (Optional Vercel Dashboard Method)
If configuring manually in Vercel settings:
- **Framework Preset**: Vite
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

---

## 💻 Local Development Setup

### Prerequisites
- Node.js 18+ and npm
- Java JDK 17+ (for backend)
- Python 3.10+ (for AI service)
- MySQL 8.0 or Docker

### Running Frontend Locally
```bash
cd frontend
npm install
npm run dev
```
The application will start at `http://localhost:5173`.

### Running Full Stack with Docker
```bash
docker-compose up --build
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.
