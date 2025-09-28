package com.slneurorobotics.backend.service;

import com.slneurorobotics.backend.dto.request.CheckoutSessionRequest;
import com.slneurorobotics.backend.dto.response.OrderResponseDTO;
import com.stripe.model.Price;
import com.stripe.model.checkout.Session;
import com.stripe.model.Event;
import com.stripe.param.PriceCreateParams;
import com.stripe.param.checkout.SessionCreateParams;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Slf4j
public class CheckoutService {

    private final OrderService orderService;
    private final CartService cartService;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    // ✅ Keep your existing method with small improvements
    public Session createSession(CheckoutSessionRequest req) throws Exception {
        log.info("Creating Stripe session for order: {} with amount: {}", req.getOrderId(), req.getAmount());

        // Create a dynamic price for the subtotal (amount in cents)
        PriceCreateParams priceParams = PriceCreateParams.builder()
                .setUnitAmount(req.getAmount())  // Total amount in cents
                .setCurrency("usd")  // Currency
                .setProductData(  // Inline product data
                        PriceCreateParams.ProductData.builder()
                                .setName("SL NeuroRobotics Order #" + req.getOrderId()) // ✅ Better name
                                .build()
                )
                .build();

        // Create the price object dynamically
        Price price = Price.create(priceParams);

        // Create the Stripe Checkout session
        SessionCreateParams.Builder sessionBuilder = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)  // One-time payment mode
                .addLineItem(
                        SessionCreateParams.LineItem.builder()
                                .setPrice(price.getId())  // Use the dynamically created price ID
                                .setQuantity(1L)
                                .build()
                )
                .setSuccessUrl(frontendUrl + "/payment-success?session_id={CHECKOUT_SESSION_ID}")
                .setCancelUrl(frontendUrl + "/payment-failed?session_id={CHECKOUT_SESSION_ID}")
                // ✅ Add metadata to track order
                .putMetadata("orderId", req.getOrderId().toString());

        // ✅ Add customer email if provided
        if (req.getCustomerEmail() != null && !req.getCustomerEmail().trim().isEmpty()) {
            sessionBuilder.setCustomerEmail(req.getCustomerEmail());
        }

        // Create and return the session
        return Session.create(sessionBuilder.build());
    }

    // ✅ FIXED: Now matches your OrderService signature
    public void handlePaymentSuccess(String sessionId) {
        try {
            log.info("Handling payment success for session: {}", sessionId);

            Session session = Session.retrieve(sessionId);
            String orderId = session.getMetadata().get("orderId");

            if (orderId != null) {
                // Get payment intent ID (this is what gets charged)
                String paymentIntentId = session.getPaymentIntent();

                // Convert amount from cents to BigDecimal
                BigDecimal paidAmount = BigDecimal.valueOf(session.getAmountTotal())
                        .divide(BigDecimal.valueOf(100)); // Convert cents to dollars

                // ✅ Now calls with correct parameters
                OrderResponseDTO confirmedOrder=orderService.confirmOrder(
                        Long.parseLong(orderId),
                        paymentIntentId,
                        paidAmount
                );

                if ("CART".equals(confirmedOrder.getSource().toString())) {
                    try {
                        cartService.clearCart(confirmedOrder.getUserId());
                        log.info("Cart cleared for user: {}", confirmedOrder.getUserId());
                    } catch (Exception e) {
                        log.warn("Failed to clear cart for user {}: {}",
                                confirmedOrder.getUserId(), e.getMessage());
                    }
                }

                log.info("Order {} marked as PAID with amount: {}", orderId, paidAmount);
            }
        } catch (Exception e) {
            log.error("Error handling payment success for session {}: {}", sessionId, e.getMessage());
            throw new RuntimeException("Failed to process payment success", e);
        }
    }

    public void handlePaymentCancel(String sessionId) {
        try {
            log.info("Handling payment cancellation for session: {}", sessionId);

            Session session = Session.retrieve(sessionId);
            String orderId = session.getMetadata().get("orderId");

            if (orderId != null) {
                // Order stays as TEMP, user can retry payment
                log.info("Payment cancelled for order: {}", orderId);
            }
        } catch (Exception e) {
            log.error("Error handling payment cancellation for session {}: {}", sessionId, e.getMessage());
        }
    }

    // ✅ Webhook event handlers
    public void handleCheckoutSessionCompleted(Event event) {
        try {
            Session session = (Session) event.getDataObjectDeserializer().getObject().orElse(null);
            if (session != null) {
                handlePaymentSuccess(session.getId());
            }
        } catch (Exception e) {
            log.error("Error handling checkout session completed event", e);
        }
    }

    public void handlePaymentIntentSucceeded(Event event) {
        log.info("Payment intent succeeded: {}", event.getId());
        // Additional payment confirmation logic if needed
    }

    public void handlePaymentIntentFailed(Event event) {
        log.warn("Payment intent failed: {}", event.getId());
        // Handle payment failure logic if needed
    }

    public void handleCheckoutSessionExpired(Event event) {
        log.info("Checkout session expired: {}", event.getId());
        // Handle session expiration if needed
    }
}