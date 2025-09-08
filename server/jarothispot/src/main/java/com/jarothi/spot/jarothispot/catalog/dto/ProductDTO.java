package com.jarothi.spot.jarothispot.catalog.dto;

import com.jarothi.spot.jarothispot.catalog.ProductType;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

/**
 * DTO for Product entity
 */
public record ProductDTO(
    UUID id,
    ProductType productType,
    String title,
    String description,
    BigDecimal price,
    String imageUrl,
    boolean active,
    List<CategoryDTO> categories
) {}
