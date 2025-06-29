package com.slneurorobotics.backend.repository;

import com.slneurorobotics.backend.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    List<CartItem> findByCartId(Long cartId);

    Optional<CartItem> findByCartIdAndProductId(Long cartId, Long productId);

    void deleteByCartId(Long cartId);

    int countByCartId(Long cartId);

    @Query("SELECT COUNT(ci) FROM CartItem ci WHERE ci.createdBy = :userId")
    Integer countDistinctItemsByUserId(@Param("userId") Long userId);


}
