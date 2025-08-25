package com.slneurorobotics.backend.service;

import com.slneurorobotics.backend.dto.request.CheckoutSessionRequest;
import com.stripe.model.Price;
import com.stripe.model.checkout.Session;
import com.stripe.param.PriceCreateParams;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.stereotype.Service;

@Service
public class CheckoutService {
    public Session createSession(CheckoutSessionRequest req) throws Exception {
        // Create a dynamic price for the subtotal (amount in cents)
        PriceCreateParams priceParams = PriceCreateParams.builder()
                .setUnitAmount(req.getAmount())  // Total amount in cents
                .setCurrency("usd")  // Currency
                .setProductData(  // Inline product data
                        PriceCreateParams.ProductData.builder()
                                .setName("Custom Product")  // Name of your product
                                .build()
                )
                .build();

        // Create the price object dynamically
        Price price = Price.create(priceParams);

        // Create the Stripe Checkout session using the dynamically created price
        SessionCreateParams sessionParams = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)  // One-time payment mode
                .addLineItem(
                        SessionCreateParams.LineItem.builder()
                                .setPrice(price.getId())  // Use the dynamically created price ID
                                .setQuantity(1L)
                                .build()
                )
                .setSuccessUrl("http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}")
                .setCancelUrl("http://localhost:5173/cancel")
                .build();

        // Create and return the session
        return Session.create(sessionParams);
    }
}
