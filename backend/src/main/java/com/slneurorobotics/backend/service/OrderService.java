package com.slneurorobotics.backend.service;

import com.slneurorobotics.backend.dto.request.CreateTempOrderDTO;
import com.slneurorobotics.backend.dto.request.ShippingAddressRequestDTO;
import com.slneurorobotics.backend.dto.response.OrderResponseDTO;
import com.slneurorobotics.backend.dto.response.OrderItemResponseDTO;
import com.slneurorobotics.backend.dto.response.ShippingAddressResponseDTO;
import com.slneurorobotics.backend.entity.*;
import com.slneurorobotics.backend.repository.OrderRepository;
import com.slneurorobotics.backend.repository.OrderItemRepository;
import com.slneurorobotics.backend.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Sort;
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
        order.setShippingId(createOrderDTO.getShippingAddressId());
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
     * List all orders for admin
     */

    public List<OrderResponseDTO> getAllOrdersWithDetails(String status) {
        List<Order> orders;

        if (status != null && !status.isEmpty()) {
            // Get orders with specific status but exclude TEMP
            orders = orderRepository.findByStatusAndStatusNot(
                    Order.OrderStatus.valueOf(status.toUpperCase()),
                    Order.OrderStatus.TEMP,
                    Sort.by("createdDate").descending()
            );
        } else {
            // Get all orders except TEMP
            orders = orderRepository.findByStatusNot(
                    Order.OrderStatus.TEMP,
                    Sort.by("createdAt").descending()
            );
        }

        return orders.stream()
                .map(this::convertToOrderResponseWithFullDetails)
                .collect(Collectors.toList());
    }

    private OrderResponseDTO convertToOrderResponseWithFullDetails(Order order) {
        // Fetch user details
        User user = order.getUser();

        // Fetch shipping address details
        Shipping_address shippingAddress = order.getShippingAddress();
        ShippingAddressResponseDTO shippingAddressDTO = null;
        if (shippingAddress != null) {
            shippingAddressDTO = new ShippingAddressResponseDTO();
            shippingAddressDTO.setId(shippingAddress.getId());
            shippingAddressDTO.setName(shippingAddress.getFull_name());
            shippingAddressDTO.setStreetAddress(shippingAddress.getStreet_address());
            shippingAddressDTO.setCity(shippingAddress.getCity());
            shippingAddressDTO.setState(shippingAddress.getState());
            shippingAddressDTO.setZipCode(shippingAddress.getZipcode());
            shippingAddressDTO.setCountry(shippingAddress.getCountry());
        }


        // Convert order items (assuming you have OrderItemResponseDTO)
        List<OrderItemResponseDTO> orderItemDTOs = order.getOrderItems().stream()
                .map(this::convertToOrderItemResponseDTO) // You'll need this method
                .collect(Collectors.toList());

        return OrderResponseDTO.builder()
                .orderId(order.getOrderId())
                .userId(user.getId())
                .userEmail(user.getEmail())
                .userPhone(user.getContact())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .source(order.getSource())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .items(orderItemDTOs)
                //  .payment(order.getPayment() != null ? convertToPaymentResponseDTO(order.getPayment()) : null)
                .shippingAddressId(shippingAddress != null ? shippingAddress.getId() : null)
                .shippingAddress(shippingAddressDTO)
                //.totalItems(order.)
                .subtotal(order.getTotalAmount())
                //  .discountAmount(order.getDiscountAmount())
                //   .shippingCost(order.getShippingCost())
                // .taxAmount(order.getTaxAmount())
                //  .appliedPromoCode(order.getAppliedPromoCode())
                //   .orderNotes(order.getOrderNotes())
                //  .stripeSessionId(order.getStripeSessionId())
                .trackingNumber(order.getTrackingNumber())
                .trackingLink(order.getTrackingLink())
                .cancellationReason(order.getCancellationReason())
                .build();
    }

    public void updateOrderTracking(Long orderId, String trackingNumber, String trackingLink) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));

        order.setTrackingNumber(trackingNumber);
        order.setTrackingLink(trackingLink);
        order.setStatus(Order.OrderStatus.SHIPPED); // Automatically set to shipped when tracking is added

        orderRepository.save(order);
    }

    public  void cancelOrder(Long orderId, String reason) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));
        order.setStatus(Order.OrderStatus.CANCELLED);
        order.setCancellationReason(reason);
        orderRepository.save(order);
    }

    public void completeOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));
        order.setStatus(Order.OrderStatus.DELIVERED);
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
        dto.setTrackingNumber(order.getTrackingNumber());
        dto.setTrackingLink(order.getTrackingLink());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setStatus(order.getStatus());
        dto.setSource(order.getSource());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setUpdatedAt(order.getUpdatedAt());
        dto.setStripeSessionId(order.getStripeSessionId());

        // Convert order items
        // Note: You'll need to implement OrderItemResponseDTO conversion
        // This is a placeholder - implement based on your OrderItemResponseDTO structure
        List<OrderItemResponseDTO> orderItemDTOs = orderItems.stream()
                .map(this::convertToOrderItemResponseDTO)
                .collect(Collectors.toList());
        dto.setItems(orderItemDTOs);

        dto.setTotalItems(orderItems.size());
        dto.setSubtotal(order.getTotalAmount()); // Simplified - implement proper calculation

        // Convert payment if exists
        if (payment != null) {
            // Note: You'll need to implement PaymentResponseDTO conversion
            // This is a placeholder - implement based on your PaymentResponseDTO structure
        }

        return dto;
    }

    private OrderItemResponseDTO convertToOrderItemResponseDTO(OrderItem orderItem) {
        OrderItemResponseDTO dto = new OrderItemResponseDTO();
        dto.setOrderItemId(orderItem.getOrderId());
        dto.setProductId(orderItem.getProductId());
        dto.setProductName(orderItem.getProduct() != null ? orderItem.getProduct().getName() : null);
        dto.setQuantity(orderItem.getQuantity());
        dto.setPrice(orderItem.getPrice());
        dto.setTotalPrice(orderItem.getTotalPrice());
        return dto;
    }
}