package com.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Column(nullable = false)
    private String firstName;
    
    @Column(nullable = false)
    private String lastName;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;
    
    private String phone;
    private String skills;
    private String bio;
    private String company;
    private String profileImage;
    
    @Column(columnDefinition = "DECIMAL(10,2) DEFAULT 0.0")
    private Double rating = 0.0;
    
    private Integer totalJobs = 0;
    private Integer completedJobs = 0;
    
    @Column(nullable = false)
    private Boolean isActive = true;
    
    @Column(nullable = false)
    private Boolean isVerified = false;
    
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @OneToMany(mappedBy = "client")
    private List<Job> postedJobs;
    
    @OneToMany(mappedBy = "freelancer")
    private List<Proposal> proposals;

    public String getCoverLetter() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getCoverLetter'");
    }

    public Enum<ProposalStatus> getStatus() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getStatus'");
    }

    public org.apache.catalina.User getFreelancer() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getFreelancer'");
    }
}