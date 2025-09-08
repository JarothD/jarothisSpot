package com.jarothi.spot.jarothispot.catalog.dto;

import com.jarothi.spot.jarothispot.catalog.Book;
import org.mapstruct.*;

import java.util.List;

/**
 * MapStruct mapper specifically for Book entity operations
 */
@Mapper(
    componentModel = MappingConstants.ComponentModel.SPRING,
    uses = {CategoryMapper.class}
)
public interface BookMapper {

    /**
     * Convert Book entity to ProductDTO
     */
    @Mapping(target = "productType", constant = "BOOK")
    ProductDTO toProductDTO(Book book);

    /**
     * Convert list of Books to list of ProductDTOs
     */
    List<ProductDTO> toProductDTOList(List<Book> books);

    /**
     * Map BookCreateDTO to Book entity
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "active", constant = "true")
    @Mapping(target = "categories", ignore = true)
    Book toEntity(BookCreateDTO bookCreateDTO);

    /**
     * Update Book entity from ProductUpdateDTO
     * Null values in DTO will not update the entity
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "active", ignore = true)
    @Mapping(target = "categories", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateBookFromDTO(ProductUpdateDTO updateDTO, @MappingTarget Book book);
}
