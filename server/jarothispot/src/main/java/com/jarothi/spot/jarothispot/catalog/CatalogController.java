package com.jarothi.spot.jarothispot.catalog;

import com.jarothi.spot.jarothispot.catalog.dto.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

/**
 * REST Controller for catalog operations (Products and Categories)
 */
@RestController
@RequestMapping("/api")
public class CatalogController {

    private final CatalogDTOService catalogService;

    public CatalogController(CatalogDTOService catalogService) {
        this.catalogService = catalogService;
    }

    // Products endpoints
    @GetMapping("/products")
    @Tag(name = "Products")
    @Operation(
        summary = "Get products with filters",
        description = "Retrieve products with optional filtering by query, category, price range and pagination"
    )
    public ResponseEntity<Page<ProductDTO>> getProducts(
            @Parameter(description = "Text search in title and description")
            @RequestParam(required = false) String q,
            
            @Parameter(description = "Filter by category ID")
            @RequestParam(required = false) UUID categoryId,
            
            @Parameter(description = "Minimum price filter")
            @RequestParam(required = false) BigDecimal minPrice,
            
            @Parameter(description = "Maximum price filter")
            @RequestParam(required = false) BigDecimal maxPrice,
            
            @Parameter(description = "Page number (0-based)")
            @RequestParam(defaultValue = "0") int page,
            
            @Parameter(description = "Page size")
            @RequestParam(defaultValue = "20") int size,
            
            @Parameter(description = "Sort criteria (e.g., 'title,asc' or 'price,desc')")
            @RequestParam(defaultValue = "title,asc") String sort
    ) {
        // Parse sort parameter
        Sort sortObj = parseSort(sort);
        Pageable pageable = PageRequest.of(page, size, sortObj);
        
        // Create filter DTO
        ProductFilterDTO filter = new ProductFilterDTO(
            q, categoryId, null, null, minPrice, maxPrice, true
        );
        
        Page<ProductDTO> products = catalogService.findProductsWithFilters(filter, pageable);
        return ResponseEntity.ok(products);
    }

    @PostMapping("/products")
    @Tag(name = "Products")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(
        summary = "Create a new book product",
        description = "Create a new book product. Requires ADMIN role."
    )
    public ResponseEntity<ProductDTO> createProduct(@Valid @RequestBody BookCreateDTO bookCreateDTO) {
        ProductDTO createdProduct = catalogService.createBook(bookCreateDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);
    }

    @PutMapping("/products/{id}")
    @Tag(name = "Products")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(
        summary = "Update a product",
        description = "Update an existing product. Requires ADMIN role."
    )
    public ResponseEntity<ProductDTO> updateProduct(
            @Parameter(description = "Product ID")
            @PathVariable UUID id,
            @Valid @RequestBody ProductUpdateDTO updateDTO
    ) {
        ProductDTO updatedProduct = catalogService.updateProduct(id, updateDTO);
        return ResponseEntity.ok(updatedProduct);
    }

    @PatchMapping("/products/{id}/deactivate")
    @Tag(name = "Products")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(
        summary = "Deactivate a product",
        description = "Soft delete a product by marking it as inactive. Requires ADMIN role."
    )
    public ResponseEntity<ProductDTO> deactivateProduct(
            @Parameter(description = "Product ID")
            @PathVariable UUID id
    ) {
        ProductDTO deactivatedProduct = catalogService.deactivateProduct(id);
        return ResponseEntity.ok(deactivatedProduct);
    }

    // Categories endpoints
    @GetMapping("/categories")
    @Tag(name = "Categories")
    @Operation(
        summary = "Get all categories",
        description = "Retrieve all categories for populating filters and forms"
    )
    public ResponseEntity<List<CategoryDTO>> getCategories(
            @Parameter(description = "Filter by category type")
            @RequestParam(required = false) CategoryType type
    ) {
        List<CategoryDTO> categories;
        if (type != null) {
            categories = catalogService.getCategoriesByType(type);
        } else {
            categories = catalogService.getAllCategories();
        }
        return ResponseEntity.ok(categories);
    }

    /**
     * Helper method to parse sort parameter
     */
    private Sort parseSort(String sort) {
        if (sort == null || sort.trim().isEmpty()) {
            return Sort.by("title").ascending();
        }
        
        String[] parts = sort.split(",");
        String property = parts[0].trim();
        
        if (parts.length > 1 && "desc".equalsIgnoreCase(parts[1].trim())) {
            return Sort.by(property).descending();
        }
        
        return Sort.by(property).ascending();
    }
}
