package com.jarothi.spot.jarothispot.catalog.dto;

import com.jarothi.spot.jarothispot.catalog.CategoryType;
import com.jarothi.spot.jarothispot.catalog.ProductType;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * DTO for filtering products in search/list operations
 * All fields are optional and used as filters
 */
public record ProductFilterDTO(
    String query,              // Text search in title/description
    UUID categoryId,           // Filter by category
    CategoryType categoryType, // Filter by category type
    ProductType productType,   // Filter by product type (BOOK, etc.)
    BigDecimal minPrice,       // Minimum price filter
    BigDecimal maxPrice,       // Maximum price filter
    Boolean active             // Filter by active status (defaults to true if null)
) {
    
    /**
     * Get the active filter value, defaulting to true if null
     */
    public boolean getActiveFilter() {
        return active == null || active;
    }
}
