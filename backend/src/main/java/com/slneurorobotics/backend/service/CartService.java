package com.slneurorobotics.backend.service;


import com.slneurorobotics.backend.dto.request.AddToCartRequest;
import com.slneurorobotics.backend.dto.response.CartItemResponse;
import com.slneurorobotics.backend.dto.response.CartResponse;
import com.slneurorobotics.backend.dto.response.ShippingAddressResponseDTO;
import com.slneurorobotics.backend.entity.CartItem;
import com.slneurorobotics.backend.entity.Product;
import com.slneurorobotics.backend.entity.Shipping_address;
import com.slneurorobotics.backend.entity.ShoppingCart;
import com.slneurorobotics.backend.repository.CartItemRepository;
import com.slneurorobotics.backend.repository.ProductRepository;
import com.slneurorobotics.backend.repository.ShippingAddressRepository;
import com.slneurorobotics.backend.repository.ShoppingCartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ShoppingCartRepository shoppingCartRepository;
    private final ProductRepository productRepository;
    private final ShippingAddressRepository shippingAddressRepository;

    public void addToCart(AddToCartRequest request) {

        ShoppingCart cart = getOrCreateCart(request.getUserId());


        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));


        Optional<CartItem> existingItem = cartItemRepository
                .findByCartIdAndProductId(cart.getCartId(), request.getProductId());

        CartItem cartItem;
        if (existingItem.isPresent()) {
            // Update quantity if item already exists
//            cartItem = existingItem.get();
//            cartItem.setQuantity(cartItem.getQuantity() + request.getQuantity());
//            cartItem.setUpdatedBy(request.getUserId());
            throw new RuntimeException("Product already in cart");
        } else {
            // Create new cart item
            cartItem = new CartItem();
            cartItem.setCartId(cart.getCartId());
            cartItem.setProductId(request.getProductId());
            cartItem.setQuantity(request.getQuantity());
            cartItem.setUnitPrice(product.getPrice());
            cartItem.setCreatedBy(request.getUserId());
            cartItem.setUpdatedBy(request.getUserId());
        }

       cartItemRepository.save(cartItem);

    }

    public CartResponse getCartByUserId(Long userId) {
        ShoppingCart cart = shoppingCartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found for user"));

        List<CartItem> cartItems = cartItemRepository.findByCartId(cart.getCartId());

        List<CartItemResponse> itemResponses = cartItems.stream()
                .map(item -> {
                    Product product = productRepository.findById(item.getProductId()).orElse(null);
                    return convertToCartItemResponse(item, product);
                })
                .collect(Collectors.toList());

        BigDecimal totalAmount = cartItems.stream()
                .map(CartItem::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return CartResponse.builder()
                .cartId(cart.getCartId())
                .userId(cart.getUserId())
                .items(itemResponses)
                .totalItems(cartItems.size())
                .totalAmount(totalAmount)
                .createdAt(cart.getCreatedAt())
                .updatedAt(cart.getUpdatedAt())
                .build();
    }

    public CartItemResponse updateCartItemQuantity(Long cartItemId, Integer quantity) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (quantity <= 0) {
            cartItemRepository.delete(cartItem);
            return null;
        }

        cartItem.setQuantity(quantity);
        CartItem updatedItem = cartItemRepository.save(cartItem);

        Product product = productRepository.findById(updatedItem.getProductId()).orElse(null);
        return convertToCartItemResponse(updatedItem, product);
    }

    public void removeFromCart(Long cartItemId) {
        cartItemRepository.deleteById(cartItemId);
    }

    public void clearCart(Long userId) {
        ShoppingCart cart = shoppingCartRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Cart not found for user"));
        cartItemRepository.deleteByCartId(cart.getCartId());
    }

    private ShoppingCart getOrCreateCart(Long userId) {
        return shoppingCartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    ShoppingCart newCart = new ShoppingCart();
                    newCart.setUserId(userId);
                    newCart.setCreatedBy(userId);
                    newCart.setUpdatedBy(userId);
                    return shoppingCartRepository.save(newCart);
                });
    }

    private CartItemResponse convertToCartItemResponse(CartItem cartItem, Product product) {
        return CartItemResponse.builder()
                .cartItemId(cartItem.getCartItemId())
                .cartId(cartItem.getCartId())
                .productId(cartItem.getProductId())
                .productName(product != null ? product.getName() : "Unknown Product")
                .productImage(product != null && product.getImages() != null && !product.getImages().isEmpty()
                        ? product.getImages().get(0).getImageUrl().replace("C:\\Users\\USER", "http://localhost:8080")
                        : null)
                .quantity(cartItem.getQuantity())
                .unitPrice(cartItem.getUnitPrice())
                .totalPrice(cartItem.getTotalPrice())
                .createdAt(cartItem.getCreatedAt())
                .updatedAt(cartItem.getUpdatedAt())
                .build();
    }

    public Integer getDistinctItemCount(Long userId) {
        return cartItemRepository.countDistinctItemsByUserId(userId);
    }

    public ShippingAddressResponseDTO getShippingAddress(Long userId) {
        try {
            Shipping_address shippingAddress = shippingAddressRepository.findByDefaultAddress(userId);

            if (shippingAddress == null) {
                throw new RuntimeException("No default shipping address found for user: " + userId);
            }

            ShippingAddressResponseDTO shippingAddressResponseDTO = new ShippingAddressResponseDTO();
            shippingAddressResponseDTO.setName(shippingAddress.getFull_name());
            shippingAddressResponseDTO.setStreetAddress(shippingAddress.getStreet_address());
            shippingAddressResponseDTO.setCity(shippingAddress.getCity());
            shippingAddressResponseDTO.setState(shippingAddress.getState());
            shippingAddressResponseDTO.setZipCode(shippingAddress.getZipcode());
            return shippingAddressResponseDTO;

        } catch (Exception e) {
            throw new RuntimeException("Failed to retrieve shipping address", e);
        }
    }
}
