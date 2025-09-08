package com.jarothi.spot.jarothispot.order.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class OrderDTO {

    private UUID id;
    private BigDecimal total;
    private List<OrderItemDTO> items;

    // Constructors
    public OrderDTO() {
        this.items = new ArrayList<>();
    }

    public OrderDTO(UUID id, BigDecimal total, List<OrderItemDTO> items) {
        this.id = id;
        this.total = total;
        this.items = items != null ? items : new ArrayList<>();
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    public List<OrderItemDTO> getItems() {
        return items;
    }

    public void setItems(List<OrderItemDTO> items) {
        this.items = items != null ? items : new ArrayList<>();
    }

    // Utility methods
    public void addItem(OrderItemDTO item) {
        if (item != null) {
            this.items.add(item);
        }
    }

    public int getTotalItems() {
        return items.stream().mapToInt(OrderItemDTO::getQuantity).sum();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        OrderDTO orderDTO = (OrderDTO) o;
        return id != null && id.equals(orderDTO.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
