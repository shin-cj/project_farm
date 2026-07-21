package me.soldesk.springbootback.domain.product.repository;

import me.soldesk.springbootback.domain.product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByCategoryId(Long categoryId);
    @Query(value = """
    SELECT *
    FROM products
    WHERE product_name LIKE '%' || :keyword || '%'
        AND product_status = :status
        AND stock_quantity > :stockQuantity
    ORDER BY price ASC
    FETCH FIRST 1 ROWS ONLY
    """, nativeQuery = true)
    Optional<Product> findLowestPriceProductByKeyword(
            @Param("keyword") String productName,
            @Param("status")String productStatus,
            @Param("stockQuantity")Integer stockQuantity);

    List<Product> findByFarmId(Long farmId);
    
    List<Product> findByFarmIdAndCategoryId(Long farmId, Long categoryId);

    @Query("""
    SELECT p
    FROM Product p
    WHERE (:categoryId IS NULL OR p.categoryId = :categoryId)
      AND (:farmId IS NULL OR p.farmId = :farmId)
      AND (:productStatus IS NULL OR p.productStatus = :productStatus)
    """)
    List<Product> findProducts(
            @Param("categoryId") Long categoryId,
            @Param("farmId") Long farmId,
            @Param("productStatus") String productStatus
    );

    @Query("""
    SELECT p
    FROM Product p, Farm f
    WHERE p.farmId = f.farmId
      AND f.approvalStatus = 'APPROVED'
      AND p.productStatus IN ('ON_SALE', 'SOLD_OUT')
      AND (:categoryId IS NULL OR p.categoryId = :categoryId)
      AND (:farmId IS NULL OR p.farmId = :farmId)
    """)
    List<Product> findPublicProducts(
            @Param("categoryId") Long categoryId,
            @Param("farmId") Long farmId
    );
}
