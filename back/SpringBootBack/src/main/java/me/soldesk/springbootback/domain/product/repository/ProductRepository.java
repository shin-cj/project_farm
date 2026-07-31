package me.soldesk.springbootback.domain.product.repository;

import me.soldesk.springbootback.domain.product.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByCategoryId(Long categoryId);
    @Query(value = """
    SELECT p.*
    FROM products p
    JOIN farms f
      ON f.farm_id = p.farm_id
    WHERE p.product_name LIKE '%' || :keyword || '%'
      AND p.product_status = :status
      AND p.stock_quantity > :stockQuantity
      AND p.stock_quantity >= NVL(p.min_order_quantity, 1)
      AND f.sale_type = :saleType
      AND f.approval_status = 'APPROVED'  
    ORDER BY p.price ASC
    FETCH FIRST 1 ROWS ONLY
    """, nativeQuery = true)
    Optional<Product> findLowestPriceProductByKeyword(
            @Param("keyword") String productName,
            @Param("status") String productStatus,
            @Param("stockQuantity") Integer stockQuantity,
            @Param("saleType") String saleType
    );

    List<Product> findByFarmId(Long farmId);
    
    List<Product> findByFarmIdAndCategoryId(Long farmId, Long categoryId);

    @Query("""
    SELECT p
    FROM Product p
    WHERE (:categoryId IS NULL OR p.categoryId = :categoryId)
      AND (:farmId IS NULL OR p.farmId = :farmId)
      AND (:productStatus IS NULL OR p.productStatus = :productStatus)
      AND p.productStatus <> 'DELETED'
    """)
    List<Product> findProducts(
            @Param("categoryId") Long categoryId,
            @Param("farmId") Long farmId,
            @Param("productStatus") String productStatus
    );

    /**
     * 결제 대기, 배송 준비·진행 또는 환불 요청 중인 주문은 상품 삭제를 막습니다.
     * 배송 정보가 아직 없으면 배송 준비 상태로 처리합니다.
     */
    @Query(value = """
    SELECT COUNT(*)
    FROM order_items oi
    JOIN orders o
      ON o.order_id = oi.order_id
    LEFT JOIN deliveries d
      ON d.order_id = o.order_id
    WHERE oi.product_id = :productId
      AND o.order_status NOT IN ('CANCELED', 'REFUNDED')
      AND NOT (
          o.order_status = 'PAID'
          AND NVL(d.delivery_status, 'READY') = 'DELIVERED'
      )
    """, nativeQuery = true)
    long countActiveOrdersByProductId(@Param("productId") Long productId);

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

    /**
     * 승인된 농장의 공개 상품을 구매자 조건에 맞춰 페이지 단위로 조회합니다.
     * 상품명은 공백을 제거한 뒤 비교하므로 "하우스 토마토"와 "하우스토마토"를
     * 같은 검색어로 처리할 수 있습니다.
     */
    @Query(
            value = """
            SELECT p
            FROM Product p, Farm f, Category c
            WHERE p.farmId = f.farmId
              AND p.categoryId = c.categoryId
              AND f.approvalStatus = 'APPROVED'
              AND p.productStatus IN ('ON_SALE', 'SOLD_OUT')
              AND (:categoryId IS NULL OR p.categoryId = :categoryId)
              AND (:marketCategoryCode IS NULL OR c.marketCategoryCode = :marketCategoryCode)
              AND (
                    :marketItemCode IS NULL
                    OR p.marketItemCode = :marketItemCode
                    OR (
                        p.marketItemCode IS NULL
                        AND :keyword IS NOT NULL
                        AND LOWER(FUNCTION('REPLACE', p.productName, ' ', ''))
                            LIKE CONCAT('%', :keyword, '%')
                    )
              )
              AND f.saleType = :saleType
              AND (
                    :keyword IS NULL
                    OR LOWER(FUNCTION('REPLACE', p.productName, ' ', ''))
                       LIKE CONCAT('%', :keyword, '%')
              )
            """,
            countQuery = """
            SELECT COUNT(p)
            FROM Product p, Farm f, Category c
            WHERE p.farmId = f.farmId
              AND p.categoryId = c.categoryId
              AND f.approvalStatus = 'APPROVED'
              AND p.productStatus IN ('ON_SALE', 'SOLD_OUT')
              AND (:categoryId IS NULL OR p.categoryId = :categoryId)
              AND (:marketCategoryCode IS NULL OR c.marketCategoryCode = :marketCategoryCode)
              AND (
                    :marketItemCode IS NULL
                    OR p.marketItemCode = :marketItemCode
                    OR (
                        p.marketItemCode IS NULL
                        AND :keyword IS NOT NULL
                        AND LOWER(FUNCTION('REPLACE', p.productName, ' ', ''))
                            LIKE CONCAT('%', :keyword, '%')
                    )
              )
              AND f.saleType = :saleType
              AND (
                    :keyword IS NULL
                    OR LOWER(FUNCTION('REPLACE', p.productName, ' ', ''))
                       LIKE CONCAT('%', :keyword, '%')
              )
            """
    )
    Page<Product> findPublicProductPage(
            @Param("categoryId") Long categoryId,
            @Param("marketCategoryCode") String marketCategoryCode,
            @Param("marketItemCode") String marketItemCode,
            @Param("saleType") String saleType,
            @Param("keyword") String keyword,
            Pageable pageable
    );
}
