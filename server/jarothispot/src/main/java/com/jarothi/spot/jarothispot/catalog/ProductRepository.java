package com.jarothi.spot.jarothispot.catalog;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID>, JpaSpecificationExecutor<Product> {

    /**
     * Find all active products
     */
    List<Product> findByActiveTrue();

    /**
     * Find products by title containing (case insensitive) and active status
     */
    @Query("SELECT p FROM Product p WHERE LOWER(p.title) LIKE LOWER(CONCAT('%', :title, '%')) AND p.active = :active ORDER BY p.title")
    List<Product> findByTitleContainingIgnoreCaseAndActive(@Param("title") String title, @Param("active") boolean active);

    /**
     * Find products by price range and active status
     */
    @Query("SELECT p FROM Product p WHERE p.price BETWEEN :minPrice AND :maxPrice AND p.active = :active ORDER BY p.price")
    List<Product> findByPriceBetweenAndActive(@Param("minPrice") BigDecimal minPrice, @Param("maxPrice") BigDecimal maxPrice, @Param("active") boolean active);

    /**
     * Find products by category and active status
     */
    @Query("SELECT DISTINCT p FROM Product p JOIN p.categories c WHERE c.id = :categoryId AND p.active = :active ORDER BY p.title")
    List<Product> findByCategoryIdAndActive(@Param("categoryId") UUID categoryId, @Param("active") boolean active);

    /**
     * Find products with text search in title and description
     */
    @Query("SELECT p FROM Product p WHERE (LOWER(p.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%'))) AND p.active = :active ORDER BY p.title")
    List<Product> findByQueryAndActive(@Param("query") String query, @Param("active") boolean active);

    /**
     * Complex search with all filters
     */
    @Query("SELECT DISTINCT p FROM Product p LEFT JOIN p.categories c " +
           "WHERE (:query IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%'))) " +
           "AND (:categoryId IS NULL OR c.id = :categoryId) " +
           "AND (:minPrice IS NULL OR p.price >= :minPrice) " +
           "AND (:maxPrice IS NULL OR p.price <= :maxPrice) " +
           "AND p.active = :active " +
           "ORDER BY p.title")
    List<Product> findWithFilters(@Param("query") String query,
                                  @Param("categoryId") UUID categoryId,
                                  @Param("minPrice") BigDecimal minPrice,
                                  @Param("maxPrice") BigDecimal maxPrice,
                                  @Param("active") boolean active);

    /**
     * Count products by category
     */
    @Query("SELECT COUNT(DISTINCT p) FROM Product p JOIN p.categories c WHERE c.id = :categoryId AND p.active = true")
    long countByCategoryIdAndActiveTrue(@Param("categoryId") UUID categoryId);
}
