package com.jarothi.spot.jarothispot.cart.dto;

import jakarta.validation.constraints.Min;

public class UpdateCartItemRequest {

    @Min(value = 1, message = "Quantity must be at least 1")
    private int qty;

    // Constructors
    public UpdateCartItemRequest() {
        // This constructor is intentionally empty. Required for serialization.
    }

    public UpdateCartItemRequest(int qty) {
        this.qty = qty;
    }

    // Getters and Setters
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
        UpdateCartItemRequest that = (UpdateCartItemRequest) o;
        return qty == that.qty;
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "UpdateCartItemRequest{" +
               "qty=" + qty +
               '}';
    }
}
