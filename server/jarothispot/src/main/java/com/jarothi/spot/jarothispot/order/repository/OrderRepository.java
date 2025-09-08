package com.jarothi.spot.jarothispot.order.repository;

import com.jarothi.spot.jarothispot.order.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface OrderRepository extends JpaRepository<Order, UUID> {

    @Query("SELECT o FROM Order o WHERE o.user.id = :userId ORDER BY o.createdAt DESC")
    List<Order> findByUserIdOrderByCreatedAtDesc(@Param("userId") UUID userId);

    @Query("SELECT o FROM Order o WHERE o.user.id = :userId")
    Page<Order> findByUserIdOrderByCreatedAtDesc(@Param("userId") UUID userId, Pageable pageable);

    @Query("SELECT o FROM Order o JOIN FETCH o.items oi JOIN FETCH oi.product WHERE o.id = :orderId")
    Order findByIdWithItems(@Param("orderId") UUID orderId);
}
