package com.slneurorobotics.backend.service;

import com.slneurorobotics.backend.dto.request.CreateTempOrderDTO;
import com.slneurorobotics.backend.dto.response.OrderResponseDTO;
import com.slneurorobotics.backend.entity.Order;
import com.slneurorobotics.backend.entity.OrderItem;
import com.slneurorobotics.backend.entity.Payment;
import com.slneurorobotics.backend.repository.OrderRepository;
import com.slneurorobotics.backend.repository.OrderItemRepository;
import com.slneurorobotics.backend.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final PaymentRepository paymentRepository;

    /**
     * Create a temporary order (before payment)
     */
    public OrderResponseDTO createTempOrder(CreateTempOrderDTO createOrderDTO) {
        log.info("Creating temp order for user: {}", createOrderDTO.getUserId());

        // Validate order data
        validateOrderData(createOrderDTO);

        // Check if user has too many active temp orders
        long activeTempOrders = orderRepository.countByUserIdAndStatus(
                createOrderDTO.getUserId(), Order.OrderStatus.TEMP);

        if (activeTempOrders >= 3) {
            throw new RuntimeException("Too many pending orders. Please complete or cancel existing orders.");
        }

        // Create order entity
        Order order = new Order();
        order.setUserId(createOrderDTO.getUserId());
        order.setTotalAmount(createOrderDTO.getTotalAmount());
        order.setStatus(Order.OrderStatus.TEMP);
        order.setSource(createOrderDTO.getSource());
        order.setExpiresAt(LocalDateTime.now().plusMinutes(30)); // 30 min expiry
        order.setCreatedBy(createOrderDTO.getUserId());

        // Save order
        Order savedOrder = orderRepository.save(order);

        // Create order items
        List<OrderItem> orderItems = createOrderDTO.getItems().stream()
                .map(itemDTO -> {
                    OrderItem orderItem = new OrderItem();
                    orderItem.setOrderId(savedOrder.getOrderId());
                    orderItem.setProductId(itemDTO.getProductId());
                    orderItem.setQuantity(itemDTO.getQuantity());
                    orderItem.setPrice(itemDTO.getPrice());
                    orderItem.setCreatedBy(createOrderDTO.getUserId());
                    return orderItem;
                })
                .collect(Collectors.toList());

        orderItemRepository.saveAll(orderItems);

        log.info("Created temp order with ID: {}", savedOrder.getOrderId());
        return convertToResponseDTO(savedOrder, orderItems, null);
    }

    /**
     * Confirm order after successful payment
     */
    public OrderResponseDTO confirmOrder(Long orderId, String stripePaymentIntentId, BigDecimal paidAmount) {
        log.info("Confirming order: {} with payment intent: {}", orderId, stripePaymentIntentId);

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));

        // Validate order can be confirmed
        if (order.getStatus() != Order.OrderStatus.TEMP) {
            throw new RuntimeException("Order is not in TEMP status, cannot confirm");
        }

        // Validate payment amount matches order total
        if (paidAmount.compareTo(order.getTotalAmount()) != 0) {
            log.warn("Payment amount mismatch. Order: {}, Paid: {}", order.getTotalAmount(), paidAmount);
        }

        // Update order status and payment intent ID
        int updated = orderRepository.updateOrderStatusAndPaymentIntent(
                orderId, Order.OrderStatus.PAID, stripePaymentIntentId, LocalDateTime.now());

        if (updated == 0) {
            throw new RuntimeException("Failed to update order status");
        }

        // Create payment record
        Payment payment = new Payment();
        payment.setOrderId(orderId);
        payment.setStripePaymentIntentId(stripePaymentIntentId);
        payment.setAmount(paidAmount);
        payment.setStatus(Payment.PaymentStatus.SUCCEEDED);
        payment.setCurrency("USD");
        payment.setCreatedBy(order.getUserId());

        paymentRepository.save(payment);

        // Get updated order with items and payment
        Order confirmedOrder = orderRepository.findById(orderId).get();
        List<OrderItem> orderItems = orderItemRepository.findByOrderIdOrderByCreatedAt(orderId);

        log.info("Order confirmed successfully: {}", orderId);
        return convertToResponseDTO(confirmedOrder, orderItems, payment);
    }

    /**
     * Cancel order
     */
    public void cancelOrder(Long orderId, String reason) {
        log.info("Cancelling order: {} - Reason: {}", orderId, reason);

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));

        if (order.getStatus() == Order.OrderStatus.PAID) {
            throw new RuntimeException("Cannot cancel paid order");
        }

        orderRepository.updateOrderStatus(orderId, Order.OrderStatus.CANCELLED, LocalDateTime.now());
        log.info("Order cancelled: {}", orderId);
    }

    /**
     * Get order by ID
     */
    @Transactional(readOnly = true)
    public OrderResponseDTO getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));

        List<OrderItem> orderItems = orderItemRepository.findByOrderIdWithProduct(orderId);
        Payment payment = paymentRepository.findByOrderId(orderId).orElse(null);

        return convertToResponseDTO(order, orderItems, payment);
    }

    /**
     * Get user's order history (exclude temp orders)
     */
    @Transactional(readOnly = true)
    public List<OrderResponseDTO> getUserOrderHistory(Long userId) {
        List<Order> orders = orderRepository.findUserOrderHistory(userId);

        return orders.stream()
                .map(order -> {
                    List<OrderItem> items = orderItemRepository.findByOrderIdWithProduct(order.getOrderId());
                    Payment payment = paymentRepository.findByOrderId(order.getOrderId()).orElse(null);
                    return convertToResponseDTO(order, items, payment);
                })
                .collect(Collectors.toList());
    }

    /**
     * Get order by Stripe session ID
     */
    @Transactional(readOnly = true)
    public Optional<OrderResponseDTO> getOrderByStripeSessionId(String stripeSessionId) {
        return orderRepository.findByStripeSessionId(stripeSessionId)
                .map(order -> {
                    List<OrderItem> items = orderItemRepository.findByOrderIdOrderByCreatedAt(order.getOrderId());
                    Payment payment = paymentRepository.findByOrderId(order.getOrderId()).orElse(null);
                    return convertToResponseDTO(order, items, payment);
                });
    }

    /**
     * Cleanup expired temp orders (scheduled job)
     */
    public void cleanupExpiredOrders() {
        log.info("Starting cleanup of expired temp orders");

        LocalDateTime now = LocalDateTime.now();
        int markedAsCancelled = orderRepository.markExpiredOrdersAsCancelled(now, now);

        log.info("Marked {} expired orders as cancelled", markedAsCancelled);
    }

    /**
     * Update order with Stripe session ID
     */
    public void updateOrderWithStripeSession(Long orderId, String stripeSessionId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));

        order.setStripeSessionId(stripeSessionId);
        order.setUpdatedAt(LocalDateTime.now());
        orderRepository.save(order);
    }

    // Private helper methods

    private void validateOrderData(CreateTempOrderDTO createOrderDTO) {
        if (createOrderDTO.getItems().isEmpty()) {
            throw new RuntimeException("Order must contain at least one item");
        }

        // Validate total amount matches items
        BigDecimal calculatedTotal = createOrderDTO.getItems().stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        if (calculatedTotal.compareTo(createOrderDTO.getTotalAmount()) != 0) {
            throw new RuntimeException("Total amount does not match items total");
        }
    }

    private OrderResponseDTO convertToResponseDTO(Order order, List<OrderItem> orderItems, Payment payment) {
        OrderResponseDTO dto = new OrderResponseDTO();
        dto.setOrderId(order.getOrderId());
        dto.setUserId(order.getUserId());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setStatus(order.getStatus());
        dto.setSource(order.getSource());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setUpdatedAt(order.getUpdatedAt());
        dto.setStripeSessionId(order.getStripeSessionId());

        // Convert order items
        // Note: You'll need to implement OrderItemResponseDTO conversion
        // This is a placeholder - implement based on your OrderItemResponseDTO structure

        dto.setTotalItems(orderItems.size());
        dto.setSubtotal(order.getTotalAmount()); // Simplified - implement proper calculation

        // Convert payment if exists
        if (payment != null) {
            // Note: You'll need to implement PaymentResponseDTO conversion
            // This is a placeholder - implement based on your PaymentResponseDTO structure
        }

        return dto;
    }
}