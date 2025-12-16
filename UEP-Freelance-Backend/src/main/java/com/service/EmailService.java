package com.uep.freelance.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired(required = false) // Make it optional for development
    private JavaMailSender mailSender;

    public void sendVerificationEmail(String toEmail, String verificationToken) {
        // Skip email sending if mailSender is not configured (for development)
        if (mailSender == null) {
            System.out.println("Email verification token for " + toEmail + ": " + verificationToken);
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Verify Your UEP Freelance Account");
            message.setText("Please click the following link to verify your account: "
                    + "http://localhost:8080/api/auth/verify?token=" + verificationToken);

            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send verification email: " + e.getMessage());
            // Don't throw exception, just log it
        }
    }

    public void sendPasswordResetEmail(String toEmail, String resetToken) {
        // Skip email sending if mailSender is not configured
        if (mailSender == null) {
            System.out.println("Password reset token for " + toEmail + ": " + resetToken);
            return;
        }

        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("Reset Your UEP Freelance Password");
            message.setText("Please click the following link to reset your password: "
                    + "http://localhost:3000/reset-password?token=" + resetToken);

            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send password reset email: " + e.getMessage());
        }
    }
}