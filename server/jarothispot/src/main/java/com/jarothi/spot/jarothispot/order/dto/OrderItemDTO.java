package com.jarothi.spot.jarothispot.order.dto;

import java.math.BigDecimal;
import java.util.UUID;

public class OrderItemDTO {

    private UUID id;
    private UUID productId;
    private String title;
    private String imageUrl;
    private int qty;
    private BigDecimal unitPrice;
    private BigDecimal lineTotal;

    // Constructors
    public OrderItemDTO() {
        // This constructor is intentionally empty. Required for serialization.
    }

    public OrderItemDTO(UUID id, UUID productId, String title, String imageUrl, 
                       int qty, BigDecimal unitPrice, BigDecimal lineTotal) {
        this.id = id;
        this.productId = productId;
        this.title = title;
        this.imageUrl = imageUrl;
        this.qty = qty;
        this.unitPrice = unitPrice;
        this.lineTotal = lineTotal;
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

    public int getQty() {
        return qty;
    }

    public void setQty(int qty) {
        this.qty = qty;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }

    public BigDecimal getLineTotal() {
        return lineTotal;
    }

    public void setLineTotal(BigDecimal lineTotal) {
        this.lineTotal = lineTotal;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        OrderItemDTO that = (OrderItemDTO) o;
        return id != null && id.equals(that.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
