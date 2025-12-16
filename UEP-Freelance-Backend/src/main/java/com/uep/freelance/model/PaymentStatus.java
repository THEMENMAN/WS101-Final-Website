package com.uep.freelance.model;

public enum PaymentStatus {
    PENDING,
    HOLD, // In escrow
    RELEASED,
    REFUNDED,
    FAILED
}