package com.jarothi.spot.jarothispot.catalog;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Example service demonstrating how to use the catalog repositories
 */
@Service
@Transactional(readOnly = true)
public class CatalogService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final BookRepository bookRepository;

    public CatalogService(CategoryRepository categoryRepository, 
                         ProductRepository productRepository,
                         BookRepository bookRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.bookRepository = bookRepository;
    }

    // Category operations
    public boolean categoryExists(String name, CategoryType type) {
        return categoryRepository.existsByNameAndType(name, type);
    }

    public Optional<Category> findCategory(String name, CategoryType type) {
        return categoryRepository.findByNameAndType(name, type);
    }

    public List<Category> findCategoriesByType(CategoryType type) {
        return categoryRepository.findByTypeOrderByName(type);
    }

    // Product operations with filtering
    public List<Product> findActiveProducts() {
        return productRepository.findByActiveTrue();
    }

    public List<Product> searchProducts(String query) {
        return productRepository.findByQueryAndActive(query, true);
    }

    public List<Product> findProductsByCategory(UUID categoryId) {
        return productRepository.findByCategoryIdAndActive(categoryId, true);
    }

    public List<Product> findProductsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        return productRepository.findByPriceBetweenAndActive(minPrice, maxPrice, true);
    }

    // Advanced filtering using Specifications
    public Page<Product> findProductsWithFilters(String query, UUID categoryId, 
                                                BigDecimal minPrice, BigDecimal maxPrice, 
                                                Pageable pageable) {
        Specification<Product> spec = ProductSpecifications.withFilters(
            query, categoryId, minPrice, maxPrice, true
        );
        return productRepository.findAll(spec, pageable);
    }

    public List<Product> findBooksOnly() {
        Specification<Product> spec = ProductSpecifications.isBooksOnly()
                .and(ProductSpecifications.isActive(true));
        return productRepository.findAll(spec);
    }

    // Book-specific operations
    public List<Book> findActiveBooks() {
        return bookRepository.findByActiveTrue();
    }

    public List<Book> searchBooks(String query) {
        return bookRepository.findByQueryAndActive(query, true);
    }

    public List<Book> findBooksByGenre(UUID genreCategoryId) {
        return bookRepository.findByGenreCategoryIdAndActive(genreCategoryId, true);
    }

    public List<Book> findFeaturedBooks() {
        return bookRepository.findFeaturedBooks();
    }

    // Statistics
    public long countProductsByCategory(UUID categoryId) {
        return productRepository.countByCategoryIdAndActiveTrue(categoryId);
    }

    public long countBooksByGenre(UUID genreCategoryId) {
        return bookRepository.countByGenreCategoryIdAndActiveTrue(genreCategoryId);
    }
}
