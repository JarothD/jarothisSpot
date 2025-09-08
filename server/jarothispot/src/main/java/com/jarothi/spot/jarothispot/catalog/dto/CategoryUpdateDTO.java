package com.jarothi.spot.jarothispot.catalog.dto;

import com.jarothi.spot.jarothispot.catalog.CategoryType;
import jakarta.validation.constraints.Pattern;

/**
 * DTO for updating Category entities
 * All fields are optional
 */
public record CategoryUpdateDTO(
    String name,
    CategoryType type,
    
    @Pattern(regexp = "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$", message = "Color hex must be in format #RGB or #RRGGBB")
    String colorHex
) {}
