package com.jarothi.spot.jarothispot.cart.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class CheckoutRequest {

    @NotNull(message = "Item IDs list is required")
    @NotEmpty(message = "At least one item must be selected for checkout")
    private List<UUID> itemIds;

    // Constructors
    public CheckoutRequest() {
        this.itemIds = new ArrayList<>();
    }

    public CheckoutRequest(List<UUID> itemIds) {
        this.itemIds = itemIds != null ? itemIds : new ArrayList<>();
    }

    // Getters and Setters
    public List<UUID> getItemIds() {
        return itemIds;
    }

    public void setItemIds(List<UUID> itemIds) {
        this.itemIds = itemIds != null ? itemIds : new ArrayList<>();
    }

    // Utility methods
    public void addItemId(UUID itemId) {
        if (itemId != null && !this.itemIds.contains(itemId)) {
            this.itemIds.add(itemId);
        }
    }

    public void removeItemId(UUID itemId) {
        if (itemId != null) {
            this.itemIds.remove(itemId);
        }
    }

    public boolean hasItemId(UUID itemId) {
        return itemId != null && this.itemIds.contains(itemId);
    }

    public int getSelectedItemsCount() {
        return this.itemIds.size();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CheckoutRequest that = (CheckoutRequest) o;
        return itemIds != null && itemIds.equals(that.itemIds);
    }

    @Override
    public int hashCode() {
        return itemIds != null ? itemIds.hashCode() : 0;
    }

    @Override
    public String toString() {
        return "CheckoutRequest{" +
               "itemIds=" + itemIds +
               ", selectedCount=" + getSelectedItemsCount() +
               '}';
    }
}
