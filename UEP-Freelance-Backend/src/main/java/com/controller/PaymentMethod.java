package com.controller;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Supported payment methods.
 * Provides a tolerant parser via {@link #fromString(String)} that accepts
 * case-insensitive names and common variants (spaces, dashes).
 */
public enum PaymentMethod {
    CREDIT_CARD("CREDIT_CARD"),
    BANK_TRANSFER("BANK_TRANSFER"),
    PAYPAL("PAYPAL"),
    GCASH("GCASH"),
    WALLET("WALLET");

    private final String value;

    PaymentMethod(String value) {
        this.value = value;
    }

    @JsonValue
    @Override
    public String toString() {
        return value;
    }

    @JsonCreator
    public static PaymentMethod fromString(String s) {
        if (s == null || s.trim().isEmpty()) {
            throw new IllegalArgumentException("Payment method must be provided");
        }
        String normalized = s.trim().toUpperCase().replaceAll("[\s-]+", "_");
        for (PaymentMethod m : values()) {
            if (m.name().equalsIgnoreCase(normalized) || m.value.equalsIgnoreCase(normalized)) {
                return m;
            }
        }
        throw new IllegalArgumentException("Unknown payment method: '" + s + "'. Supported values: " + supported());
    }

    public static String supported() {
        StringBuilder sb = new StringBuilder();
        for (PaymentMethod m : values()) {
            if (sb.length() > 0) sb.append(", ");
            sb.append(m.value);
        }
        return sb.toString();
    }
}
