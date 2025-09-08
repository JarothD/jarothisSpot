package com.jarothi.spot.jarothispot.catalog.dto;

import com.jarothi.spot.jarothispot.catalog.Category;
import org.mapstruct.*;

import java.util.List;

/**
 * MapStruct mapper for Category entity and CategoryDTO
 */
@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface CategoryMapper {

    CategoryDTO toDTO(Category category);

    Category toEntity(CategoryDTO categoryDTO);

    List<CategoryDTO> toDTOList(List<Category> categories);

    List<Category> toEntityList(List<CategoryDTO> categoryDTOs);

    /**
     * Map CategoryCreateDTO to Category entity
     */
    @Mapping(target = "id", ignore = true)
    Category toEntity(CategoryCreateDTO categoryCreateDTO);

    /**
     * Update Category entity from CategoryUpdateDTO
     * Null values in DTO will not update the entity
     */
    @Mapping(target = "id", ignore = true)
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateCategoryFromDTO(CategoryUpdateDTO updateDTO, @MappingTarget Category category);
}
