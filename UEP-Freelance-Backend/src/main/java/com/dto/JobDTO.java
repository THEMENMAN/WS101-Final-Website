package com.uep.freelance.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class JobRequest {
    private String title;
    private String description;
    private String category;
    private String skillsRequired;
    private BigDecimal budget;
    private LocalDate deadline;
    private String location;
    private String experienceLevel;
    
    // Getters that were missing
    public BigDecimal getBudget() {
        return budget;
    }
    
    public LocalDate getDeadline() {
        return deadline;
    }
}