package com.jarothi.spot.jarothispot.catalog;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CategoryRepository extends JpaRepository<Category, UUID> {

    /**
     * Check if a category exists with the given name and type
     */
    boolean existsByNameAndType(String name, CategoryType type);

    /**
     * Find a category by name and type
     */
    Optional<Category> findByNameAndType(String name, CategoryType type);

    /**
     * Find all categories by type
     */
    @Query("SELECT c FROM Category c WHERE c.type = :type ORDER BY c.name")
    java.util.List<Category> findByTypeOrderByName(@Param("type") CategoryType type);

    /**
     * Find categories by name containing (case insensitive)
     */
    @Query("SELECT c FROM Category c WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :name, '%')) ORDER BY c.name")
    java.util.List<Category> findByNameContainingIgnoreCase(@Param("name") String name);
}
