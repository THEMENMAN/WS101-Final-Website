package com.uep.freelance.controller;

import com.controller.PaymentMethod;
import com.model.Payment;
import com.service.PaymentService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/escrow")
    public ResponseEntity<?> createEscrowPayment(@RequestBody Map<String, Object> paymentData) {
        try {
            Long jobId = Long.valueOf(paymentData.get("jobId").toString());
            BigDecimal amount = new BigDecimal(paymentData.get("amount").toString());
            PaymentMethod method = PaymentMethod.valueOf(paymentData.get("method").toString());

            Payment payment = paymentService.createEscrowPayment(jobId, amount, method);
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{paymentId}/release")
    public ResponseEntity<?> releasePayment(@PathVariable Long paymentId) {
        try {
            Payment payment = paymentService.releasePayment(paymentId);
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{paymentId}/refund")
    public ResponseEntity<?> refundPayment(@PathVariable Long paymentId) {
        try {
            Payment payment = paymentService.releasePayment(paymentId);
            return ResponseEntity.ok(payment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/process-mock")
    public ResponseEntity<?> processMockPayment(@RequestBody Map<String, Object> paymentData) {
        try {
            PaymentMethod method = PaymentMethod.valueOf(paymentData.get("method").toString());
            String accountDetails = (String) paymentData.get("accountDetails");
            BigDecimal amount = new BigDecimal(paymentData.get("amount").toString());

            boolean success = paymentService.processMockPayment(method, accountDetails, amount);

            if (success) {
                return ResponseEntity.ok("Payment processed successfully");
            } else {
                return ResponseEntity.badRequest().body("Payment processing failed");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
