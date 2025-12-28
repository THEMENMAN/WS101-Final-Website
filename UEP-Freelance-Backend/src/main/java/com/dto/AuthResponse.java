package com.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    private String token;
    private String email;
    private String firstName;
    private String lastName;
    private String role;
    private Long userId;

    /** Epoch milliseconds when the token was issued. */
    private Long issuedAt;

    /** Optional epoch milliseconds when the token expires. */
    private Long expiresAt;

    // Backward-compatible convenience constructor used in existing code paths
    public AuthResponse(String token, String email, String firstName, String lastName, String role, Long userId) {
        this(token, email, firstName, lastName, role, userId, Instant.now().toEpochMilli(), null);
    }
}