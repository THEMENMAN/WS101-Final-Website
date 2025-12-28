package com.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    
    @Autowired
    private JavaMailSender mailSender;
    
    public void sendWelcomeEmail(String to, String name) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Welcome to UEP Freelance Network!");
        message.setText("Dear " + name + ",\n\nWelcome to the UEP Freelance Network! "
                      + "We're excited to have you on board.\n\n"
                      + "Best regards,\nUEP Freelance Team");
        
        mailSender.send(message);
    }
    
    public void sendJobNotification(String to, String jobTitle, String clientName) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("New Job Posted: " + jobTitle);
        message.setText("Hello,\n\nA new job has been posted:\n\n"
                      + "Job Title: " + jobTitle + "\n"
                      + "Posted by: " + clientName + "\n\n"
                      + "Login to your account to view and apply for this job.\n\n"
                      + "Best regards,\nUEP Freelance Team");
        
        mailSender.send(message);
    }
    
    public void sendProposalNotification(String to, String jobTitle, String freelancerName) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("New Proposal for: " + jobTitle);
        message.setText("Hello,\n\nYou have received a new proposal for your job:\n\n"
                      + "Job Title: " + jobTitle + "\n"
                      + "From: " + freelancerName + "\n\n"
                      + "Login to your account to review the proposal.\n\n"
                      + "Best regards,\nUEP Freelance Team");
        
        mailSender.send(message);
    }
}