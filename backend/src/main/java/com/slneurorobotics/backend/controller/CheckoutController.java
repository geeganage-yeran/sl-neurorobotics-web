package com.slneurorobotics.backend.controller;

import com.slneurorobotics.backend.dto.request.CreateTempOrderDTO;
import com.slneurorobotics.backend.dto.response.OrderResponseDTO;
import com.slneurorobotics.backend.dto.request.CheckoutSessionRequest;
import com.slneurorobotics.backend.dto.response.CheckoutSessionResponse;
import com.slneurorobotics.backend.service.CheckoutService;
import com.slneurorobotics.backend.service.OrderService;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/checkout")
@RequiredArgsConstructor
@Slf4j
public class CheckoutController {

    private final CheckoutService checkoutService;
    private final OrderService orderService;

    @Value("${stripe.webhook.secret:}")
    private String stripeWebhookSecret;

    /**
     * Complete checkout flow: Create temp order + Stripe session
     */
    @PostMapping("/session")
    public ResponseEntity<?> createCheckoutSession(@Valid @RequestBody CreateTempOrderDTO createOrderDTO) {
        try {
            log.info("Starting checkout process for user: {}", createOrderDTO.getUserId());

            // Step 1: Create temp order first
            OrderResponseDTO tempOrder = orderService.createTempOrder(createOrderDTO);
            log.info("Created temp order with ID: {}", tempOrder.getOrderId());

            // Step 2: Create Stripe session with order details
            CheckoutSessionRequest sessionRequest = new CheckoutSessionRequest();
            sessionRequest.setOrderId(tempOrder.getOrderId());
            sessionRequest.setAmount(tempOrder.getTotalAmount()
                    .multiply(BigDecimal.valueOf(100))  // Convert to cents
                    .longValue());
            sessionRequest.setCustomerEmail(createOrderDTO.getCustomerEmail());

            Session session = checkoutService.createSession(sessionRequest);

            // Step 3: Update order with Stripe session ID
            orderService.updateOrderWithStripeSession(tempOrder.getOrderId(), session.getId());

            // Return session info to frontend
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("sessionId", session.getId());
            response.put("orderId", tempOrder.getOrderId());
            response.put("sessionUrl", session.getUrl());

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            log.error("Error in checkout process: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "success", false,
                            "message", e.getMessage()
                    ));
        } catch (Exception e) {
            log.error("Unexpected error in checkout process", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "success", false,
                            "message", "Checkout failed. Please try again."
                    ));
        }
    }

    /**
     * Alternative: Create session for existing order
     */
    @PostMapping("/session-for-order/{orderId}")
    public ResponseEntity<?> createSessionForExistingOrder(@PathVariable Long orderId) {
        try {
            log.info("Creating Stripe session for existing order: {}", orderId);

            // Get existing order
            OrderResponseDTO order = orderService.getOrderById(orderId);

            // Validate order can be paid
            if (!"PENDING".equals(order.getStatus())) {
                return ResponseEntity.badRequest()
                        .body(Map.of(
                                "success", false,
                                "message", "Order cannot be paid. Status: " + order.getStatus()
                        ));
            }

            // Create Stripe session
            CheckoutSessionRequest sessionRequest = new CheckoutSessionRequest();
            sessionRequest.setOrderId(orderId);
            sessionRequest.setAmount(order.getTotalAmount()
                    .multiply(BigDecimal.valueOf(100))
                    .longValue());

            Session session = checkoutService.createSession(sessionRequest);

            // Update order with session ID
            orderService.updateOrderWithStripeSession(orderId, session.getId());

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("sessionId", session.getId());
            response.put("orderId", orderId);
            response.put("sessionUrl", session.getUrl());

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            log.error("Error creating session for order {}: {}", orderId, e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "success", false,
                            "message", e.getMessage()
                    ));
        } catch (Exception e) {
            log.error("Unexpected error creating session for order: {}", orderId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "success", false,
                            "message", "Failed to create payment session"
                    ));
        }
    }

    /**
     * Verify payment status
     */
    @GetMapping("/verify-payment/{sessionId}")
    public ResponseEntity<Map<String, Object>> verifyPayment(@PathVariable String sessionId) {
        try {
            log.info("Verifying payment for session: {}", sessionId);

            // Retrieve the session from Stripe
            Session session = Session.retrieve(sessionId);
            Map<String, Object> response = new HashMap<>();

            // Check if payment was successful
            if ("complete".equals(session.getStatus()) && "paid".equals(session.getPaymentStatus())) {
                response.put("valid", true);
                response.put("amount", session.getAmountTotal());
                response.put("currency", session.getCurrency());
                response.put("sessionId", sessionId);

                // Handle payment success (update order status)
                try {
                    checkoutService.handlePaymentSuccess(sessionId);
                    response.put("orderUpdated", true);
                } catch (Exception e) {
                    log.warn("Failed to update order status: {}", e.getMessage());
                    response.put("orderUpdated", false);
                }

                return ResponseEntity.ok(response);
            } else {
                response.put("valid", false);
                response.put("status", session.getStatus());
                response.put("paymentStatus", session.getPaymentStatus());
                return ResponseEntity.badRequest().body(response);
            }

        } catch (Exception e) {
            log.error("Error verifying payment for session {}: {}", sessionId, e.getMessage());
            Map<String, Object> response = new HashMap<>();
            response.put("valid", false);
            response.put("error", "Invalid session or verification failed");
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * Stripe webhook endpoint
     */
    @PostMapping("/webhook")
    public ResponseEntity<String> handleStripeWebhook(
            HttpServletRequest request,
            @RequestHeader(value = "Stripe-Signature", required = false) String sigHeader) {

        if (stripeWebhookSecret.isEmpty()) {
            log.warn("Stripe webhook secret not configured");
            return ResponseEntity.ok("Webhook received but not processed (no secret)");
        }

        String payload;
        try {
            payload = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));
        } catch (IOException e) {
            log.error("Error reading webhook payload", e);
            return ResponseEntity.badRequest().body("Invalid payload");
        }

        Event event;
        try {
            event = Webhook.constructEvent(payload, sigHeader, stripeWebhookSecret);
        } catch (SignatureVerificationException e) {
            log.error("Invalid webhook signature", e);
            return ResponseEntity.badRequest().body("Invalid signature");
        }

        try {
            log.info("Processing Stripe webhook event: {}", event.getType());

            switch (event.getType()) {
                case "checkout.session.completed":
                    checkoutService.handleCheckoutSessionCompleted(event);
                    break;
                case "payment_intent.succeeded":
                    checkoutService.handlePaymentIntentSucceeded(event);
                    break;
                case "payment_intent.payment_failed":
                    checkoutService.handlePaymentIntentFailed(event);
                    break;
                case "checkout.session.expired":
                    checkoutService.handleCheckoutSessionExpired(event);
                    break;
                default:
                    log.info("Unhandled event type: {}", event.getType());
            }

            return ResponseEntity.ok("Webhook processed successfully");

        } catch (Exception e) {
            log.error("Error processing webhook event: {}", event.getType(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Webhook processing failed");
        }
    }

    /**
     * Handle payment success redirect
     */
    @GetMapping("/success")
    public ResponseEntity<?> handlePaymentSuccess(@RequestParam String session_id) {
        try {
            log.info("Processing payment success redirect for session: {}", session_id);

            checkoutService.handlePaymentSuccess(session_id);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Payment processed successfully",
                    "sessionId", session_id
            ));

        } catch (Exception e) {
            log.error("Error processing payment success: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "success", false,
                            "message", "Failed to process payment confirmation"
                    ));
        }
    }

    /**
     * Handle payment cancellation redirect
     */
    @GetMapping("/cancel")
    public ResponseEntity<?> handlePaymentCancel(@RequestParam String session_id) {
        try {
            log.info("Processing payment cancellation for session: {}", session_id);

            checkoutService.handlePaymentCancel(session_id);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Payment cancelled",
                    "sessionId", session_id
            ));

        } catch (Exception e) {
            log.error("Error processing payment cancellation: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "success", false,
                            "message", "Failed to process cancellation"
                    ));
        }
    }
}