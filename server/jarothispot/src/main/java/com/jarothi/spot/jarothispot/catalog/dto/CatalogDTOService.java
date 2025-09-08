package com.jarothi.spot.jarothispot.catalog.dto;

import com.jarothi.spot.jarothispot.catalog.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Example service showing how to use DTOs with the catalog system
 */
@Service
@Transactional(readOnly = true)
public class CatalogDTOService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final BookRepository bookRepository;
    private final CatalogMappingService mappingService;

    public CatalogDTOService(CategoryRepository categoryRepository,
                           ProductRepository productRepository,
                           BookRepository bookRepository,
                           CatalogMappingService mappingService) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.bookRepository = bookRepository;
        this.mappingService = mappingService;
    }

    // Category operations with DTOs
    @Transactional
    public CategoryDTO createCategory(CategoryCreateDTO createDTO) {
        // Validate that category doesn't already exist
        if (categoryRepository.existsByNameAndType(createDTO.name(), createDTO.type())) {
            throw new IllegalArgumentException("Category already exists with name: " + createDTO.name() + " and type: " + createDTO.type());
        }

        Category category = mappingService.createCategoryFromDTO(createDTO);
        Category savedCategory = categoryRepository.save(category);
        return mappingService.toCategoryDTO(savedCategory);
    }

    @Transactional
    public CategoryDTO updateCategory(UUID categoryId, CategoryUpdateDTO updateDTO) {
        Category category = categoryRepository.findById(categoryId)
            .orElseThrow(() -> new IllegalArgumentException("Category not found with ID: " + categoryId));

        mappingService.updateCategoryFromDTO(updateDTO, category);
        Category savedCategory = categoryRepository.save(category);
        return mappingService.toCategoryDTO(savedCategory);
    }

    public List<CategoryDTO> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        return mappingService.toCategoryDTOList(categories);
    }

    public List<CategoryDTO> getCategoriesByType(CategoryType type) {
        List<Category> categories = categoryRepository.findByTypeOrderByName(type);
        return mappingService.toCategoryDTOList(categories);
    }

    public Optional<CategoryDTO> getCategoryById(UUID categoryId) {
        return categoryRepository.findById(categoryId)
            .map(mappingService::toCategoryDTO);
    }

    // Product operations with DTOs
    public List<ProductDTO> getAllActiveProducts() {
        List<Product> products = productRepository.findByActiveTrue();
        return mappingService.toProductDTOList(products);
    }

    public Page<ProductDTO> findProductsWithFilters(ProductFilterDTO filter, Pageable pageable) {
        Specification<Product> specification = mappingService.createSpecificationFromFilter(filter);
        Page<Product> products = productRepository.findAll(specification, pageable);
        return products.map(mappingService::toProductDTO);
    }

    public Optional<ProductDTO> getProductById(UUID productId) {
        return productRepository.findById(productId)
            .map(mappingService::toProductDTO);
    }

    // Book-specific operations with DTOs
    @Transactional
    public ProductDTO createBook(BookCreateDTO createDTO) {
        // Validate categories are appropriate for books
        mappingService.validateCategoriesForProduct(createDTO.categoryIds(), ProductType.BOOK);

        Book book = mappingService.createBookFromDTO(createDTO);
        Book savedBook = bookRepository.save(book);
        return mappingService.toProductDTO(savedBook);
    }

    @Transactional
    public ProductDTO updateProduct(UUID productId, ProductUpdateDTO updateDTO) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new IllegalArgumentException("Product not found with ID: " + productId));

        // Validate categories if provided
        if (updateDTO.categoryIds() != null) {
            ProductType productType;
            if (product instanceof Book) {
                productType = ProductType.BOOK;
            } else {
                // Add other product types as they are implemented
                throw new IllegalArgumentException("Unknown product type: " + product.getClass().getSimpleName());
            }
            mappingService.validateCategoriesForProduct(updateDTO.categoryIds(), productType);
        }

        mappingService.updateProductFromDTO(updateDTO, product);
        Product savedProduct = productRepository.save(product);
        return mappingService.toProductDTO(savedProduct);
    }

    @Transactional
    public ProductDTO deactivateProduct(UUID productId) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new IllegalArgumentException("Product not found with ID: " + productId));
        
        product.setActive(false);
        Product savedProduct = productRepository.save(product);
        return mappingService.toProductDTO(savedProduct);
    }

    public List<ProductDTO> getAllActiveBooks() {
        List<Book> books = bookRepository.findByActiveTrue();
        return mappingService.toProductDTOListFromBooks(books);
    }

    public List<ProductDTO> searchBooks(String query) {
        List<Book> books = bookRepository.findByQueryAndActive(query, true);
        return mappingService.toProductDTOListFromBooks(books);
    }

    @Transactional
    public void deleteCategory(UUID categoryId) {
        if (!categoryRepository.existsById(categoryId)) {
            throw new IllegalArgumentException("Category not found with ID: " + categoryId);
        }
        
        // Check if category is used by any products
        long productCount = productRepository.countByCategoryIdAndActiveTrue(categoryId);
        if (productCount > 0) {
            throw new IllegalStateException("Cannot delete category that is used by " + productCount + " products");
        }
        
        categoryRepository.deleteById(categoryId);
    }

    @Transactional
    public void deleteProduct(UUID productId) {
        if (!productRepository.existsById(productId)) {
            throw new IllegalArgumentException("Product not found with ID: " + productId);
        }
        productRepository.deleteById(productId);
    }
}
