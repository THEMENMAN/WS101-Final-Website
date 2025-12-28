package com.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import com.model.Payment;
import com.service.PaymentService;

import java.math.BigDecimal;
import java.util.Map;
import java.time.Instant; 

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    private static final Logger logger = LoggerFactory.getLogger(PaymentController.class);

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping(value = "/escrow", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createEscrowPayment(@Valid @RequestBody EscrowRequest request) {
        try {
            PaymentMethod method;
            try {
                method = PaymentMethod.fromString(request.getMethod());
            } catch (Exception ex) {
                logger.warn("Invalid payment method: {}", request.getMethod());
                return ResponseEntity.badRequest().body(new ApiError(ex.getMessage(), Instant.now().toEpochMilli()));
            }

            Payment payment = paymentService.createEscrowPayment(request.getJobId(), request.getAmount(), method);
            return ResponseEntity.status(HttpStatus.CREATED).body(payment);
        } catch (NumberFormatException | IllegalArgumentException e) {
            logger.warn("Invalid escrow request: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new ApiError(e.getMessage(), Instant.now().toEpochMilli()));
        } catch (Exception e) {
            logger.error("Unexpected error creating escrow", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiError("Internal server error", Instant.now().toEpochMilli()));
        }
    }

    @PostMapping(value = "/{paymentId}/release", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> releasePayment(@PathVariable @Positive Long paymentId) {
        try {
            Payment payment = paymentService.releasePayment(paymentId);
            return ResponseEntity.ok(payment);
        } catch (IllegalArgumentException | NoSuchFieldError e) {
            logger.warn("Release failed for payment {}: {}", paymentId, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiError("Payment not found", Instant.now().toEpochMilli()));
        } catch (Exception e) {
            logger.error("Error releasing payment {}", paymentId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiError("Internal server error", Instant.now().toEpochMilli()));
        }
    }

    @PostMapping(value = "/{paymentId}/refund", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> refundPayment(@PathVariable @Positive Long paymentId) {
        // Refund is not implemented in the service yet — return 501 Not Implemented with a clear message.
        logger.info("Refund requested for payment {} but endpoint is not implemented", paymentId);
        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).body(new ApiError("Refund not implemented", Instant.now().toEpochMilli()));
    }

    @PostMapping(value = "/process-mock", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> processMockPayment(@Valid @RequestBody ProcessMockRequest request) {
        try {
            PaymentMethod method;
            try {
                method = PaymentMethod.fromString(request.getMethod());
            } catch (Exception ex) {
                logger.warn("Invalid payment method for mock: {}", request.getMethod());
                return ResponseEntity.badRequest().body(new ApiError(ex.getMessage(), Instant.now().toEpochMilli()));
            }

            boolean success = paymentService.processMockPayment(method, request.getAccountDetails(), request.getAmount());

            if (success) {
                return ResponseEntity.ok("Payment processed successfully");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiError("Payment processing failed", Instant.now().toEpochMilli()));
            }
        } catch (NumberFormatException | IllegalArgumentException e) {
            logger.warn("Invalid mock payment request: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new ApiError(e.getMessage(), Instant.now().toEpochMilli()));
        } catch (Exception e) {
            logger.error("Unexpected error processing mock payment", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiError("Internal server error", Instant.now().toEpochMilli()));
        }
    }

    // Request DTOs and error payload
    public static class EscrowRequest {
        @NotNull
        @Positive
        private Long jobId;

        @NotNull
        @DecimalMin(value = "0.01", message = "Amount must be positive")
        private BigDecimal amount;

        @NotBlank
        private String method;

        public Long getJobId() { return jobId; }
        public void setJobId(Long jobId) { this.jobId = jobId; }
        public BigDecimal getAmount() { return amount; }
        public void setAmount(BigDecimal amount) { this.amount = amount; }
        public String getMethod() { return method; }
        public void setMethod(String method) { this.method = method; }
    }

    public static class ProcessMockRequest {
        @NotBlank
        private String method;

        @NotBlank
        private String accountDetails;

        @NotNull
        @DecimalMin(value = "0.01", message = "Amount must be positive")
        private BigDecimal amount;

        public String getMethod() { return method; }
        public void setMethod(String method) { this.method = method; }
        public String getAccountDetails() { return accountDetails; }
        public void setAccountDetails(String accountDetails) { this.accountDetails = accountDetails; }
        public BigDecimal getAmount() { return amount; }
        public void setAmount(BigDecimal amount) { this.amount = amount; }
    }

    private static class ApiError {
        private final String message;
        private final long timestamp;

        public ApiError(String message, long timestamp) {
            this.message = message;
            this.timestamp = timestamp;
        }

        public String getMessage() { return message; }
        public long getTimestamp() { return timestamp; }
    }
}