package com.example.healthtech.controller;

import com.example.healthtech.model.Doctor;
import com.example.healthtech.repository.DoctorRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/doctor")
public class DoctorDetailsController {
    private final DoctorRepository doctorRepository;

    public DoctorDetailsController(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    @GetMapping("/{doctorId}/clinic-details")
    public ResponseEntity<Map<String, Object>> getClinicDetails(@PathVariable Long doctorId) {
        Optional<Doctor> doctor = doctorRepository.findById(doctorId);
        if (doctor.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Doctor d = doctor.get();
        Map<String, Object> details = new HashMap<>();
        details.put("doctorName", d.getName());
        details.put("speciality", d.getSpeciality());
        details.put("qualification", d.getQualification());
        details.put("clinicAddress", "123 Medical Plaza, City Center, New Delhi"); // hardcoded for demo
        details.put("pharmacy", d.getPharmacyAvailable() ? "Yes" : "No");
        details.put("wheelchairAccess", d.getWheelchairAccessible() != null && d.getWheelchairAccessible());
        details.put("startTime", d.getStartTime().toString());
        details.put("endTime", d.getEndTime().toString());

        return ResponseEntity.ok(details);
    }
}
