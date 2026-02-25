package com.example.healthtech.model;

import jakarta.persistence.*;

@Entity
public class LiveQueue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer currentlyServingToken = 0;
    private Integer lastIssuedToken = 0;
    private Boolean emergencyFlag = false;

    // getters/setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Integer getCurrentlyServingToken() { return currentlyServingToken; }
    public void setCurrentlyServingToken(Integer currentlyServingToken) { this.currentlyServingToken = currentlyServingToken; }
    public Integer getLastIssuedToken() { return lastIssuedToken; }
    public void setLastIssuedToken(Integer lastIssuedToken) { this.lastIssuedToken = lastIssuedToken; }
    public Boolean getEmergencyFlag() { return emergencyFlag; }
    public void setEmergencyFlag(Boolean emergencyFlag) { this.emergencyFlag = emergencyFlag; }
}
