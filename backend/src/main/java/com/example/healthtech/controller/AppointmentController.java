package com.example.healthtech.controller;

import com.example.healthtech.model.Appointment;
import com.example.healthtech.service.AppointmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {
    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @PostMapping
    public ResponseEntity<Appointment> scheduleAppointment(@RequestBody AppointmentRequest request) {
        Appointment appointment = appointmentService.scheduleAppointment(request.getPatientId(), request.getDoctorId(), request.getDate(), request.getTimeSlot(), request.getIsPremium());
        return ResponseEntity.ok(appointment);
    }

    @PostMapping("/{appointmentId}/consulted")
    public ResponseEntity<Void> markConsulted(@PathVariable Long appointmentId, @RequestParam(required = false) String diagnosis) {
        appointmentService.markConsulted(appointmentId, diagnosis == null ? "" : diagnosis);
        return ResponseEntity.ok().build();
    }

    public static class AppointmentRequest {
        private Long patientId;
        private Long doctorId;
        private LocalDate date;
        private String timeSlot;
        private Boolean isPremium;

        public Long getPatientId() {
            return patientId;
        }

        public void setPatientId(Long patientId) {
            this.patientId = patientId;
        }

        public Long getDoctorId() {
            return doctorId;
        }

        public void setDoctorId(Long doctorId) {
            this.doctorId = doctorId;
        }

        public LocalDate getDate() {
            return date;
        }

        public void setDate(LocalDate date) {
            this.date = date;
        }

        public String getTimeSlot() {
            return timeSlot;
        }

        public void setTimeSlot(String timeSlot) {
            this.timeSlot = timeSlot;
        }

        public Boolean getIsPremium() {
            return isPremium;
        }

        public void setIsPremium(Boolean premium) {
            isPremium = premium;
        }
    }
}
