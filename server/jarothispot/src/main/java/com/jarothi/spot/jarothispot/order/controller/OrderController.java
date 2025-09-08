package com.jarothi.spot.jarothispot.order.controller;

import com.jarothi.spot.jarothispot.cart.dto.CheckoutRequest;
import com.jarothi.spot.jarothispot.order.dto.OrderDTO;
import com.jarothi.spot.jarothispot.order.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@Tag(name = "Orders", description = "Order management operations")
@SecurityRequirement(name = "bearerAuth")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    @Operation(summary = "Create order from cart", description = "Creates a new order from selected cart items")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Order created successfully"),
        @ApiResponse(responseCode = "400", description = "No items selected for checkout"),
        @ApiResponse(responseCode = "409", description = "Insufficient stock for one or more items"),
        @ApiResponse(responseCode = "401", description = "Authentication required"),
        @ApiResponse(responseCode = "404", description = "Cart or products not found")
    })
    public ResponseEntity<OrderDTO> createOrder(@Valid @RequestBody CheckoutRequest request) {
        OrderDTO order = orderService.createFromCart(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(order);
    }
}
