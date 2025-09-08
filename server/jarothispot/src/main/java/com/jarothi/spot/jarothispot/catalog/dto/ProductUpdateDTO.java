package com.jarothi.spot.jarothispot.catalog.dto;

import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

/**
 * DTO for updating Product entities
 * All fields are optional
 */
public record ProductUpdateDTO(
    String title,
    String description,
    
    @Positive(message = "Price must be positive")
    BigDecimal price,
    
    String imageUrl,
    List<UUID> categoryIds
) {}
