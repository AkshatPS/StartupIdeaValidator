# AI-Powered Startup Idea Validator

This is a full-stack web application designed to help entrepreneurs and innovators validate their startup ideas. Users can submit their business concepts, and an AI agent performs a comprehensive analysis, providing a feasibility score and a detailed report covering market fit, competitor analysis, and potential challenges.

**Live Demo:** [https://startalyze.onrender.com](https://startalyze.onrender.com)

---

## 🚀 Key Features

- **Secure User Authentication:** Supports both traditional email/password signup and Google OAuth 2.0 for seamless access.  

- **Idea Submission:** A dedicated form for users to submit and describe their startup ideas.  
- **AI-Powered Analysis:** An asynchronous backend task triggers a Python service to perform in-depth validation.  
- **Real-time Progress Tracking:** A dynamic stepper UI shows the current stage of the analysis.  
- **Comprehensive Reports:** Users can view detailed reports with feasibility scores, SWOT analysis, and actionable feedback.  
- **User Dashboard:** A central hub for users to view and manage all their submitted ideas.  
- **Profile Management:** Users can update their personal details, change their password (for local accounts), and delete their account securely.  

---

## 🛠️ Tech Stack

The project is built with the **MERN stack** and a **Python microservice** for AI tasks.

| Category       | Technology                                    |
| :------------- | :-------------------------------------------- |
| **Frontend**   | React, React Router, Axios                    |
| **Backend**    | Node.js, Express.js                           |
| **AI Service** | Python, Flask                                 |
| **Database**   | MongoDB (with Mongoose)                       |
| **Auth**       | JWT (JSON Web Tokens), Passport.js, Google OAuth |
| **Deployment** | Render (Static Site, Web Service x2)          |

---

## 📂 Project Structure

The project is organized in a monorepo-like structure with three main components:

- `/client`: The React frontend application (Create React App).  
- `/server`: The Node.js/Express backend API, database models, and authentication logic.  
- `/agent`: The Python/Flask microservice for AI-driven idea analysis.  

---

## ⚡ Getting Started

To run this project locally, you will need **Node.js, Python, and MongoDB** installed and running on your machine.

### 1. Clone the Repository
```bash
git clone https://github.com/AkshatPS/StartupIdeaValidator.git
cd StartupIdeaValidator
```
### 2. Setup the Backend Server
```bash
# Navigate to the server directory
cd server

# Install dependencies
npm install

# Create a .env file and add the required environment variables (see below)

# Start the server
npm start
```

### 3. Setup the Python AI Agent

**Refer this repo:** [https://github.com/AkshatPS/StartupValidatorAI](https://github.com/AkshatPS/StartupValidatorAI)

### 4. Setup the Frontend Client
```bash
# Navigate to the client directory from the root
cd client

# Install dependencies
npm install

# Create a .env.development file and add the required environment variables (see below)

# Start the React app
npm start
```

## 🔑 Environment Variables
You need to create .env files for the server and client to store sensitive keys and configuration.

### server/.env
```bash
MONGO_URI=YOUR_MONGODB_CONNECTION_STRING
JWT_SECRET=YOUR_SUPER_SECRET_KEY_FOR_JWT
GOOGLE_CLIENT_ID=YOUR_GOOGLE_OAUTH_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_OAUTH_CLIENT_SECRET
SERVER_URL=http://localhost:5000
CLIENT_URL=http://localhost:3000
FLASK_API_URL=http://127.0.0.1:5000
```
### client/.env.development
```bash
REACT_APP_API_URL=http://localhost:5000
```

## 🌍 Deployment

This application is deployed on Render as three separate services from a single repository:

Static Site: For the React frontend (/client).

Web Service: For the Node.js backend (/server).

Web Service: For the Python AI agent (/agent).

⚙️ Rewrite rules are used on the frontend service to correctly handle client-side routing for the single-page application.