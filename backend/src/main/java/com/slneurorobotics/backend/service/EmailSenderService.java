package com.slneurorobotics.backend.service;

import com.slneurorobotics.backend.dto.request.EmailRequestDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailSenderService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private TemplateEngine templateEngine;

    @Value("${company.email:sachindunisal09@gmail.com}")
    private String companyEmail;

    @Value("${company.name:SL Neuro Robotics}")
    private String companyName;

    public void sendEmail(EmailRequestDTO request) throws MessagingException {
        // Send inquiry email to company
        sendInquiryEmail(request);

        // Send auto-reply to customer
        sendAutoReply(request);
    }

    private void sendInquiryEmail(EmailRequestDTO request) throws MessagingException {
        // Create Thymeleaf context and add variables
        Context context = new Context();
        context.setVariable("customerName", request.getName());
        context.setVariable("customerEmail", request.getEmail());
        context.setVariable("contactNumber", request.getContactNumber());
        context.setVariable("country", request.getCountry());
        context.setVariable("message", request.getMessage());

        // Process the template
        String htmlContent = templateEngine.process("inquiry-email", context);

        // Create MIME message
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

        helper.setFrom(companyEmail); // Use company email as sender
        helper.setTo(companyEmail);
        helper.setReplyTo(request.getEmail()); // Set customer email as reply-to
        helper.setSubject("New Inquiry from " + request.getName());
        helper.setText(htmlContent, true);

        // Send the email
        mailSender.send(mimeMessage);
    }

    private void sendAutoReply(EmailRequestDTO request) throws MessagingException {
        // Create context for auto-reply template
        Context context = new Context();
        context.setVariable("customerName", request.getName());
        context.setVariable("companyName", companyName);
        context.setVariable("inquirySubject", "General Inquiry");

        // Process the auto-reply template
        String htmlContent = templateEngine.process("auto-reply-email", context);

        // Create MIME message for auto-reply
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

        helper.setFrom(companyEmail);
        helper.setTo(request.getEmail()); // Send to customer
        helper.setSubject("Thank you for your inquiry - " + companyName);
        helper.setText(htmlContent, true);

        // Send the auto-reply
        mailSender.send(mimeMessage);
    }
}