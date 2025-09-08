package com.jarothi.spot.jarothispot.catalog;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Repository
public interface BookRepository extends JpaRepository<Book, UUID> {

    /**
     * Find all active books
     */
    List<Book> findByActiveTrue();

    /**
     * Check if a book exists by title
     */
    boolean existsByTitle(String title);

    /**
     * Find books by title containing (case insensitive) and active status
     */
    @Query("SELECT b FROM Book b WHERE LOWER(b.title) LIKE LOWER(CONCAT('%', :title, '%')) AND b.active = :active ORDER BY b.title")
    List<Book> findByTitleContainingIgnoreCaseAndActive(@Param("title") String title, @Param("active") boolean active);

    /**
     * Find books by price range and active status
     */
    List<Book> findByPriceBetweenAndActive(BigDecimal minPrice, BigDecimal maxPrice, boolean active);

    /**
     * Find books by category (genre) and active status
     */
    @Query("SELECT DISTINCT b FROM Book b JOIN b.categories c WHERE c.id = :categoryId AND c.type = 'GENRE_BOOK' AND b.active = :active ORDER BY b.title")
    List<Book> findByGenreCategoryIdAndActive(@Param("categoryId") UUID categoryId, @Param("active") boolean active);

    /**
     * Find books with text search in title and description
     */
    @Query("SELECT b FROM Book b WHERE (LOWER(b.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(b.description) LIKE LOWER(CONCAT('%', :query, '%'))) AND b.active = :active ORDER BY b.title")
    List<Book> findByQueryAndActive(@Param("query") String query, @Param("active") boolean active);

    /**
     * Count active books by genre category
     */
    @Query("SELECT COUNT(DISTINCT b) FROM Book b JOIN b.categories c WHERE c.id = :categoryId AND c.type = 'GENRE_BOOK' AND b.active = true")
    long countByGenreCategoryIdAndActiveTrue(@Param("categoryId") UUID categoryId);

    /**
     * Find featured/popular books (by active status, can be extended with popularity logic)
     */
    @Query("SELECT b FROM Book b WHERE b.active = true ORDER BY b.title LIMIT 10")
    List<Book> findFeaturedBooks();
}
