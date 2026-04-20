
# 💊 CareSync: Automated Medication Reminder System

![Python](https://img.shields.io/badge/Python-3.10-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688.svg)
![React](https://img.shields.io/badge/React-18.2-61DAFB.svg)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1.svg)
![Twilio](https://img.shields.io/badge/Twilio-WhatsApp_API-F22F46.svg)

CareSync is a decoupled, cloud-based healthcare platform designed to solve the global crisis of medication non-adherence among the elderly. 

By shifting the complex scheduling tasks entirely to the caretaker via a React web dashboard, the patient is freed from any technical burden. The Python backend autonomously monitors the time, dynamically translates medical instructions into the patient's native language, and delivers zero-friction alerts directly to their WhatsApp.

## ✨ Key Features
* **Zero-Friction Delivery:** Patients do not need to download any apps. Alerts arrive via WhatsApp, a platform they already use and trust.
* **Native Language Translation:** Integrates `deep-translator` to automatically localize English medical instructions into regional languages (e.g., Hindi, Telugu) based on the patient's profile.
* **Autonomous Engine:** Utilizes `APScheduler` in Python to run a continuous background thread that polls the database and dispatches alerts without interrupting the main web server.
* **Cloud Media Hosting:** Integrates Cloudinary to serve pill images dynamically, keeping the database lightweight.
* **Secure Authentication:** Utilizes Brcypt password hashing to ensure caretaker data remains secure.

---

## 🛠️ Technology Stack
* **Frontend:** React.js, Tailwind CSS
* **Backend:** Python, FastAPI, Uvicorn
* **Database:** MySQL, SQLAlchemy (ORM)
* **Automation:** APScheduler
* **External APIs:** Twilio (Messaging), Cloudinary (CDN), Deep-Translator

---

## 🚀 Getting Started

**⚠️ IMPORTANT NOTE:** This project relies on external Cloud APIs to function. To run this project locally, you cannot use my API keys. You must create your own free accounts for Twilio and Cloudinary and authorize your own phone numbers.

### Prerequisites
Before you begin, ensure you have the following installed:
* Python 3.10+
* Node.js (v16+)
* MySQL Server
* A free [Twilio Account](https://www.twilio.com/) (Setup the WhatsApp Sandbox)
* A free [Cloudinary Account](https://cloudinary.com/)

### 1. Database Setup
1. Open your MySQL terminal or Workbench.
2. Create a new database for the project:
   ```sql
   CREATE DATABASE caresync_db;
````

### 2\. Backend Setup (FastAPI)

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Create and activate a virtual environment:
    ```bash
    python -m venv venv
    # On Windows:
    venv\Scripts\activate
    # On macOS/Linux:
    source venv/bin/activate
    ```
3.  Install the required Python dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  **Environment Variables:** Create a `.env` file in the `backend` root folder and add your specific credentials:
    ```env
    # Database Configuration
    DATABASE_URL=mysql+pymysql://root:YOUR_MYSQL_PASSWORD@localhost:3306/caresync_db

    # Twilio Configuration
    TWILIO_ACCOUNT_SID=your_twilio_account_sid
    TWILIO_AUTH_TOKEN=your_twilio_auth_token
    TWILIO_WHATSAPP_NUMBER=your_twilio_sandbox_number

    # Cloudinary Configuration
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
    ```
5.  Run the backend server:
    ```bash
    uvicorn main:app --reload
    ```

### 3\. Frontend Setup (React)

1.  Open a new terminal instance and navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install Node dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm start
    ```

-----

## 📱 Using the Twilio WhatsApp Sandbox

Because this project uses the Twilio Sandbox for testing, **patients must "opt-in"** before the Python engine can send them a message.

1.  Go to your Twilio Console -\> Messaging -\> Try it Out -\> Send a WhatsApp message.
2.  You will see a sandbox number and a join code (e.g., `join massive-leaf`).
3.  Send that exact code from your personal WhatsApp to the Twilio number to authorize your device to receive CareSync alerts.

-----

## 🔮 Future Scope

  * **AI Prescription Scanner (OCR):** Planned integration to allow caretakers to upload physical prescriptions to auto-fill the database schedules.
  * **Two-Way Audio Replies:** Expanding the WhatsApp bot to accept native-language voice notes to confirm pill consumption and update the dashboard in real-time.

-----

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](https://www.google.com/search?q=LICENSE) file for details.

## 🤝 Developed By

**Majeti Nagasai Rishi** *Computer Science & Engineering | SRM University AP* [LinkedIn Profile](https://www.google.com/search?q=https://www.linkedin.com/in/rishi-majeti-a3042733b/) | [GitHub Profile](https://www.google.com/search?q=https://github.com/rishi-22-7)

```
```
