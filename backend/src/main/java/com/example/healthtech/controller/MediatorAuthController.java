package com.example.healthtech.controller;

import com.example.healthtech.service.QueueService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/mediator")
public class MediatorAuthController {
    private final QueueService queueService;

    public MediatorAuthController(QueueService queueService) {
        this.queueService = queueService;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        // Simple in-memory auth: hardcoded mediator credentialss
        if ("mediator".equals(username) && "password123".equals(password)) {
            Map<String, Object> response = new HashMap<>();
            response.put("token", "mediator-session-token");
            response.put("role", "mediator");
            response.put("message", "Login successful");
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
    }

    @PostMapping("/move-down")
    public ResponseEntity<Map<String, String>> moveDown(@RequestBody Map<String, Object> body) {
        Long patientId = Long.valueOf(String.valueOf(body.getOrDefault("patientId", -1)));
        if (patientId <= 0) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid patientId"));
        }

        try {
            queueService.triggerLateArrival(patientId);
            return ResponseEntity.ok(Map.of("message", "Patient moved down and ₹100 deducted"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
