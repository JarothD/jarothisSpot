package com.jarothi.spot.jarothispot.cart.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class CartDTO {

    private UUID id;
    private List<CartItemDTO> items;
    private BigDecimal subtotal;

    // Constructors
    public CartDTO() {
        this.items = new ArrayList<>();
        this.subtotal = BigDecimal.ZERO;
    }

    public CartDTO(UUID id, List<CartItemDTO> items, BigDecimal subtotal) {
        this.id = id;
        this.items = items != null ? items : new ArrayList<>();
        this.subtotal = subtotal != null ? subtotal : BigDecimal.ZERO;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public List<CartItemDTO> getItems() {
        return items;
    }

    public void setItems(List<CartItemDTO> items) {
        this.items = items != null ? items : new ArrayList<>();
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal != null ? subtotal : BigDecimal.ZERO;
    }

    // Utility methods
    public void addItem(CartItemDTO item) {
        if (item != null) {
            this.items.add(item);
        }
    }

    public void removeItem(CartItemDTO item) {
        if (item != null) {
            this.items.remove(item);
        }
    }

    public int getTotalItems() {
        return items.stream().mapToInt(CartItemDTO::getQty).sum();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CartDTO cartDTO = (CartDTO) o;
        return id != null && id.equals(cartDTO.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
