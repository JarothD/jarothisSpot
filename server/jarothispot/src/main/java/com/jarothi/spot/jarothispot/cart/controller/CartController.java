package com.jarothi.spot.jarothispot.cart.controller;

import com.jarothi.spot.jarothispot.cart.dto.AddCartItemRequest;
import com.jarothi.spot.jarothispot.cart.dto.CartDTO;
import com.jarothi.spot.jarothispot.cart.dto.UpdateCartItemRequest;
import com.jarothi.spot.jarothispot.cart.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/cart")
@Tag(name = "Cart", description = "Cart management operations")
@SecurityRequirement(name = "Bearer Authentication")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    @Operation(summary = "Get current user's cart", description = "Retrieves the shopping cart for the authenticated user")
    public ResponseEntity<CartDTO> getMyCart() {
        CartDTO cart = cartService.getMyCart();
        return ResponseEntity.ok(cart);
    }

    @PostMapping("/items")
    @Operation(summary = "Add item to cart", description = "Adds a product to the cart or increases quantity if already present")
    public ResponseEntity<CartDTO> addItem(@Valid @RequestBody AddCartItemRequest request) {
        CartDTO cart = cartService.addItem(request);
        return ResponseEntity.ok(cart);
    }

    @PatchMapping("/items/{itemId}")
    @Operation(summary = "Update cart item quantity", description = "Updates the quantity of a specific cart item")
    public ResponseEntity<CartDTO> updateItem(
            @PathVariable UUID itemId,
            @Valid @RequestBody UpdateCartItemRequest request) {
        CartDTO cart = cartService.updateItem(itemId, request);
        return ResponseEntity.ok(cart);
    }

    @DeleteMapping("/items/{itemId}")
    @Operation(summary = "Remove item from cart", description = "Removes a specific item from the cart")
    public ResponseEntity<Void> removeItem(@PathVariable UUID itemId) {
        cartService.removeItem(itemId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping
    @Operation(summary = "Clear cart", description = "Removes all items from the cart")
    public ResponseEntity<Void> clear() {
        cartService.clear();
        return ResponseEntity.noContent().build();
    }
}
