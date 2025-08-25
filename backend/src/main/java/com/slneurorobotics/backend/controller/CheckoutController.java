package com.slneurorobotics.backend.controller;

import com.slneurorobotics.backend.dto.request.CheckoutSessionRequest;
import com.slneurorobotics.backend.dto.response.CheckoutSessionResponse;
import com.slneurorobotics.backend.service.CheckoutService;
import com.stripe.model.checkout.Session;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


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
}
