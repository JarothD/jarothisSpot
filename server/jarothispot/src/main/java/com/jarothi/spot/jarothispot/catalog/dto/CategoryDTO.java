package com.jarothi.spot.jarothispot.catalog.dto;

import com.jarothi.spot.jarothispot.catalog.CategoryType;

import java.util.UUID;

/**
 * DTO for Category entity
 */
public record CategoryDTO(
    UUID id,
    String name,
    String colorHex,
    CategoryType type
) {}
