# Family Account System - Architecture & Data Flow Diagram

## System Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────┐
│                    HEALTH-TECH PROTOTYPE SYSTEM                    │
└────────────────────────────────────────────────────────────────────┘

┌─────────────────────────┐         ┌──────────────────────────────┐
│   FRONTEND (React)      │         │   BACKEND (Spring Boot 3.2)  │
│   Port: 5173            │         │   Port: 8080                 │
├─────────────────────────┤         ├──────────────────────────────┤
│                         │         │                              │
│ 1. Login.tsx            │         │ Controllers:                 │
│    - Phone OTP          │         │ • AccountController          │
│    - Adhar Verify       │         │ • DoctorDetailsController    │
│    - API: /accounts/    │◄───────►│ • AppointmentController      │
│      login              │ HTTP    │ • SeedController             │
│                         │         │ • MediatorController         │
│ 2. PatientSelector.tsx  │         │ • PatientController          │
│    - List Patients      │         │                              │
│    - Add New (max 5)    │         │ Repositories:                │
│    - Select & Store     │         │ • AccountRepository          │
│    - API: /accounts/    │         │ • PatientRepository          │
│      {id}/patients      │         │ • DoctorRepository           │
│                         │         │ • AppointmentRepository      │
│ 3. Booking.tsx          │         │                              │
│    - Selected Patient   │         │ Services:                    │
│    - Doctor Search      │         │ • QueueService               │
│    - Date/Time Select   │         │ • FinanceService             │
│                         │         │ • PatientService             │
│ 4. AppointmentConfirmation.tsx    │ • AppointmentService         │
│    - Patient Name/Age   │         │                              │
│    - Doctor Details     │         │ Entities (JPA):              │
│    - Clinic Address     │         │ • Account (ID, Phone)        │
│    - Wheelchair Access  │         │ • Patient (ID, Account_FK)   │
│    - ETA Countdown      │         │ • Doctor (ID, Name, ...)     │
│    - API: /doctor/{id}/ │         │ • Appointment (ID, ...)      │
│      clinic-details     │         │ • FinanceLedger (ID, ...)    │
│                         │         │ • LiveQueue (ID, ...)        │
│ 5. Router & Routes      │         │ • LiveQueueEntry (ID, ...)   │
│    (14 total paths)     │         │                              │
│                         │         │                              │
└─────────────────────────┘         └──────────────────────────────┘
        │                                    │
        │                                    │
        └────────────────────────────────────┘
                   CORS Enabled
              (localhost:5173/5174/5175)
                        │
                        ▼
        ┌──────────────────────────────┐
        │   H2 In-Memory Database      │
        │   jdbc:h2:mem:testdb         │
        ├──────────────────────────────┤
        │ Tables:                      │
        │ • ACCOUNT                    │
        │ • PATIENT (FK: account_id)   │
        │ • DOCTOR                     │
        │ • APPOINTMENT                │
        │ • FINANCE_LEDGER             │
        │ • LIVE_QUEUE                 │
        │ • LIVE_QUEUE_ENTRY           │
        │ • ACTIVE_TIMER               │
        │ • VITALS_LOG                 │
        │ • APPT_HISTORY               │
        └──────────────────────────────┘
```

---

## Data Flow: User Login to Appointment Confirmation

```
┌──────────────┐
│  User Home   │
│ (localhost  │
│  :5173)      │
└──────┬───────┘
       │
       ▼
┌─────────────────────────────────────────┐
│          LOGIN PAGE                     │
│  Step 1: Phone (10 digits)              │
│  Step 2: OTP (6 digits)                 │
│  Step 3: CAPTCHA (7+5=?)                │
│  Step 4: Adhar (12 digits)              │
└──────┬──────────────────────────────────┘
       │
       │ POST /api/accounts/login
       │ { phoneNumber: "9876543210" }
       ▼
┌───────────────────────────────────────────────────┐
│   SPRING BOOT BACKEND                             │
│   AccountController.login()                       │
│                                                   │
│   Optional<Account> = accountRepository           │
│     .findByPhoneNumber("9876543210")              │
│                                                   │
│   Response:                                       │
│   {                                               │
│     "id": 1,                                      │
│     "phoneNumber": "9876543210",                  │
│     "patients": [                                 │
│       {                                           │
│         "id": 1,                                  │
│         "name": "Rajesh Sharma",                  │
│         "age": 35,                                │
│         "aadharOrAbhaId": "ABHA-2024-001"        │
│       },                                          │
│       {                                           │
│         "id": 2,                                  │
│         "name": "Priya Sharma",                   │
│         "age": 32,                                │
│         "aadharOrAbhaId": "ABHA-2024-002"        │
│       }                                           │
│     ]                                             │
│   }                                               │
└──────┬──────────────────────────────────────────┘
       │ Response with Account + 2 Patients
       │
       ▼
┌────────────────────────────────────────┐
│  PATIENT SELECTOR PAGE                 │
│  (PatientSelector.tsx)                 │
│                                        │
│  Session Storage:                      │
│  accountData = {                       │
│    id: 1,                              │
│    phoneNumber: "9876543210",          │
│    patients: [...]                     │
│  }                                     │
│                                        │
│  ┌───────────────────────────────────┐ │
│  │ OPTION A: SELECT SAVED PATIENT    │ │
│  │ ○ Rajesh Sharma (Age 35)          │ │
│  │ ○ Priya Sharma (Age 32)           │ │
│  └───────────────────────────────────┘ │
│              OR                         │
│  ┌───────────────────────────────────┐ │
│  │ OPTION B: ADD NEW PATIENT         │ │
│  │ Name: [____________]              │ │
│  │ Age: [__]                         │ │
│  │ ID: [________________]            │ │
│  │ Auto-Phone: 9876543210            │ │
│  │ [Submit]                          │ │
│  └───────────────────────────────────┘ │
│                                        │
│  [Proceed with Selected Patient]       │
└──────┬───────────────────────────────┘
       │
       │ If Option B (Add New):
       │ POST /api/accounts/1/patients
       │ { name, age, aadharOrAbhaId }
       │
       ├─→ Backend: Patient saved & linked to Account
       │   Response: { id: 3, name: "...", ... }
       │   Account now has 3 patients (max 5)
       │
       │ Store selectedPatient in sessionStorage
       │
       ▼
┌──────────────────────────────────────┐
│  BOOKING PAGE                        │
│  (Booking.tsx)                       │
│  Retrieve: selectedPatient           │
│  - Display: Rajesh Sharma (35)       │
│  - Select Doctor                     │
│  - Select Date/Time                  │
└──────┬───────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│  APPOINTMENT CONFIRMATION            │
│  (AppointmentConfirmation.tsx)       │
│                                      │
│  GET /api/doctor/1/clinic-details    │
│  Response:                           │
│  {                                   │
│    "doctorName":                     │
│      "Dr. Rajesh Kumar",             │
│    "speciality":                     │
│      "General Medicine",              │
│    "wheelchairAccess": true,         │
│    "clinicAddress":                  │
│      "123 Medical Plaza,             │
│       City Center, New Delhi"        │
│  }                                   │
│                                      │
│  Display:                            │
│  ┌────────────────────────────────┐  │
│  │ APPOINTMENT CONFIRMED          │  │
│  │                                │  │
│  │ ETA: 00:30 (Countdown Timer)   │  │
│  │                                │  │
│  │ Patient: Rajesh Sharma (35)    │  │
│  │ Doctor: Dr. Rajesh Kumar       │  │
│  │ Speciality: General Medicine   │  │
│  │                                │  │
│  │ 📍 123 Medical Plaza,          │  │
│  │    City Center, New Delhi      │  │
│  │                                │  │
│  │ 💊 Pharmacy: Available         │  │
│  │ ♿ Wheelchair: Accessible      │  │
│  │                                │  │
│  │ [Track Appointment]            │  │
│  │ [Back to Home]                 │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

---

## Database Relationship Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    DATA RELATIONSHIPS                       │
└─────────────────────────────────────────────────────────────┘

                    ┌──────────────┐
                    │   ACCOUNT    │
                    ├──────────────┤
                    │ id: BIGINT   │ ◄─ PRIMARY KEY
                    │ phone:       │
                    │ VARCHAR(20)  │ ◄─ findByPhoneNumber() Index
                    └─────┬────────┘
                          │ 1-to-Many
                          │ Cascade: ALL
                          │ Lazy: LAZY
                          ▼
                    ┌──────────────┐
                    │   PATIENT    │
                    ├──────────────┤
                    │ id: BIGINT   │ ◄─ PRIMARY KEY
                    │ name: VARCHAR│
                    │ age: INT     │
                    │ aadharOrAbha │
                    │ account_id   │ ◄─ FOREIGN KEY
                    └──────────────┘
                          │
                          │ Many-to-One
                          │
            ┌─────────────┼─────────────┐
            ▼             ▼             ▼
      ┌──────────┐ ┌──────────┐ ┌──────────┐
      │APPT_HIST │ │APPOINT.  │ │FIN_LEDGE │
      │          │ │          │ │          │
      │account_id│ │account_id│ │patient_id│ (note: tracks individual)
      │patient_id│ │patient_id│ │balance   │
      │          │ │doctor_id │ │expiry    │
      └──────────┘ └────┬─────┘ └──────────┘
                        │
                        │ Many-to-One
                        │
                        ▼
                  ┌──────────────┐
                  │    DOCTOR    │
                  ├──────────────┤
                  │ id: BIGINT   │
                  │ name: VARCHAR│
                  │ speciality   │
                  │ wheelchair   │ ◄─ NEW FIELD
                  │ pharmacy     │
                  │ start_time   │
                  │ end_time     │
                  └──────────────┘

Queue Management (Separate):
┌──────────────┐         ┌──────────────────┐
│  LIVE_QUEUE  │◄────┬──►│LIVE_QUEUE_ENTRY  │
├──────────────┤     │   ├──────────────────┤
│ id: BIGINT   │     │   │ id: BIGINT       │
│ serving_token│     │   │ patient_id       │
│ issued_token │     │   │ token_number     │
│ emergency    │     │   │ issued_at        │
└──────────────┘     │   │ served: BOOLEAN  │
                     │   └──────────────────┘
                     │
                     └─ One-to-Many

Legend:
─────
⬤ = One
◄─ = Foreign Key / Index
─► = Relationship Direction
```

---

## API Endpoints Hierarchy

```
BASE URL: http://localhost:8080

├─ /api/accounts (AccountController)
│  ├─ POST /login
│  │  └─ {phoneNumber} → Account + Patients List
│  │
│  ├─ POST /{accountId}/patients
│  │  └─ {name, age, aadharOrAbhaId} → Saved Patient (max 5)
│  │
│  └─ GET /{accountId}/patients
│     └─ [] → List of Patients under Account
│
├─ /api/doctor (DoctorDetailsController)
│  └─ GET /{doctorId}/clinic-details
│     └─ {} → Doctor Info (now includes wheelchair field)
│
├─ /api/appointment (AppointmentController)
│  └─ POST /{patientId}/consulted
│     └─ Mark appointment as consulted
│
├─ /api/mediator (MediatorController)
│  ├─ GET /queue
│  │  └─ [] → List of Appointments
│  │
│  ├─ POST /check-in/{appointmentId}
│  │  └─ Mark appointment checked-in
│  │
│  └─ POST /complete/{appointmentId}
│     └─ Mark appointment completed
│
├─ /api/patient (PatientController)
│  ├─ POST / (Create)
│  └─ GET / (List)
│
├─ /api/seed (SeedController)
│  ├─ POST /initialize
│  │  └─ Seed: 1 Doctor + 1 Account + 2 Patients + 2 Appointments
│  │
│  └─ GET /status
│     └─ Count of all entities
│
└─ /api/doctor-balance (DoctorBalanceController)
   └─ GET /{doctorId}/balance
      └─ {} → Balance Info
```

---

## Frontend Router Tree

```
Browser: http://localhost:5173

<BrowserRouter>
│
├─ / (Login.tsx)
│  └─ Phone OTP Captcha Adhar → /patient-selector
│
├─ /patient-selector ★ NEW ★ (PatientSelector.tsx)
│  ├─ List Saved Patients (Radio Select)
│  ├─ Add New Patient Form (with auto-phone)
│  └─ Proceed → /booking or back to /
│
├─ /booking (Booking.tsx)
│  ├─ Shows selected patient
│  ├─ Doctor search
│  ├─ Date/Time selection
│  └─ Book → /appointment/confirmation
│
├─ /appointment/confirmation (AppointmentConfirmation.tsx)
│  ├─ Patient Name + Age
│  ├─ Countdown ETA Timer
│  ├─ Clinic Address
│  ├─ Doctor + Speciality
│  ├─ Wheelchair Access (from API)
│  └─ Pharmacy Availability
│
├─ /tracker (Tracker.tsx)
│  └─ View appointment status
│
├─ /check-in (CheckIn.tsx)
│  └─ Check-in for appointment
│
├─ /medical-profile (MedicalProfile.tsx)
│  └─ View medical history
│
├─ /mediator (Mediator.tsx)
│  └─ Queue management
│
├─ /mediator/login (MediatorLogin.tsx)
│  └─ Mediator authentication
│
├─ /doctor (Doctor.tsx)
│  └─ Doctor endpoint
│
├─ /doctor/dashboard (DoctorDashboard.tsx)
│  └─ Doctor dashboard
│
├─ /doctor-balance (DoctorBalance.tsx)
│  └─ Balance tracking
│
├─ /doctor-profile (DoctorProfile.tsx)
│  └─ Doctor profile
│
└─ /setup-clinic (SetupClinic.tsx)
   └─ Clinic setup
```

---

## Technology Stack Summary

```
┌─────────────────────────────────┬──────────────────┐
│ Component                       │ Version          │
├─────────────────────────────────┼──────────────────┤
│ Java (Backend)                  │ 21.0.9 LTS       │
│ Spring Boot                     │ 3.2.4            │
│ Spring Data JPA                 │ 3.2.4            │
│ Hibernate                       │ 6.4.4            │
│ Maven                           │ Latest           │
│                                 │                  │
│ Node.js (Frontend)              │ Latest           │
│ React                           │ 18.3.1           │
│ React Router                    │ 7.13.0           │
│ React DOM                       │ 18.3.1           │
│ Vite                            │ 6.3.5            │
│ TypeScript                      │ 5.x              │
│ Tailwind CSS                    │ 4.1.12           │
│ Lucide React (Icons)            │ Latest           │
│                                 │                  │
│ Database                        │ H2 (in-memory)   │
│ Database Driver                 │ 2.2.224          │
│                                 │                  │
│ Server OS                       │ Windows 11       │
│ Browser (Dev)                   │ Chrome Latest    │
└─────────────────────────────────┴──────────────────┘
```

---

**Architecture Last Updated**: February 25, 2026, 10:37 AM IST  
**Status**: Complete & Tested ✅  
**Ready for**: Full-Stack Integration Testing
