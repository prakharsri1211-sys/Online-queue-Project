package com.example.healthtech.controller;

import com.example.healthtech.model.*;
import com.example.healthtech.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/seed")
public class SeedController {

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private FinanceLedgerRepository financeLedgerRepository;

    @Autowired
    private LiveQueueRepository liveQueueRepository;

    @Autowired
    private LiveQueueEntryRepository liveQueueEntryRepository;

    @Autowired
    private AccountRepository accountRepository;

    @PostMapping("/initialize")
    public ResponseEntity<?> seedDatabase() {
        try {
            System.out.println("[SEED] Starting database seed...");
            
            // Clear existing data
            appointmentRepository.deleteAll();
            liveQueueEntryRepository.deleteAll();
            liveQueueRepository.deleteAll();
            financeLedgerRepository.deleteAll();
            patientRepository.deleteAll();
            accountRepository.deleteAll();
            doctorRepository.deleteAll();
            System.out.println("[SEED] Cleared all tables");

            // Create Doctor
            Doctor doctor = new Doctor();
            doctor.setName("Dr. Rajesh Kumar");
            doctor.setSpeciality("General Medicine");
            doctor.setQualification("MBBS, MD");
            doctor.setStartTime(LocalTime.of(9, 0, 0));
            doctor.setEndTime(LocalTime.of(17, 0, 0));
            doctor.setBookingWindowDays(30);
            doctor.setMaxPatientsPerDay(15);
            doctor.setTargetAgeRange(Doctor.TargetAgeRange.ADULT);
            doctor.setPharmacyAvailable(true);
            doctor.setWheelchairAccessible(true);
            doctor = doctorRepository.save(doctor);
            System.out.println("[SEED] Created doctor: " + doctor.getId());

            // Create Account with minimal required fields
            Account account = new Account();
            account.setPhoneNumber("9876543210");
            account.setPrimaryAadharNumber("123456789012");
            try {
                account = accountRepository.save(account);
                System.out.println("[SEED] Created account: " + account.getId());
            } catch (Exception e) {
                System.err.println("[SEED] Failed to create account: " + e.getMessage());
                throw e;
            }
            
            // Create Patient 1
            Patient patient1 = new Patient();
            patient1.setName("Rajesh Sharma");
            patient1.setAge(35);
            patient1.setAadharOrAbhaId("ABHA-2024-001");
            patient1.setAccount(account);
            try {
                patient1 = patientRepository.save(patient1);
                System.out.println("[SEED] Created patient1: " + patient1.getId());
            } catch (Exception e) {
                System.err.println("[SEED] Failed to create patient1: " + e.getMessage());
                throw e;
            }
            
            // Create Patient 2
            Patient patient2 = new Patient();
            patient2.setName("Priya Sharma");
            patient2.setAge(32);
            patient2.setAadharOrAbhaId("ABHA-2024-002");
            patient2.setAccount(account);
            try {
                patient2 = patientRepository.save(patient2);
                System.out.println("[SEED] Created patient2: " + patient2.getId());
            } catch (Exception e) {
                System.err.println("[SEED] Failed to create patient2: " + e.getMessage());
                throw e;
            }

            // Create Finance Ledgers for both patients
            FinanceLedger ledger1 = new FinanceLedger();
            ledger1.setPatientId(patient1.getId());
            ledger1.setTotalFee(500);
            ledger1.setCreditBalance(1000);
            ledger1.setCreditExpiryDate(LocalDate.now().plusMonths(6));
            try {
                financeLedgerRepository.save(ledger1);
                System.out.println("[SEED] Created ledger1 for patient: " + patient1.getId());
            } catch (Exception e) {
                System.err.println("[SEED] Failed to create ledger1: " + e.getMessage());
                throw e;
            }
            
            FinanceLedger ledger2 = new FinanceLedger();
            ledger2.setPatientId(patient2.getId());
            ledger2.setTotalFee(500);
            ledger2.setCreditBalance(1000);
            ledger2.setCreditExpiryDate(LocalDate.now().plusMonths(6));
            try {
                financeLedgerRepository.save(ledger2);
                System.out.println("[SEED] Created ledger2 for patient: " + patient2.getId());
            } catch (Exception e) {
                System.err.println("[SEED] Failed to create ledger2: " + e.getMessage());
                throw e;
            }

            // Create Live Queue
            LiveQueue queue = new LiveQueue();
            queue.setCurrentlyServingToken(0);
            queue.setLastIssuedToken(2);
            queue.setEmergencyFlag(false);
            queue = liveQueueRepository.save(queue);

            // Create Appointment
            Appointment appointment = new Appointment();
            appointment.setPatient(patient1);
            appointment.setDoctor(doctor);
            appointment.setDate(LocalDate.now());
            appointment.setTimeSlot("10:00 AM");
            appointment.setIsPremium(false);
            appointment.setAccount(account);
            appointment.setStatus("scheduled");
            appointment.setEtaMinutes(30);
            appointment.setClinicAddress("123 Medical Plaza, City Center, New Delhi");
            appointmentRepository.save(appointment);

            // Create Queue Entry
            LiveQueueEntry queueEntry = new LiveQueueEntry();
            queueEntry.setPatient(patient1);
            queueEntry.setTokenNumber(1);
            queueEntry.setIssuedAt(LocalDateTime.now());
            queueEntry.setServed(false);
            liveQueueEntryRepository.save(queueEntry);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Database seeded successfully!");
            response.put("doctor", doctor.getName());
            response.put("doctorId", doctor.getId());
            response.put("patient", patient1.getName());
            response.put("patientId", patient1.getId());
            response.put("accountId", account.getId());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to seed database: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    @GetMapping("/status")
    public ResponseEntity<?> seedStatus() {
        Map<String, Long> status = new HashMap<>();
        status.put("doctors", doctorRepository.count());
        status.put("patients", patientRepository.count());
        status.put("accounts", accountRepository.count());
        status.put("appointments", appointmentRepository.count());
        status.put("ledgers", financeLedgerRepository.count());
        status.put("queues", liveQueueRepository.count());
        status.put("queueEntries", liveQueueEntryRepository.count());
        return ResponseEntity.ok(status);
    }
}
