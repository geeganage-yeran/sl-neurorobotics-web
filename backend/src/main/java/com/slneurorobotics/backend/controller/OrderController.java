package com.slneurorobotics.backend.controller;

import com.slneurorobotics.backend.dto.request.CreateTempOrderDTO;
import com.slneurorobotics.backend.dto.response.OrderResponseDTO;
import com.slneurorobotics.backend.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Slf4j
public class OrderController {

    private final OrderService orderService;


    /**
     * Create temporary order (before payment)
     */
    @PostMapping("/create-temp")
    public ResponseEntity<?> createTempOrder(@Valid @RequestBody CreateTempOrderDTO createOrderDTO) {
        try {
            log.info("Creating temp order for user: {}", createOrderDTO.getUserId());

            OrderResponseDTO orderResponse = orderService.createTempOrder(createOrderDTO);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of(
                            "success", true,
                            "message", "Temp order created successfully",
                            "data", orderResponse
                    ));

        } catch (RuntimeException e) {
            log.error("Error creating temp order: {}", e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "success", false,
                            "message", e.getMessage()
                    ));
        } catch (Exception e) {
            log.error("Unexpected error creating temp order", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "success", false,
                            "message", "An unexpected error occurred"
                    ));
        }
    }


    /**
     * Get order by ID
     */
    @GetMapping("/{orderId}")
    public ResponseEntity<?> getOrder(@PathVariable Long orderId) {
        try {
            log.info("Fetching order: {}", orderId);

            OrderResponseDTO order = orderService.getOrderById(orderId);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", order
            ));

        } catch (RuntimeException e) {
            log.error("Error fetching order {}: {}", orderId, e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "success", false,
                            "message", e.getMessage()
                    ));
        } catch (Exception e) {
            log.error("Unexpected error fetching order: {}", orderId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "success", false,
                            "message", "An unexpected error occurred"
                    ));
        }
    }


    /**
     * Get user's order history
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserOrders(@PathVariable Long userId) {
        try {
            log.info("Fetching orders for user: {}", userId);

            List<OrderResponseDTO> orders = orderService.getUserOrderHistory(userId);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "data", orders,
                    "count", orders.size()
            ));

        } catch (Exception e) {
            log.error("Error fetching orders for user {}: {}", userId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "success", false,
                            "message", "Failed to fetch orders"
                    ));
        }
    }


    /**
     * Cancel order
     */
    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<?> cancelOrder(
            @PathVariable Long orderId,
            @RequestBody(required = false) Map<String, String> requestBody) {
        try {
            log.info("Cancelling order: {}", orderId);

            String reason = requestBody != null ? requestBody.get("reason") : "User cancelled";
            orderService.cancelOrder(orderId, reason);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Order cancelled successfully"
            ));

        } catch (RuntimeException e) {
            log.error("Error cancelling order {}: {}", orderId, e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "success", false,
                            "message", e.getMessage()
                    ));
        } catch (Exception e) {
            log.error("Unexpected error cancelling order: {}", orderId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "success", false,
                            "message", "An unexpected error occurred"
                    ));
        }
    }


    /**
     * Get order by Stripe session ID (useful for payment callbacks)
     */
    @GetMapping("/stripe-session/{sessionId}")
    public ResponseEntity<?> getOrderByStripeSession(@PathVariable String sessionId) {
        try {
            log.info("Fetching order by Stripe session: {}", sessionId);

            return orderService.getOrderByStripeSessionId(sessionId)
                    .map(order -> ResponseEntity.ok(Map.of(
                            "success", true,
                            "data", order
                    )))
                    .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body(Map.of(
                                    "success", false,
                                    "message", "Order not found for session: " + sessionId
                            )));

        } catch (Exception e) {
            log.error("Error fetching order by Stripe session {}: {}", sessionId, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "success", false,
                            "message", "An unexpected error occurred"
                    ));
        }
    }


    /**
     * Update order with Stripe session ID (internal use)
     */
    @PutMapping("/{orderId}/stripe-session")
    public ResponseEntity<?> updateOrderStripeSession(
            @PathVariable Long orderId,
            @RequestBody Map<String, String> requestBody) {
        try {
            String stripeSessionId = requestBody.get("stripeSessionId");

            if (stripeSessionId == null || stripeSessionId.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of(
                                "success", false,
                                "message", "Stripe session ID is required"
                        ));
            }

            orderService.updateOrderWithStripeSession(orderId, stripeSessionId);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Order updated with Stripe session ID"
            ));

        } catch (RuntimeException e) {
            log.error("Error updating order {} with Stripe session: {}", orderId, e.getMessage());
            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "success", false,
                            "message", e.getMessage()
                    ));
        } catch (Exception e) {
            log.error("Unexpected error updating order with Stripe session: {}", orderId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "success", false,
                            "message", "An unexpected error occurred"
                    ));
        }
    }
}