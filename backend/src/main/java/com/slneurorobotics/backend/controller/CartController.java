package com.slneurorobotics.backend.controller;


import com.slneurorobotics.backend.dto.request.AddToCartRequest;
import com.slneurorobotics.backend.dto.response.CartItemResponse;
import com.slneurorobotics.backend.dto.response.CartResponse;
import com.slneurorobotics.backend.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestBody AddToCartRequest request) {
        try {
            cartService.addToCart(request);
            return ResponseEntity.ok("add addtocart successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/count/{userId}")
    public ResponseEntity<Map<String, Object>> getItemCount(@PathVariable Long userId) {
        try {
            Integer itemCount = cartService.getDistinctItemCount(userId);
            return ResponseEntity.ok(Map.of("count", itemCount));
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("count", 0));
        }
    }

    @GetMapping("/item/{userId}")
    public ResponseEntity<CartResponse> getCartByUserId(@PathVariable Long userId) {
        try {
            CartResponse cart = cartService.getCartByUserId(userId);
            return ResponseEntity.ok(cart);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/update/{cartItemId}")
    public ResponseEntity<CartItemResponse> updateCartItem(
            @PathVariable Long cartItemId,
            @RequestBody Integer quantity) {
        try {
            CartItemResponse response = cartService.updateCartItemQuantity(cartItemId, quantity);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/remove/{cartItemId}")
    public ResponseEntity<Void> removeFromCart(@PathVariable Long cartItemId) {
        try {
            cartService.removeFromCart(cartItemId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
//
//    @DeleteMapping("/clear/{userId}")
//    public ResponseEntity<Void> clearCart(@PathVariable Long userId) {
//        try {
//            cartService.clearCart(userId);
//            return ResponseEntity.ok().build();
//        } catch (Exception e) {
//            return ResponseEntity.badRequest().build();
//        }
//    }
}