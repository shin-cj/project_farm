package me.soldesk.springbootback.domain.cartitem.repository;

import me.soldesk.springbootback.domain.cartitem.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    @Query("SELECT ci FROM CartItem ci WHERE ci.cartId = :cartId")
    List<CartItem> findByCartId(@Param("cartId") Long cartid);

    @Query("""
        SELECT ci
        FROM CartItem ci    
        WHERE ci.cartId = :cartId
            AND ci.productId = :productId
    """)
    Optional<CartItem>findByCartIdAndProductId(@Param("cartId") Long cartid,
                                               @Param("productId") Long productId);
}
