package com.uep.freelance.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private BigDecimal amount;
    
    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;
    
    @Enumerated(EnumType.STRING)
    private PaymentStatus status;
    
    private String transactionId;
    private String escrowAccountId;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime completedAt;
    private LocalDateTime cancelledAt;
    
    @ManyToOne
    @JoinColumn(name = "job_id")
    private Job job;
    
    // No-args constructor
    public Payment() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.status = PaymentStatus.PENDING;
    }
    
    // Constructor matching your code
    public Payment(Job job, BigDecimal amount, PaymentMethod paymentMethod) {
        this();
        this.job = job;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.status = PaymentStatus.HELD_IN_ESCROW;
    }
    
    // Setter for escrow account
    public void setEscrowAccountId(String escrowAccountId) {
        this.escrowAccountId = escrowAccountId;
    }
}

enum PaymentMethod {
    CREDIT_CARD, BANK_TRANSFER, PAYPAL, GCASH, PAYMAYA
}