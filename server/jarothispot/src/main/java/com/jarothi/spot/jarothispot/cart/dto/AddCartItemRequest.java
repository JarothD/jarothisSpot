package com.jarothi.spot.jarothispot.cart.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public class AddCartItemRequest {

    @NotNull(message = "Product ID is required")
    private UUID productId;

    @Min(value = 1, message = "Quantity must be at least 1")
    private int qty;

    // Constructors
    public AddCartItemRequest() {
        // This constructor is intentionally empty. Required for serialization.
    }

    public AddCartItemRequest(UUID productId, int qty) {
        this.productId = productId;
        this.qty = qty;
    }

    // Getters and Setters
    public UUID getProductId() {
        return productId;
    }

    public void setProductId(UUID productId) {
        this.productId = productId;
    }

    public int getQty() {
        return qty;
    }

    public void setQty(int qty) {
        this.qty = qty;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        AddCartItemRequest that = (AddCartItemRequest) o;
        return qty == that.qty && 
               productId != null && productId.equals(that.productId);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "AddCartItemRequest{" +
               "productId=" + productId +
               ", qty=" + qty +
               '}';
    }
}
