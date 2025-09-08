package com.jarothi.spot.jarothispot.bootstrap;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jarothi.spot.jarothispot.catalog.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Component to seed initial data from JSON files
 */
@Component
public class DataSeeder {

    private static final Logger logger = LoggerFactory.getLogger(DataSeeder.class);
    private static final String DEFAULT_COLOR_HEX = "#9ca3af"; // Gray-400

    private final CategoryRepository categoryRepository;
    private final BookRepository bookRepository;
    private final ObjectMapper objectMapper;

    public DataSeeder(CategoryRepository categoryRepository,
                     BookRepository bookRepository,
                     ObjectMapper objectMapper) {
        this.categoryRepository = categoryRepository;
        this.bookRepository = bookRepository;
        this.objectMapper = objectMapper;
    }

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void seedData() {
        logger.info("Starting data seeding...");
        
        try {
            seedCategories();
            seedBooks();
            logger.info("Data seeding completed successfully");
        } catch (IOException e) {
            logger.error("Error reading JSON files during data seeding: {}", e.getMessage(), e);
            throw new DataSeedingException("Failed to read data files", e);
        } catch (Exception e) {
            logger.error("Unexpected error during data seeding: {}", e.getMessage(), e);
            throw new DataSeedingException("Failed to seed data", e);
        }
    }

    private void seedCategories() throws IOException {
        logger.info("Seeding categories...");
        
        ClassPathResource resource = new ClassPathResource("data/categories.json");
        if (!resource.exists()) {
            logger.warn("Categories JSON file not found, skipping category seeding");
            return;
        }

        try (InputStream inputStream = resource.getInputStream()) {
            List<CategorySeedData> categoryDataList = objectMapper.readValue(
                inputStream, 
                new TypeReference<List<CategorySeedData>>() {}
            );

            for (CategorySeedData categoryData : categoryDataList) {
                createCategoryIfNotExists(
                    categoryData.name(), 
                    categoryData.type(), 
                    categoryData.colorHex()
                );
            }
            
            logger.info("Seeded {} categories", categoryDataList.size());
        }
    }

    private void seedBooks() throws IOException {
        logger.info("Seeding books...");
        
        ClassPathResource resource = new ClassPathResource("data/books.json");
        if (!resource.exists()) {
            logger.warn("Books JSON file not found, skipping book seeding");
            return;
        }

        try (InputStream inputStream = resource.getInputStream()) {
            List<BookSeedData> bookDataList = objectMapper.readValue(
                inputStream, 
                new TypeReference<List<BookSeedData>>() {}
            );

            int createdBooks = 0;
            for (BookSeedData bookData : bookDataList) {
                if (createBookIfNotExists(bookData)) {
                    createdBooks++;
                }
            }
            
            logger.info("Seeded {} new books", createdBooks);
        }
    }

    private Category createCategoryIfNotExists(String name, CategoryType type, String colorHex) {
        return categoryRepository.findByNameAndType(name, type)
            .orElseGet(() -> {
                logger.debug("Creating category: {} of type {}", name, type);
                Category category = new Category(name, type, colorHex);
                return categoryRepository.save(category);
            });
    }

    private boolean createBookIfNotExists(BookSeedData bookData) {
        // Check if book already exists by title (simple idempotency check)
        if (bookRepository.existsByTitle(bookData.title())) {
            logger.debug("Book '{}' already exists, skipping", bookData.title());
            return false;
        }

        logger.debug("Creating book: {}", bookData.title());
        
        // Create the book entity
        Book book = new Book(bookData.title(), bookData.description(), bookData.price());
        book.setImageUrl(bookData.imageUrl());
        book.setActive(true);

        // Resolve and set categories
        Set<Category> categories = resolveCategoriesFromNames(bookData.categoriesByName());
        book.setCategories(categories);

        bookRepository.save(book);
        return true;
    }

    private Set<Category> resolveCategoriesFromNames(List<String> categoryNames) {
        Set<Category> categories = new HashSet<>();
        
        if (categoryNames != null) {
            for (String categoryName : categoryNames) {
                Category category = categoryRepository.findByNameAndType(categoryName, CategoryType.GENRE_BOOK)
                    .orElseGet(() -> {
                        logger.info("Category '{}' not found, creating with default color", categoryName);
                        Category newCategory = new Category(categoryName, CategoryType.GENRE_BOOK, DEFAULT_COLOR_HEX);
                        return categoryRepository.save(newCategory);
                    });
                categories.add(category);
            }
        }
        
        return categories;
    }

    /**
     * DTO for deserializing category data from JSON
     */
    public record CategorySeedData(
        String name,
        CategoryType type,
        @JsonProperty("colorHex") String colorHex
    ) {}

    /**
     * DTO for deserializing book data from JSON
     */
    public record BookSeedData(
        String title,
        String description,
        BigDecimal price,
        String imageUrl,
        List<String> categoriesByName
    ) {}

    /**
     * Custom exception for data seeding errors
     */
    public static class DataSeedingException extends RuntimeException {
        public DataSeedingException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}
