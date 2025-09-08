package com.jarothi.spot.jarothispot.catalog.dto;

import com.jarothi.spot.jarothispot.catalog.CategoryType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

/**
 * DTO for creating Category entities
 */
public record CategoryCreateDTO(
    @NotBlank(message = "Name is required")
    String name,
    
    @NotNull(message = "Type is required")
    CategoryType type,
    
    @NotBlank(message = "Color hex is required")
    @Pattern(regexp = "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$", message = "Color hex must be in format #RGB or #RRGGBB")
    String colorHex
) {}
