<div align="center">
  <h1>💊 CareSync</h1>
  <h3>Automated Multi-Lingual WhatsApp Medication Reminder Platform</h3>

  <p align="center">
    <a href="https://medication-caresync.vercel.app" target="_blank">
      <img src="https://img.shields.io/badge/Live%20Demo-Vercel-success?style=for-the-badge&logo=vercel" alt="Live Demo" />
    </a>
    <a href="https://caresync-agji.onrender.com/docs" target="_blank">
      <img src="https://img.shields.io/badge/API%20Docs-Swagger-blue?style=for-the-badge&logo=swagger" alt="API Docs" />
    </a>
    <a href="https://github.com/rishi-22-7/CareSync" target="_blank">
      <img src="https://img.shields.io/badge/Repository-GitHub-181717?style=for-the-badge&logo=github" alt="GitHub Repo" />
    </a>
  </p>

  <p align="center">
    <strong>Bridging caretakers and patients with precision scheduling, real-time Cloudinary prescription uploads, automated translations, and instant Twilio WhatsApp delivery.</strong>
  </p>
  
  <hr />
</div>

## 🌐 Live Production Deployments
* **Frontend client (Vercel):** [https://medication-caresync.vercel.app](https://medication-caresync.vercel.app)
* **Backend API (Render):** [https://caresync-agji.onrender.com](https://caresync-agji.onrender.com)
* **API Documentation:** [https://caresync-agji.onrender.com/docs](https://caresync-agji.onrender.com/docs)

---

## ✨ Features Highlight

<table>
  <tr>
    <td width="50%">
      <h4>🧑‍⚕️ Caretaker Dashboard (Admin)</h4>
      <ul>
        <li>Secure Caretaker registration and credentials management.</li>
        <li>Interactive glassmorphic control panel to register wards/patients.</li>
        <li>Full CRUD control over medications and scheduling slots.</li>
        <li>Real-time search filters by patient name or phone number.</li>
        <li>Modern light/dark mode UI styling with theme persistence.</li>
      </ul>
    </td>
    <td width="50%">
      <h4>💬 Multi-Lingual WhatsApp Alerts</h4>
      <ul>
        <li>One-click manual notification triggers + Background scheduler.</li>
        <li>Automated translations into regional languages: **English, Hindi, Telugu, Tamil, Malayalam, and Kannada**.</li>
        <li>Outbound messages contain high-res Cloudinary prescription attachments.</li>
        <li>Sandbox reviewer opt-in panel for rapid teacher/evaluator testing.</li>
      </ul>
    </td>
  </tr>
</table>

---

## 🛠️ High-Tech Stack

<div align="center">
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Twilio-F22F46?style=for-the-badge&logo=twilio&logoColor=white" alt="Twilio" />
  <img src="https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" alt="Cloudinary" />
</div>

---

## 📂 Project Architecture

```
CareSync_Project/
├── backend/
│   ├── app/
│   │   ├── core/
│   │   │   ├── database.py       # Supabase PostgreSQL engine configuration
│   │   │   └── security.py       # Caretaker bcrypt verification routines
│   │   ├── models/
│   │   │   ├── admin.py          # Caretaker database model schema
│   │   │   ├── patient.py        # Patient (ward) database model schema
│   │   │   └── medication.py     # Scheduled medication database schema
│   │   ├── routers/
│   │   │   ├── auth.py           # Admin authentication API controller
│   │   │   ├── patients.py       # Patients CRUD API controller
│   │   │   ├── medications.py    # Medications CRUD & triggers API controller
│   │   │   └── uploads.py        # Cloudinary direct upload route
│   │   ├── services/
│   │   │   ├── medication_service.py   # Translation helper logic
│   │   │   └── notification_service.py # Twilio API caller client
│   │   └── main.py               # FastAPI bootstrapper & BackgroundScheduler
│   ├── requirements.txt          # Python micro-service requirements
│   └── create_tables.py          # Supabase DB schema initialization script
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/               # Modular UI atoms (Buttons, dialogs, banners)
│   │   │   ├── Navbar.jsx        # Premium header + Theme toggler
│   │   │   └── PatientCard.jsx   # Ward manager action cards
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx   # Interactive glassmorphic welcome page
│   │   │   ├── LoginPage.jsx     # Caretaker access gateway
│   │   │   └── DashboardPage.jsx # Core administrative console
│   │   ├── services/
│   │   │   └── api.js            # Axios endpoint client configurations
│   │   └── index.css             # Main stylesheet & Tailwind custom colors
│   ├── vercel.json               # SPA router redirection configurations
│   └── package.json              # Client-side node configurations
└── start.bat                     # Single double-click workspace launcher
```

---

## 📲 Testing the Outbound WhatsApp Sandbox Reminders

> [!IMPORTANT]
> Because CareSync is running in a sandbox developer account, WhatsApp requires you to explicitly opt-in to receive medication reminder messages on your phone:
>
> 1. Visit the [Live Web Application](https://medication-caresync.vercel.app).
> 2. Inside the Dashboard, locate the green banner: **"Sandbox Reviewer Opt-in Mode"**.
> 3. Click **📲 Activate on WhatsApp**. 
> 4. This automatically opens WhatsApp with Twilio Sandbox (`+1 415 523 8886`) and pre-fills the opt-in keyword message (e.g. `join frog-explain`). 
> 5. Click **Send** in WhatsApp.
> 6. Return to CareSync web dashboard, register your phone number, schedule a medicine, and click **Trigger WhatsApp**. You will receive your translated reminder with the prescription image immediately!

---

## ⚙️ Service Integrations and Config

<details>
<summary><b>1. Supabase relational database setup</b></summary>

1. Create a project on [supabase.com](https://supabase.com).
2. Copy the Connection URI string under **Settings → Database → Connection String → URI**.
3. Replace the placeholder password with your chosen database password and prepend `postgresql+psycopg2://` instead of `postgresql://`.
</details>

<details>
<summary><b>2. Twilio WhatsApp sandbox config</b></summary>

1. Sign up for a trial account on [twilio.com](https://twilio.com).
2. Grab the `Account SID` and `Auth Token` from your dashboard.
3. Access **Messaging → Try it out → Send a WhatsApp Message** to obtain the Shared Sandbox number and keyword (e.g. `frog-explain`).
</details>

<details>
<summary><b>3. Cloudinary media storage setup</b></summary>

1. Create a free account on [cloudinary.com](https://cloudinary.com).
2. Retrieve the `Cloud Name`, `API Key`, and `API Secret` from your dashboard credentials console.
</details>

---

## 🚀 Local Startup and Run Guide

### 📦 Backend Setup
1. Open terminal in the `backend/` directory.
2. Initialize virtual environment and install packages:
   ```bash
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```
3. Initialize Supabase PostgreSQL database tables:
   ```bash
   python create_tables.py
   ```
4. Fire up the FastAPI micro-service:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

### 💻 Frontend Setup
1. Open terminal in the `frontend/` directory.
2. Install npm dependencies and boot the Vite server:
   ```bash
   npm install
   npm run dev
   ```

### ⚡ Easy Launcher
Double-click the `start.bat` script in the root directory. It runs the backend database migrations, initiates uvicorn, starts the React SPA client, and loads the interface in your browser automatically!

---

## 🔒 Production Environment Configuration

Ensure your live servers are loaded with the following environment variables:

### FastAPI Web App (Render)
```env
DATABASE_URL=postgresql+psycopg2://[user]:[password]@[host]:5432/postgres
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
TWILIO_SANDBOX_KEYWORD=your_keyword
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
CORS_ALLOWED_ORIGINS=https://medication-caresync.vercel.app
TZ_OFFSET=5.5
```

### React Client (Vercel)
```env
VITE_API_URL=https://caresync-agji.onrender.com
```