package com.jarothi.spot.jarothispot.catalog;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import java.math.BigDecimal;

@Entity
@DiscriminatorValue("BOOK")
public class Book extends Product {

    // Constructors
    public Book() {
        super();
    }

    public Book(String title, String description, BigDecimal price) {
        super(title, description, price);
    }

    // Por ahora sin campos extra según los requerimientos
    // Se pueden agregar campos específicos de libros en el futuro como:
    // - String author
    // - String isbn
    // - Integer pages
    // - Date publishedDate
    // etc.
}
