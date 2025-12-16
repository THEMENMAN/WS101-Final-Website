package com.uep.freelance.dto;

import com.uep.freelance.model.JobCategory;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class JobRequest {
    private String title;
    private String description;
    private JobCategory category;
    private BigDecimal budgetFrom;
    private BigDecimal budgetTo;
    private Integer deadlineDays;
}