package com.jarothi.spot.jarothispot.catalog.dto;

import com.jarothi.spot.jarothispot.catalog.Book;
import com.jarothi.spot.jarothispot.catalog.Product;
import com.jarothi.spot.jarothispot.catalog.ProductType;
import org.mapstruct.*;

import java.util.List;

/**
 * MapStruct mapper for Product entity and ProductDTO
 */
@Mapper(
    componentModel = MappingConstants.ComponentModel.SPRING,
    uses = {CategoryMapper.class}
)
public interface ProductMapper {

    @Mapping(target = "productType", expression = "java(getProductType(product))")
    ProductDTO toDTO(Product product);

    List<ProductDTO> toDTOList(List<Product> products);

    /**
     * Map BookCreateDTO to Book entity
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "active", constant = "true")
    @Mapping(target = "categories", ignore = true)
    Book toBookEntity(BookCreateDTO bookCreateDTO);

    /**
     * Update Product entity from ProductUpdateDTO
     * Null values in DTO will not update the entity
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "active", ignore = true)
    @Mapping(target = "categories", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateProductFromDTO(ProductUpdateDTO updateDTO, @MappingTarget Product product);

    /**
     * Helper method to determine product type based on the actual entity type
     */
    default ProductType getProductType(Product product) {
        if (product instanceof Book) {
            return ProductType.BOOK;
        }
        // Add other product types here as they are implemented
        throw new IllegalArgumentException("Unknown product type: " + product.getClass().getSimpleName());
    }
}
