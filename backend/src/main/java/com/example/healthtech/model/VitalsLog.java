package com.example.healthtech.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;

@Entity
@Table(name = "vitals_logs")
public class VitalsLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_name", nullable = false)
    private String userName;

    @Column(name = "heart_rate")
    private Integer heartRate;

    private String status;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    
    public Integer getHeartRate() { return heartRate; }
    public void setHeartRate(Integer heartRate) { this.heartRate = heartRate; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
