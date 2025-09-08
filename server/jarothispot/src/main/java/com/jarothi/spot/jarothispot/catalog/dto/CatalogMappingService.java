package com.jarothi.spot.jarothispot.catalog.dto;

import com.jarothi.spot.jarothispot.catalog.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Service for handling mapping operations between entities and DTOs
 * Combines MapStruct mappers with custom logic for complex mappings
 */
@Service
public class CatalogMappingService {

    private final CategoryMapper categoryMapper;
    private final ProductMapper productMapper;
    private final BookMapper bookMapper;
    private final CategoryRepository categoryRepository;

    public CatalogMappingService(CategoryMapper categoryMapper,
                               ProductMapper productMapper,
                               BookMapper bookMapper,
                               CategoryRepository categoryRepository) {
        this.categoryMapper = categoryMapper;
        this.productMapper = productMapper;
        this.bookMapper = bookMapper;
        this.categoryRepository = categoryRepository;
    }

    // Category mapping methods
    public CategoryDTO toCategoryDTO(Category category) {
        return categoryMapper.toDTO(category);
    }

    public List<CategoryDTO> toCategoryDTOList(List<Category> categories) {
        return categoryMapper.toDTOList(categories);
    }

    /**
     * Create a Category entity from CategoryCreateDTO
     */
    public Category createCategoryFromDTO(CategoryCreateDTO dto) {
        return categoryMapper.toEntity(dto);
    }

    /**
     * Update a Category entity from CategoryUpdateDTO
     */
    public void updateCategoryFromDTO(CategoryUpdateDTO updateDTO, Category category) {
        categoryMapper.updateCategoryFromDTO(updateDTO, category);
    }

    // Product mapping methods
    public ProductDTO toProductDTO(Product product) {
        return productMapper.toDTO(product);
    }

    public List<ProductDTO> toProductDTOList(List<Product> products) {
        return productMapper.toDTOList(products);
    }

    // Book-specific mapping methods
    public ProductDTO toProductDTO(Book book) {
        return bookMapper.toProductDTO(book);
    }

    public List<ProductDTO> toProductDTOListFromBooks(List<Book> books) {
        return bookMapper.toProductDTOList(books);
    }

    /**
     * Create a Book entity from BookCreateDTO with categories
     */
    public Book createBookFromDTO(BookCreateDTO dto) {
        Book book = bookMapper.toEntity(dto);
        
        if (dto.categoryIds() != null && !dto.categoryIds().isEmpty()) {
            Set<Category> categories = findCategoriesByIds(dto.categoryIds());
            book.setCategories(categories);
        }
        
        return book;
    }

    /**
     * Update a Product entity from ProductUpdateDTO
     */
    public void updateProductFromDTO(ProductUpdateDTO updateDTO, Product product) {
        if (product instanceof Book book) {
            bookMapper.updateBookFromDTO(updateDTO, book);
        } else {
            productMapper.updateProductFromDTO(updateDTO, product);
        }
        
        // Handle category updates
        if (updateDTO.categoryIds() != null) {
            Set<Category> categories = findCategoriesByIds(updateDTO.categoryIds());
            product.setCategories(categories);
        }
    }

    /**
     * Helper method to find categories by their IDs
     */
    private Set<Category> findCategoriesByIds(List<UUID> categoryIds) {
        if (categoryIds == null || categoryIds.isEmpty()) {
            return new HashSet<>();
        }
        
        List<Category> categories = categoryRepository.findAllById(categoryIds);
        
        // Validate that all requested categories were found
        if (categories.size() != categoryIds.size()) {
            Set<UUID> foundIds = categories.stream()
                .map(Category::getId)
                .collect(Collectors.toSet());
            
            List<UUID> missingIds = categoryIds.stream()
                .filter(id -> !foundIds.contains(id))
                .toList();
                
            throw new IllegalArgumentException("Categories not found with IDs: " + missingIds);
        }
        
        return new HashSet<>(categories);
    }

    /**
     * Create CategoryDTO list with category IDs for forms/requests
     */
    public List<UUID> extractCategoryIds(List<CategoryDTO> categoryDTOs) {
        if (categoryDTOs == null) {
            return new ArrayList<>();
        }
        
        return categoryDTOs.stream()
            .map(CategoryDTO::id)
            .toList();
    }

    /**
     * Validate that category IDs exist and are of the correct type for the product type
     */
    public void validateCategoriesForProduct(List<UUID> categoryIds, ProductType productType) {
        if (categoryIds == null || categoryIds.isEmpty()) {
            return;
        }
        
        List<Category> categories = categoryRepository.findAllById(categoryIds);
        
        if (productType == ProductType.BOOK) {
            boolean hasInvalidType = categories.stream()
                .anyMatch(cat -> cat.getType() != CategoryType.GENRE_BOOK);
            if (hasInvalidType) {
                throw new IllegalArgumentException("Books can only have GENRE_BOOK categories");
            }
        }
        // Add validation for other product types as they are implemented
    }

    /**
     * Convert ProductFilterDTO to JPA Specification for filtering
     */
    public Specification<Product> createSpecificationFromFilter(ProductFilterDTO filter) {
        Specification<Product> spec = ProductSpecifications.isActive(filter.getActiveFilter());
        
        if (filter.query() != null && !filter.query().trim().isEmpty()) {
            spec = spec.and(ProductSpecifications.hasQuery(filter.query()));
        }
        
        if (filter.categoryId() != null) {
            spec = spec.and(ProductSpecifications.hasCategoryId(filter.categoryId()));
        }
        
        if (filter.minPrice() != null) {
            spec = spec.and(ProductSpecifications.hasMinPrice(filter.minPrice()));
        }
        
        if (filter.maxPrice() != null) {
            spec = spec.and(ProductSpecifications.hasMaxPrice(filter.maxPrice()));
        }
        
        if (filter.productType() == ProductType.BOOK) {
            spec = spec.and(ProductSpecifications.isBooksOnly());
        }
        
        return spec;
    }
}
