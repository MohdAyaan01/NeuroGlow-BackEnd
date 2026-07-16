# 🌌 NeuroGlow AI SaaS - Monorepo

Welcome to the **NeuroGlow AI SaaS** codebase. This repository contains the complete full-stack implementation of the AI SaaS Platform, including a modern React frontend and a robust Node/Express backend.

---

## 📂 Repository Structure

The workspace is organized into two main directories:

*   **`client/`**: The frontend user interface built with React 19, Vite, Tailwind CSS v4, and Redux Toolkit.
    *   👉 Detailed instructions and screenshots are inside the [Client README](./client/README.md).
*   **`server/`**: The backend REST API server built with Node.js, Express, MongoDB (Mongoose), and Cloudinary.
    *   🧠 Incorporates AI APIs for image in-painting, background extraction, and generative LLMs.

---

## ⚡ Quick Start

To run the entire stack locally, follow these steps:

### 1. Prerequisites
Ensure you have:
- **Node.js** (v18+)
- **MongoDB** database instance
- Credentials/API keys for **Google Gemini**, **Cloudinary**, and **Razorpay**

### 2. Backend Installation & Run
```bash
cd server
npm install
# Configure your server/.env file
npm run dev
```

### 3. Frontend Installation & Run
```bash
cd client
npm install
# Configure your client/.env file
npm run dev
```

---

## 📸 Screenshots Gallery

Here are some glimpses of the application:

*   **Landing Page**: [./client/public/One.png](./client/public/One.png)
*   **Dashboard**: [./client/public/Two.png](./client/public/Two.png)
*   **AI Tools Hub**: [./client/public/Three.png](./client/public/Three.png)
*   **Article Writer**: [./client/public/Four.png](./client/public/Four.png)
*   **Background Eraser**: [./client/public/Five.png](./client/public/Five.png)
*   **Object Removal**: [./client/public/Six.png](./client/public/Six.png)
*   **Community Feed**: [./client/public/Seven.png](./client/public/Seven.png)
*   **Pricing Plans**: [./client/public/Eight.png](./client/public/Eight.png)
*   **Auth Pages**: [./client/public/Nine.png](./client/public/Nine.png)

For a detailed visual guide and full documentation, please visit the [**Client README**](./client/README.md).

---

## 🔒 License

This repository is licensed under the ISC License. See the [LICENSE](./LICENSE) file for more information.
