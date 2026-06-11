# 💊 CareSync — Automated Multi-Lingual WhatsApp Medication Reminder

CareSync is a premium, web-based healthcare assistant application designed to bridge the gap between caretakers and patients (wards). The platform empowers caretakers to register wards, schedule precise medication schedules (morning, afternoon, evening, night), translate reminder messages automatically into multiple regional languages, and trigger automated WhatsApp notifications containing visual prescription images, clear dosage instructions, and timeslot highlights directly to the patient's phone.

---

## ✨ Core Features

*   **🧑‍⚕️ Caretaker Dashboard (Admin Panel):**
    *   Register and manage ward profiles securely.
    *   Real-time status tracking of all registered wards and active scheduled medication slots.
    *   Dynamic light/dark mode theme toggling for an elegant, premium look app-wide.
    *   Clean search bar to filter patient logs by name or contact number.
*   **💬 Automated Multi-Lingual WhatsApp Reminders:**
    *   One-click, real-time trigger of reminders to WhatsApp.
    *   Automatic translation of reminder bodies into **English, Hindi, Telugu, Tamil, Kannada, and Malayalam** to respect patients' native preferences.
*   **🖼️ Cloudinary Visual Prescriptions:**
    *   Upload, compress, and link prescription/medicine images securely.
    *   WhatsApp reminders arrive with high-resolution image attachments so patients know exactly _which_ tablet to take.
*   **📲 Sandbox Tester Opt-in Mode:**
    *   A beautifully animated, dismissible reviewer banner on the dashboard.
    *   Features a **"One-Click WhatsApp Activation"** link which auto-opens WhatsApp and pre-fills the Twilio join message, making reviewer/teacher evaluations seamless.
*   **🔒 Robust MVC Architecture:**
    *   Strict separation of concerns between client UI logic, FastAPI routers, and backend database connections.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| --- | --- | --- |
| **Frontend** | React (Vite) | Responsive SPA Framework |
| **Styling** | Tailwind CSS | Sleek Glassmorphism & Themes |
| **Animations** | Framer Motion | Smooth banners, slideouts, & page transition micro-animations |
| **Backend** | FastAPI (Python 3) | Asynchronous RESTful API Engine |
| **Database** | PostgreSQL (Supabase) | Scalable Relational Storage |
| **API ORM** | SQLAlchemy | Python Object Relational Mapper |
| **Messaging** | Twilio WhatsApp API | Outbound Notification Gateway |
| **Media Host** | Cloudinary | Secure Medication Image Hosting |

---

## 📂 Project Architecture & Structure

```
CareSync_Project/
├── backend/
│   ├── app/
│   │   ├── core/
│   │   │   ├── database.py       # Supabase PostgreSQL engine & connection pools
│   │   │   └── security.py       # Password hashing & validation utilities
│   │   ├── models/
│   │   │   ├── admin.py          # Caretaker database model
│   │   │   ├── patient.py        # Ward database model
│   │   │   └── medication.py     # Scheduled medication database model
│   │   ├── routers/
│   │   │   ├── auth.py           # Login, registration, & password router
│   │   │   ├── patients.py       # CRUD router for wards
│   │   │   ├── medications.py    # CRUD router for medication logs & triggers
│   │   │   └── uploads.py        # Cloudinary prescription upload handler
│   │   ├── services/
│   │   │   ├── medication_service.py # Core translation & scheduler utility
│   │   │   └── notification_service.py # Twilio WhatsApp messaging client
│   │   └── main.py               # FastAPI gateway & CORSMiddleware
│   ├── .env                      # Secure backend credentials (ignored by Git)
│   └── requirements.txt          # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/               # Button, EmptyState, ConfirmDialog UI atoms
│   │   │   ├── Navbar.jsx        # Premium header with theme toggle
│   │   │   ├── PatientCard.jsx   # Interactive ward overview card
│   │   │   └── MedModal.jsx      # Medication scheduler manager popup
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx   # Eye-catching responsive home page
│   │   │   ├── LoginPage.jsx     # Caretaker authentication screen
│   │   │   ├── DashboardPage.jsx # Core administrative control panel
│   │   │   ├── ManagePatientPage.jsx # Individual ward log manager
│   │   │   └── ProfilePage.jsx   # Caretaker account & password settings
│   │   ├── services/
│   │   │   └── api.js            # Axios client, config & CRUD endpoints
│   │   └── index.css             # Root stylesheet & CSS custom design tokens
│   ├── index.html                # Entry HTML document
│   └── package.json              # Frontend modules and scripts
└── start.bat                     # Double-click launcher to run both servers locally
```

---

## 🚀 Live Deployment & Testing Notes

> \[!IMPORTANT\]  
> **PLEASE READ THIS BEFORE TESTING THE LIVE DEPLOYED LINK:**
> 
> Because this application runs in development/testing sandbox mode, the Twilio WhatsApp API uses the **Twilio Sandbox**. By default, WhatsApp **prohibits** unsolicited automated testing messages to numbers that have not explicitly opted in.
> 
> **How to Receive Reminders on Your Personal WhatsApp:**
> 
> 1.  Log into the CareSync Web App.
> 2.  On the top of the **Dashboard**, you will see a green banner labeled **"Sandbox Reviewer Opt-in Mode"**.
> 3.  Click the **📲 Activate on WhatsApp** button.
> 4.  This will automatically open WhatsApp on your phone or browser, starting a chat with `+1 415 523 8886` and pre-filling the message with: `**join frog-explain**`. (Or your custom sandbox keyword).
> 5.  Click **Send** in WhatsApp.
> 6.  Return to the CareSync website, register your phone number (e.g. `+91XXXXXXXXXX`) as a patient, schedule a medication, and click **Trigger WhatsApp**. It will land instantly on your phone with the visual prescription!

---

## ⚙️ Detailed Third-Party Service Setup

To run this project, you need credentials from **Supabase (Database)**, **Twilio (WhatsApp SMS)**, and **Cloudinary (Media Hosting)**. Follow the detailed steps below to configure them:

### 1\. Supabase (PostgreSQL Database Setup)

Supabase provides the hosted PostgreSQL database where patient, caretaker, and medication logs are stored.

1.  Go to [supabase.com](https://supabase.com) and click **Sign Up** (or log in with GitHub).
2.  Click **New Project** ➡️ Select your organization.
3.  Name your project `CareSync`, enter a secure database password, and choose a region nearest to you.
4.  Once the project spins up (takes 1-2 minutes), navigate to the **Project Settings** (gear icon) in the left sidebar.
5.  Click on **Database** under settings.
6.  Scroll down to the **Connection String** section and select the **URI** tab.
7.  Copy the connection string. It will look like this:
8.  _Important:_ Since SQLAlchemy uses `psycopg2`, add `+psycopg2` after `postgresql` and replace `[your-password]` with the database password you chose in step 3. The final string for your `.env` should look like:

---

### 2\. Twilio (WhatsApp API Gateway Setup)

Twilio handles the automated outbound WhatsApp medication reminder messages.

1.  Go to [twilio.com](https://www.twilio.com) and sign up for a free trial account.
2.  Once logged in and inside your Twilio Console home page, locate your credentials in the **Account Info** dashboard:
    *   **Account SID**: Copy this string (starts with `AC...`).
    *   **Auth Token**: Click "Show" and copy this token.
3.  In the left navigation sidebar of your Twilio console, navigate to:  
    **Messaging** ➡️ **Try it out** ➡️ **Send a WhatsApp Message**.
4.  You will see your shared Sandbox Number (typically `+1 415 523 8886`) and a unique keyword (e.g. `join standard-choice` or similar).
5.  Save these values to your backend `.env` file:

---

### 3\. Cloudinary (Prescription Image Storage Setup)

Cloudinary is used to host prescription images uploaded by caretakers, generating optimized HTTPS delivery URLs for WhatsApp.

1.  Go to [cloudinary.com](https://cloudinary.com) and sign up for a free account.
2.  Upon logging in, you will be redirected to your **Cloudinary Dashboard**.
3.  In the top section of your dashboard, locate the **Product Environment Credentials**:
    *   **Cloud Name** (e.g. `dvcafocq0`)
    *   **API Key** (e.g. `212999676874887`)
    *   **API Secret** (e.g. `JcfQvPdc8t57qw3DX9GKneMId1A`)
4.  Copy these three values and add them to your backend `.env` file:

---

## ⚙️ Local Installation & Configuration

### Backend Setup

1.  Navigate to the backend directory:
2.  Create and activate a virtual environment:
3.  Install dependencies:
4.  Create your backend `.env` file in the `backend/` directory using the credentials acquired in the **Detailed Setup** steps above:
5.  **Initialize Database Tables**:  
    CareSync includes an automated schema setup script. To create your database tables (`admins`, `patients`, `medications`) inside your Supabase instance, simply run:
6.  Start the FastAPI server:_The API will start running locally at_ `_http://127.0.0.1:8000_`_._

---

### Frontend Setup

1.  Navigate to the frontend directory:
2.  Install packages:
3.  Ensure the API client points to your local backend (`http://127.0.0.1:8000`) inside `frontend/src/services/api.js`.
4.  Start the Vite dev server:_The web application will open locally at_ `_http://localhost:5173_`_._

---

## 🚀 Easy Double-Click Execution

For rapid testing, you can execute the `start.bat` script located in the project's root directory:

```
# Simply double-click the start.bat file or run it in CMD:
start.bat
```

This will automatically launch the backend virtual environment, start the FastAPI uvicorn daemon, download/compile Vite dependencies, and spin up the frontend browser server simultaneously!

---

## 🔮 Future Enhancements

*   **⏰ Automatic Cron Scheduler:** Integrate celery/cron tasks on the server to automatically send morning, afternoon, evening, and night triggers daily without requiring manual caretaker triggers.
*   **📊 Patient Adherence Reports:** Interactive charts showing if wards logged medication intake by replying "YES" on WhatsApp.
*   **📞 Emergency Call Trigger:** Integrate Twilio Voice to auto-call the patient or caretaker if a high-priority medication is missed twice.

```
npm run dev
```

```
npm install
```

```
cd ../frontend
```

```
uvicorn app.main:app --reload
```

```
python create_tables.py
```

```
DATABASE_URL=postgresql+psycopg2://postgres.[project-ref]:password@aws-0-ap-south-1.pooler.supabase.com:5432/postgres
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
TWILIO_SANDBOX_KEYWORD=frog-explain
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

```
pip install -r requirements.txt
```

```
# Windows Powershell/CMD
python -m venv venv
venv\Scripts\activate
```

```
cd backend
```

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

```
TWILIO_ACCOUNT_SID=your_copied_account_sid
TWILIO_AUTH_TOKEN=your_copied_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
TWILIO_SANDBOX_KEYWORD=your-sandbox-keyword (e.g. standard-choice)
```

```
DATABASE_URL=postgresql+psycopg2://postgres.[your-project-ref]:yourpassword@aws-0-ap-south-1.pooler.supabase.com:5432/postgres
```

```
postgresql://postgres.[your-project-ref]:[your-password]@aws-0-ap-south-1.pooler.supabase.com:5432/postgres
```