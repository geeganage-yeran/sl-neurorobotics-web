package com.slneurorobotics.backend.controller;

import com.slneurorobotics.backend.dto.request.CheckoutSessionRequest;
import com.slneurorobotics.backend.dto.response.CheckoutSessionResponse;
import com.slneurorobotics.backend.service.CheckoutService;
import com.stripe.model.checkout.Session;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;


@RestController
@RequestMapping("api/checkout")
public class CheckoutController {
    private final CheckoutService checkoutService;

    public CheckoutController(CheckoutService checkoutService) {
        this.checkoutService = checkoutService;
    }

    @PostMapping("/session")
    public ResponseEntity<CheckoutSessionResponse> createSession(
            @RequestBody CheckoutSessionRequest request) {
        try {
            // Create Stripe session using the subtotal (amount in cents)
            Session session = checkoutService.createSession(request);

            // Return the sessionId to the frontend for redirecting to Stripe Checkout
            return ResponseEntity.ok(new CheckoutSessionResponse(session.getId()));
        } catch (Exception e) {
            // Handle any errors during session creation
            System.out.println(e.getMessage());
            return ResponseEntity.status(500).body(new CheckoutSessionResponse("Error creating session"));
        }
    }

    @GetMapping("/verify-payment/{sessionId}")
    public ResponseEntity<Map<String, Object>> verifyPayment(@PathVariable String sessionId) {
        try {
            // Retrieve the session from Stripe
            Session session = Session.retrieve(sessionId);

            Map<String, Object> response = new HashMap<>();

            // Check if payment was successful
            if ("complete".equals(session.getStatus()) && "paid".equals(session.getPaymentStatus())) {
                response.put("valid", true);
                response.put("amount", session.getAmountTotal());
                response.put("currency", session.getCurrency());
                return ResponseEntity.ok(response);
            } else {
                response.put("valid", false);
                return ResponseEntity.badRequest().body(response);
            }

        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("valid", false);
            response.put("error", "Invalid session");
            return ResponseEntity.badRequest().body(response);
        }
    }
}
