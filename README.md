# Full-Stack Automated Email Scheduler

A production-ready, full-stack email scheduling application built with **React**, **Node.js**, **Express**, and **PostgreSQL**, featuring bulk CSV upload capabilities and an automated background dispatch worker.

## ?? Features
- **Dashboard & Analytics**: Live tracking of total, scheduled, and sent email metrics.
- **Single & Bulk Scheduling**: Schedule individual emails or upload CSV files for bulk scheduling campaigns.
- **Persistent Database Storage**: All scheduled jobs are safely persisted in a PostgreSQL database.
- **Automated Background Worker**: A built-in background task runner polls the database every 10 seconds, dispatches due emails automatically, and updates statuses live.
- **Responsive UI**: Built with React and Vite for a fast, modern user experience.

---

## ??? Tech Stack
- **Frontend**: React, Vite, Lucide Icons, Modern CSS/Tailwind
- **Backend**: Node.js, Express, pg (PostgreSQL client)
- **Database**: PostgreSQL (scheduler_db)

---

## ?? Project Setup & Installation

### Prerequisites
Make sure you have **Node.js** and **PostgreSQL** installed on your machine.

### 1. Clone the Repository
\\\ash
git clone https://github.com/your-username/reachinbox-scheduler.git
cd reachinbox-scheduler
\\\

### 2. Database Setup
Ensure your local PostgreSQL instance is running, then create a database named scheduler_db:
\\\sql
CREATE DATABASE scheduler_db;
\\\
*(Note: The backend automatically creates the required emails table on startup).*

### 3. Backend Setup
Navigate to the backend folder, install dependencies, and start the server:
\\\ash
cd backend
npm install
node index.js
\\\
*(The backend server will run on http://localhost:4000)*

### 4. Frontend Setup
Open a new terminal, navigate to the frontend folder, install dependencies, and start the development server:
\\\ash
cd frontend
npm run dev
\\\
*(The frontend will run on http://localhost:5178 or similar Vite port).*

---

## ?? How It Works
1. **Schedule**: Use the frontend dashboard or CSV bulk upload to send scheduling requests to POST /api/schedule.
2. **Persist**: The backend inserts records into the PostgreSQL emails table with a 'Scheduled' status.
3. **Dispatch**: The background worker periodically scans for due items (scheduled_at <= NOW()), processes them, and transitions their status to 'Sent'.
