# Lost & Found Management System

A web application to help students report and find lost or found items on campus. Built with **React** for the frontend and **Express.js** for the backend, with image uploads, JWT authentication, and personalized item tracking.

---

## Table of Contents

- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Installation](#installation)  
- [Usage](#usage)  
- [Project Structure](#project-structure)  
- [API Endpoints](#api-endpoints)  
- [Screenshots](#screenshots)  
- [Contributing](#contributing)  
- [License](#license)  

---

## Features

- User signup and login with JWT authentication.  
- Report lost or found items with image upload.  
- Browse all lost and found items.  
- Pagination for easier navigation through items.  
- Personalized “My Items” page to view your reports.  
- CORS configuration for smooth deployment on Render.com.  

---

## Tech Stack

**Frontend:**  
- React.js  
- Tailwind CSS  
- Vite.js  

**Backend:**  
- Node.js  
- Express.js  
- Multer (for file uploads)  
- JWT (authentication)  

**Database:**  
- MongoDB / SQLite / Your choice  

---

## Installation

1. Clone the repository:  
git clone https://github.com/architdhiman001/INTERN_Project.git
cd INTERN_Project

2.Install backend dependencies:
cd Backend
npm install

3.Install frontend dependencies:

cd ../Frontend
npm install


##Usage

Run Backend:

cd Backend
npm run dev

Run Frontend:

cd Frontend
npm run dev

Project Structure
INTERN_Project/
├─ Backend/
│  ├─ server.js
│  └─ routes/
├─ Frontend/
│  ├─ src/
│  │  ├─ Pages/
│  │  │  ├─ Login.jsx
│  │  │  ├─ Signup.jsx
│  │  │  ├─ ReportLost.jsx
│  │  │  ├─ ReportFound.jsx
│  │  │  ├─ LostItems.jsx
│  │  │  ├─ FoundItems.jsx
│  │  │  ├─ MyItems.jsx
│  │  │  └─ Home.jsx
│  └─ package.json
└─ README.md

API Endpoints

Auth:

POST /api/auth/signup – Register a new user

POST /api/auth/login – Login

Reports:

POST /api/uploadLostReport – Report a lost item

POST /api/uploadFoundReport – Report a found item

GET /api/lostItems – Get all lost items

GET /api/foundItems – Get all found items

GET /api/myItems – Get items reported by the logged-in user

JWT token required for protected endpoints.
