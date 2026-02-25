package com.example.healthtech.controller;

import com.example.healthtech.model.Appointment;
import com.example.healthtech.model.FinanceLedger;
import com.example.healthtech.model.Patient;
import com.example.healthtech.service.QueueService;
import com.example.healthtech.repository.FinanceLedgerRepository;
import com.example.healthtech.repository.PatientRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/mediator")
public class MediatorController {

    private final QueueService queueService;
    private final FinanceLedgerRepository financeLedgerRepository;
    private final PatientRepository patientRepository;

    public MediatorController(QueueService queueService, FinanceLedgerRepository financeLedgerRepository, PatientRepository patientRepository) {
        this.queueService = queueService;
        this.financeLedgerRepository = financeLedgerRepository;
        this.patientRepository = patientRepository;
    }

    @GetMapping("/queue")
    public ResponseEntity<List<Appointment>> getQueue() {
        // Temporary: return empty list as this method is not yet implemented in QueueService
        return ResponseEntity.ok(new java.util.ArrayList<>());
    }

    @PostMapping("/check-in/{appointmentId}")
    public ResponseEntity<Void> checkIn(@PathVariable Long appointmentId) {
        // Temporary: placeholder for check-in logic
        return ResponseEntity.ok().build();
    }

    @PostMapping("/complete/{appointmentId}")
    public ResponseEntity<Void> completeAppointment(@PathVariable Long appointmentId) {
        // Temporary: placeholder for completion logic
        return ResponseEntity.ok().build();
    }

    @PostMapping("/triggerLateArrival")
    public ResponseEntity<?> triggerLateArrival(@RequestBody Map<String, Object> request) {
        try {
            Long patientId = ((Number) request.get("patientId")).longValue();
            
            // Find the patient
            Optional<Patient> patientOpt = patientRepository.findById(patientId);
            if (!patientOpt.isPresent()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Patient not found");
                return ResponseEntity.status(404).body(error);
            }
            
            Patient patient = patientOpt.get();
            
            // Find the finance ledger for this patient
            Optional<FinanceLedger> ledgerOpt = financeLedgerRepository.findByPatientId(patientId);
            if (!ledgerOpt.isPresent()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Finance ledger not found for patient");
                return ResponseEntity.status(404).body(error);
            }
            
            FinanceLedger ledger = ledgerOpt.get();
            
            // Deduct ₹100 from credit balance
            final int LATE_CHARGE = 100;
            int currentBalance = ledger.getCreditBalance();
            
            if (currentBalance >= LATE_CHARGE) {
                ledger.setCreditBalance(currentBalance - LATE_CHARGE);
            } else {
                // If insufficient balance, deduct whatever is available
                ledger.setCreditBalance(0);
            }
            
            financeLedgerRepository.save(ledger);
            
            // Return success response
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Late charge deducted successfully");
            response.put("patientId", patientId);
            response.put("patientName", patient.getName());
            response.put("deductedAmount", LATE_CHARGE);
            response.put("newBalance", ledger.getCreditBalance());
            response.put("timestamp", LocalDate.now());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to process late arrival: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
}
