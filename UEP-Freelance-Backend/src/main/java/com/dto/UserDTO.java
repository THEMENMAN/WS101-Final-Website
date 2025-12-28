package com.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class UserDTO {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String role;
    private String phone;
    private String skills;
    private String bio;
    private String company;
    private Double rating;
    private Integer totalJobs;
    private Integer completedJobs;
    private LocalDateTime createdAt;
    private Boolean isActive;
}