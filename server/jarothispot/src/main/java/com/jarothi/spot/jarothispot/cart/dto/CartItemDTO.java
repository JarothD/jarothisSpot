package com.jarothi.spot.jarothispot.cart.dto;

import java.math.BigDecimal;
import java.util.UUID;

public class CartItemDTO {

    private UUID id;
    private UUID productId;
    private String title;
    private String imageUrl;
    private BigDecimal price;
    private int qty;

    // Constructors
    public CartItemDTO() {
        // This constructor is intentionally empty. Required for serialization.
    }

    public CartItemDTO(UUID id, UUID productId, String title, String imageUrl, BigDecimal price, int qty) {
        this.id = id;
        this.productId = productId;
        this.title = title;
        this.imageUrl = imageUrl;
        this.price = price;
        this.qty = qty;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getProductId() {
        return productId;
    }

    public void setProductId(UUID productId) {
        this.productId = productId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
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
        CartItemDTO that = (CartItemDTO) o;
        return id != null && id.equals(that.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
