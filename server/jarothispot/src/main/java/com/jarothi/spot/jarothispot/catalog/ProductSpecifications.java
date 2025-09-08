package com.jarothi.spot.jarothispot.catalog;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Utility class for creating JPA Specifications for Product filtering
 */
public class ProductSpecifications {

    private static final String PRICE_FIELD = "price";
    private static final String TITLE_FIELD = "title";
    private static final String DESCRIPTION_FIELD = "description";
    private static final String ACTIVE_FIELD = "active";
    private static final String CATEGORIES_FIELD = "categories";
    private static final String ID_FIELD = "id";

    private ProductSpecifications() {
        // Utility class - prevent instantiation
    }

    /**
     * Filter by active status
     */
    public static Specification<Product> isActive(boolean active) {
        return (root, query, criteriaBuilder) ->
            criteriaBuilder.equal(root.get(ACTIVE_FIELD), active);
    }

    /**
     * Filter by text query in title or description
     */
    public static Specification<Product> hasQuery(String query) {
        return (root, criteriaQuery, criteriaBuilder) -> {
            if (query == null || query.trim().isEmpty()) {
                return criteriaBuilder.conjunction();
            }
            String searchQuery = "%" + query.toLowerCase() + "%";
            return criteriaBuilder.or(
                criteriaBuilder.like(criteriaBuilder.lower(root.get(TITLE_FIELD)), searchQuery),
                criteriaBuilder.like(criteriaBuilder.lower(root.get(DESCRIPTION_FIELD)), searchQuery)
            );
        };
    }

    /**
     * Filter by category ID
     */
    public static Specification<Product> hasCategoryId(UUID categoryId) {
        return (root, criteriaQuery, criteriaBuilder) -> {
            if (categoryId == null) {
                return criteriaBuilder.conjunction();
            }
            // Ensure distinct results for many-to-many relationship
            if (criteriaQuery != null) {
                criteriaQuery.distinct(true);
            }
            Join<Product, Category> categoryJoin = root.join(CATEGORIES_FIELD, JoinType.INNER);
            return criteriaBuilder.equal(categoryJoin.get(ID_FIELD), categoryId);
        };
    }

    /**
     * Filter by minimum price
     */
    public static Specification<Product> hasMinPrice(BigDecimal minPrice) {
        return (root, criteriaQuery, criteriaBuilder) -> {
            if (minPrice == null) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.greaterThanOrEqualTo(root.get(PRICE_FIELD), minPrice);
        };
    }

    /**
     * Filter by maximum price
     */
    public static Specification<Product> hasMaxPrice(BigDecimal maxPrice) {
        return (root, criteriaQuery, criteriaBuilder) -> {
            if (maxPrice == null) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.lessThanOrEqualTo(root.get(PRICE_FIELD), maxPrice);
        };
    }

    /**
     * Filter by price range
     */
    public static Specification<Product> hasPriceBetween(BigDecimal minPrice, BigDecimal maxPrice) {
        return (root, criteriaQuery, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            
            if (minPrice != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get(PRICE_FIELD), minPrice));
            }
            
            if (maxPrice != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get(PRICE_FIELD), maxPrice));
            }
            
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    /**
     * Filter by product type
     */
    public static Specification<Product> hasProductType(Class<? extends Product> productType) {
        return (root, criteriaQuery, criteriaBuilder) ->
            criteriaBuilder.equal(root.type(), productType);
    }

    /**
     * Convenience method to create a complete filter specification
     */
    public static Specification<Product> withFilters(String query, UUID categoryId, 
                                                   BigDecimal minPrice, BigDecimal maxPrice, 
                                                   boolean active) {
        return isActive(active)
                .and(hasQuery(query))
                .and(hasCategoryId(categoryId))
                .and(hasMinPrice(minPrice))
                .and(hasMaxPrice(maxPrice));
    }

    /**
     * Filter for books only
     */
    public static Specification<Product> isBooksOnly() {
        return hasProductType(Book.class);
    }
}
