package com.jarothi.spot.jarothispot.order.service;

import com.jarothi.spot.jarothispot.cart.Cart;
import com.jarothi.spot.jarothispot.cart.CartItem;
import com.jarothi.spot.jarothispot.cart.dto.CheckoutRequest;
import com.jarothi.spot.jarothispot.cart.repository.CartRepository;
import com.jarothi.spot.jarothispot.cart.repository.CartItemRepository;
import com.jarothi.spot.jarothispot.catalog.Product;
import com.jarothi.spot.jarothispot.catalog.ProductRepository;
import com.jarothi.spot.jarothispot.order.exception.InsufficientStockException;
import com.jarothi.spot.jarothispot.order.Order;
import com.jarothi.spot.jarothispot.order.OrderItem;
import com.jarothi.spot.jarothispot.order.dto.OrderDTO;
import com.jarothi.spot.jarothispot.order.dto.OrderItemDTO;
import com.jarothi.spot.jarothispot.order.repository.OrderRepository;
import com.jarothi.spot.jarothispot.user.User;
import com.jarothi.spot.jarothispot.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public OrderService(OrderRepository orderRepository,
                       CartRepository cartRepository,
                       CartItemRepository cartItemRepository,
                       ProductRepository productRepository,
                       UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    public OrderDTO createFromCart(CheckoutRequest request) {
        // Validate that items are selected
        if (request.getItemIds() == null || request.getItemIds().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No items selected for checkout");
        }

        User currentUser = getCurrentUser();
        
        // Load user's cart
        Cart cart = cartRepository.findByUserIdWithItems(currentUser.getId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart not found"));

        // Filter cart items by selected item IDs
        Set<UUID> selectedItemIds = Set.copyOf(request.getItemIds());
        List<CartItem> selectedItems = cart.getItems().stream()
            .filter(item -> selectedItemIds.contains(item.getId()))
            .toList();

        if (selectedItems.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No valid items found for checkout");
        }

        // Validate stock and lock products
        BigDecimal totalAmount = BigDecimal.ZERO;
        for (CartItem item : selectedItems) {
            Product product = productRepository.findByIdForUpdate(item.getProduct().getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, 
                    "Product not found: " + item.getProduct().getId()));

            if (product.getStock() < item.getQuantity()) {
                throw new InsufficientStockException(
                    product.getId().toString(), 
                    item.getQuantity(), 
                    product.getStock()
                );
            }

            totalAmount = totalAmount.add(product.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
        }

        // Create order
        Order order = new Order(currentUser, Order.OrderStatus.PAID, totalAmount);
        order = orderRepository.save(order);

        // Create order items and update stock
        for (CartItem cartItem : selectedItems) {
            Product product = cartItem.getProduct();
            
            // Create order item with price snapshot
            OrderItem orderItem = new OrderItem(
                order, 
                product, 
                cartItem.getQuantity(), 
                product.getPrice()
            );
            order.addItem(orderItem);

            // Update product stock
            product.setStock(product.getStock() - cartItem.getQuantity());
            productRepository.save(product);
        }

        // Remove selected items from cart
        for (CartItem cartItem : selectedItems) {
            cartItemRepository.delete(cartItem);
            cart.getItems().remove(cartItem);
        }

        return mapToOrderDTO(order);
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

    private OrderDTO mapToOrderDTO(Order order) {
        List<OrderItemDTO> itemDTOs = order.getItems().stream()
            .map(this::mapToOrderItemDTO)
            .toList();

        return new OrderDTO(order.getId(), order.getTotal(), itemDTOs);
    }

    private OrderItemDTO mapToOrderItemDTO(OrderItem orderItem) {
        Product product = orderItem.getProduct();
        return new OrderItemDTO(
            orderItem.getId(),
            product.getId(),
            product.getTitle(),
            product.getImageUrl(),
            orderItem.getQuantity(),
            orderItem.getUnitPriceSnapshot(),
            orderItem.getTotalPrice()
        );
    }
}
