package com.jarothi.spot.jarothispot.cart.service;

import com.jarothi.spot.jarothispot.cart.Cart;
import com.jarothi.spot.jarothispot.cart.CartItem;
import com.jarothi.spot.jarothispot.cart.dto.AddCartItemRequest;
import com.jarothi.spot.jarothispot.cart.dto.CartDTO;
import com.jarothi.spot.jarothispot.cart.dto.CartItemDTO;
import com.jarothi.spot.jarothispot.cart.dto.UpdateCartItemRequest;
import com.jarothi.spot.jarothispot.cart.repository.CartRepository;
import com.jarothi.spot.jarothispot.cart.repository.CartItemRepository;
import com.jarothi.spot.jarothispot.catalog.Product;
import com.jarothi.spot.jarothispot.catalog.ProductRepository;
import com.jarothi.spot.jarothispot.catalog.exception.InsufficientStockException;
import com.jarothi.spot.jarothispot.user.User;
import com.jarothi.spot.jarothispot.user.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartService(CartRepository cartRepository, 
                      CartItemRepository cartItemRepository,
                      ProductRepository productRepository,
                      UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public CartDTO getMyCart() {
        User currentUser = getCurrentUser();
        Optional<Cart> cartOpt = cartRepository.findByUserIdWithItems(currentUser.getId());
        
        if (cartOpt.isEmpty()) {
            // Return empty cart
            return new CartDTO(null, List.of(), BigDecimal.ZERO);
        }
        
        Cart cart = cartOpt.get();
        return mapToCartDTO(cart);
    }

    public CartDTO addItem(AddCartItemRequest request) {
        User currentUser = getCurrentUser();
        Product product = productRepository.findById(request.getProductId())
            .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        if (!product.isActive()) {
            throw new IllegalArgumentException("Product is not available");
        }

        // Check stock availability
        if (product.getStock() < request.getQty()) {
            throw new InsufficientStockException(product.getId(), request.getQty(), product.getStock());
        }

        // Get or create cart
        Cart cart = cartRepository.findByUserId(currentUser.getId())
            .orElseGet(() -> {
                Cart newCart = new Cart(currentUser);
                return cartRepository.save(newCart);
            });

        // Check if item already exists in cart
        Optional<CartItem> existingItemOpt = cartItemRepository
            .findByCartIdAndProductId(cart.getId(), product.getId());

        if (existingItemOpt.isPresent()) {
            // Update existing item quantity
            CartItem existingItem = existingItemOpt.get();
            int newQuantity = existingItem.getQuantity() + request.getQty();
            
            // Check if new total quantity exceeds stock
            if (product.getStock() < newQuantity) {
                throw new InsufficientStockException(product.getId(), newQuantity, product.getStock());
            }
            
            existingItem.setQuantity(newQuantity);
            cartItemRepository.save(existingItem);
        } else {
            // Create new cart item
            CartItem newItem = new CartItem(cart, product, request.getQty());
            cartItemRepository.save(newItem);
            cart.addItem(newItem);
        }

        // Reload cart with items to get updated data
        cart = cartRepository.findByUserIdWithItems(currentUser.getId()).orElse(cart);
        return mapToCartDTO(cart);
    }

    public CartDTO updateItem(UUID itemId, UpdateCartItemRequest request) {
        User currentUser = getCurrentUser();
        CartItem cartItem = cartItemRepository.findById(itemId)
            .orElseThrow(() -> new IllegalArgumentException("Cart item not found"));

        // Validate that the item belongs to the user's cart
        if (!cartItem.getCart().getUser().getId().equals(currentUser.getId())) {
            throw new IllegalArgumentException("Cart item does not belong to current user");
        }

        cartItem.setQuantity(request.getQty());
        cartItemRepository.save(cartItem);

        // Reload cart with items to get updated data
        Cart cart = cartRepository.findByUserIdWithItems(currentUser.getId())
            .orElseThrow(() -> new IllegalStateException("Cart not found after update"));
        return mapToCartDTO(cart);
    }

    public void removeItem(UUID itemId) {
        User currentUser = getCurrentUser();
        CartItem cartItem = cartItemRepository.findById(itemId)
            .orElseThrow(() -> new IllegalArgumentException("Cart item not found"));

        // Validate that the item belongs to the user's cart
        if (!cartItem.getCart().getUser().getId().equals(currentUser.getId())) {
            throw new IllegalArgumentException("Cart item does not belong to current user");
        }

        cartItemRepository.delete(cartItem);
    }

    public void clear() {
        User currentUser = getCurrentUser();
        Optional<Cart> cartOpt = cartRepository.findByUserId(currentUser.getId());
        
        if (cartOpt.isPresent()) {
            Cart cart = cartOpt.get();
            cartItemRepository.deleteByCartId(cart.getId());
            cart.clearItems();
        }
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("No authenticated user found");
        }
        
        String email = authentication.getName();
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalStateException("Current user not found in database"));
    }

    private CartDTO mapToCartDTO(Cart cart) {
        List<CartItemDTO> itemDTOs = cart.getItems().stream()
            .map(this::mapToCartItemDTO)
            .toList();

        BigDecimal subtotal = itemDTOs.stream()
            .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQty())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new CartDTO(cart.getId(), itemDTOs, subtotal);
    }

    private CartItemDTO mapToCartItemDTO(CartItem cartItem) {
        Product product = cartItem.getProduct();
        return new CartItemDTO(
            cartItem.getId(),
            product.getId(),
            product.getTitle(),
            product.getImageUrl(),
            product.getPrice(),
            cartItem.getQuantity()
        );
    }
}
