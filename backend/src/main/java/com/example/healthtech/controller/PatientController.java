package com.example.healthtech.controller;

import com.example.healthtech.model.Appointment;
import com.example.healthtech.model.Patient;
import com.example.healthtech.service.AppointmentService;
import com.example.healthtech.repository.PatientRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/patient")
public class PatientController {
    private final PatientRepository patientRepository;
    private final AppointmentService appointmentService;

    public PatientController(PatientRepository patientRepository, AppointmentService appointmentService) {
        this.patientRepository = patientRepository;
        this.appointmentService = appointmentService;
    }

    @PostMapping
    public ResponseEntity<Patient> createPatient(@RequestBody Patient p) {
        return ResponseEntity.ok(patientRepository.save(p));
    }

    @GetMapping
    public ResponseEntity<List<Patient>> list() {
        return ResponseEntity.ok(patientRepository.findAll());
    }

    @PostMapping("/{patientId}/appointments")
    public ResponseEntity<Appointment> schedule(@PathVariable Long patientId, @RequestParam Long doctorId, @RequestParam String date, @RequestParam String timeSlot, @RequestParam(required = false) Boolean premium) {
        Appointment a = appointmentService.scheduleAppointment(patientId, doctorId, LocalDate.parse(date), timeSlot, premium);
        return ResponseEntity.ok(a);
    }
}
