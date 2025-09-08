package com.jarothi.spot.jarothispot.catalog.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

/**
 * DTO for creating Book entities
 * ProductType is implicitly BOOK
 */
public record BookCreateDTO(
    @NotBlank(message = "Title is required")
    String title,
    
    String description,
    
    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    BigDecimal price,
    
    String imageUrl,
    
    List<UUID> categoryIds
) {}
