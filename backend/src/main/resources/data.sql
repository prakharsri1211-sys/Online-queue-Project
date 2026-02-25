-- Seed data for Health-Tech Prototype (H2 In-Memory Database)

-- Seed Doctor (ID: 1)
INSERT INTO Doctor (id, name, speciality, qualification, start_time, end_time, booking_window_days, max_patients_per_day, target_age_range, pharmacy_available, wheelchair_accessible) 
VALUES (1, 'Dr. Rajesh Kumar', 'General Medicine', 'MBBS, MD', '09:00:00', '17:00:00', 30, 20, 'ADULT', true, true);

-- Seed Account (Family Account with Phone Number - ID: 1)
INSERT INTO Account (id, phone_number, primary_aadhar_number) 
VALUES (1, '9876543210', 'ABHA-2024-0001');

-- Seed Patients under Account (First Patient - ID: 1)
INSERT INTO Patient (id, name, age, aadhar_or_abha_id, account_id) 
VALUES (1, 'Rajesh Sharma', 35, 'ABHA-2024-001', 1);

-- Seed Patients under Account (Second Patient - ID: 2)
INSERT INTO Patient (id, name, age, aadhar_or_abha_id, account_id) 
VALUES (2, 'Priya Sharma', 32, 'ABHA-2024-002', 1);

-- Seed Appointment (for First Patient - ID: 1)
INSERT INTO Appointment (id, patient_id, doctor_id, date, time_slot, is_premium, account_id, status, eta_minutes, clinic_address) 
VALUES (1, 1, 1, CURRENT_DATE, '10:00 AM', false, 1, 'scheduled', 30, '123 Medical Plaza, City Center, New Delhi');

-- Seed Appointment (for Second Patient - ID: 2)
INSERT INTO Appointment (id, patient_id, doctor_id, date, time_slot, is_premium, account_id, status, eta_minutes, clinic_address) 
VALUES (2, 2, 1, CURRENT_DATE, '11:30 AM', false, 1, 'scheduled', 45, '123 Medical Plaza, City Center, New Delhi');

-- Seed Finance Ledger for Account
INSERT INTO Finance_Ledger (id, account_id, total_fee, credit_balance, credit_expiry_date) 
VALUES (1, 1, 1000, 500, CURRENT_DATE);

-- Seed Live Queue
INSERT INTO Live_Queue (id, currently_serving_token, last_issued_token, emergency_flag) 
VALUES (1, 0, 2, false);

-- Seed Queue Entry for First Patient
INSERT INTO Live_Queue_Entry (id, patient_id, token_number, issued_at, served) 
VALUES (1, 1, 1, CURRENT_TIMESTAMP, false);

-- Seed Queue Entry for Second Patient
INSERT INTO Live_Queue_Entry (id, patient_id, token_number, issued_at, served) 
VALUES (2, 2, 2, CURRENT_TIMESTAMP, false);
