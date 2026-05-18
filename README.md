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
    *   WhatsApp reminders arrive with high-resolution image attachments so patients know exactly *which* tablet to take.
*   **📲 Sandbox Tester Opt-in Mode:**
    *   A beautifully animated, dismissible reviewer banner on the dashboard.
    *   Features a **"One-Click WhatsApp Activation"** link which auto-opens WhatsApp and pre-fills the Twilio join message, making reviewer/teacher evaluations seamless.
*   **🔒 Robust MVC Architecture:**
    *   Strict separation of concerns between client UI logic, FastAPI routers, and backend database connections.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React (Vite) | Responsive SPA Framework |
| **Styling** | Tailwind CSS | Sleek Glassmorphism & Themes |
| **Animations** | Framer Motion | Smooth banners, slideouts, & page transition micro-animations |
| **Backend** | FastAPI (Python 3) | Asynchronous RESTful API Engine |
| **Database** | PostgreSQL (Supabase) | Scalable Relational Storage |
| **API ORM** | SQLAlchemy | Python Object Relational Mapper |
| **Messaging** | Twilio WhatsApp API | Outbound Gateway |
| **Media Host** | Cloudinary | Secure Medication Image Hosting |

---

## 📂 Project Architecture & Structure

```filepath
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

> [!IMPORTANT]
> **PLEASE READ THIS BEFORE TESTING THE LIVE DEPLOYED LINK:**
> 
> Because this application runs in development/testing sandbox mode, the Twilio WhatsApp API uses the **Twilio Sandbox**. By default, WhatsApp **prohibits** unsolicited automated testing messages to numbers that have not explicitly opted in.
> 
> **How to Receive Reminders on Your Personal WhatsApp:**
> 1. Log into the CareSync Web App.
> 2. On the top of the **Dashboard**, you will see a green banner labeled **"Sandbox Reviewer Opt-in Mode"**.
> 3. Click the **📲 Activate on WhatsApp** button.
> 4. This will automatically open WhatsApp on your phone or browser, starting a chat with `+1 415 523 8886` and pre-filling the message with: **`join frog-explain`**.
> 5. Click **Send** in WhatsApp.
> 6. Return to the CareSync website, register your phone number (e.g. `+91XXXXXXXXXX`) as a patient, schedule a medication, and click **Trigger WhatsApp**. It will land instantly on your phone with the visual prescription!

---

## ⚙️ Local Installation & Configuration

### Prerequisites
*   Python 3.10+
*   Node.js (v18+)
*   Supabase PostgreSQL DB URL
*   Twilio Account (Free Sandbox credentials)
*   Cloudinary Account (Free media cloud name/keys)

---

### Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Create and activate a virtual environment:
    ```bash
    # Windows Powershell/CMD
    python -m venv venv
    venv\Scripts\activate
    ```
3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Configure your local environment variables. Create a `.env` file in the `backend/` directory:
    ```env
    DATABASE_URL=postgresql+psycopg2://postgres:your-supabase-db-url
    TWILIO_ACCOUNT_SID=your_twilio_sid
    TWILIO_AUTH_TOKEN=your_twilio_auth_token
    TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
    TWILIO_SANDBOX_KEYWORD=frog-explain
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_key
    CLOUDINARY_API_SECRET=your_cloudinary_secret
    ```
5.  Start the FastAPI server:
    ```bash
    uvicorn app.main:app --reload
    ```
    *The API will start running locally at `http://127.0.0.1:8000`.*

---

### Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd ../frontend
    ```
2.  Install packages:
    ```bash
    npm install
    ```
3.  Ensure the API client points to your local backend (`http://127.0.0.1:8000`) inside `frontend/src/services/api.js`.
4.  Start the Vite dev server:
    ```bash
    npm run dev
    ```
    *The web application will open locally at `http://localhost:5173`.*

---

## 🚀 Easy Double-Click Execution
For rapid testing, you can execute the `start.bat` script located in the project's root directory:
```bash
# Simply double-click the start.bat file or run it in CMD:
start.bat
```
This will automatically launch the backend virtual environment, start the FastAPI uvicorn daemon, download/compile Vite dependencies, and spin up the frontend browser server simultaneously!

---

## 🔮 Future Enhancements
*   **⏰ Automatic Cron Scheduler:** Integrate celery/cron tasks on the server to automatically send morning, afternoon, evening, and night triggers daily without requiring manual caretaker triggers.
*   **📊 Patient Adherence Reports:** Interactive charts showing if wards logged medication intake by replying "YES" on WhatsApp.
*   **📞 Emergency Call Trigger:** Integrate Twilio Voice to auto-call the patient or caretaker if a high-priority medication is missed twice.
