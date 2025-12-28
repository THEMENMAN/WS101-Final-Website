package com.service;

import java.math.BigDecimal;

import com.controller.PaymentMethod;
import com.model.Payment;

public class PaymentService {

    public Payment createEscrowPayment(Long jobId, BigDecimal amount, PaymentMethod method) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'createEscrowPayment'");
    }

    public Payment releasePayment(Long paymentId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'releasePayment'");
    }

    public boolean processMockPayment(PaymentMethod method, String accountDetails, BigDecimal amount) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'processMockPayment'");
    }
    
}
