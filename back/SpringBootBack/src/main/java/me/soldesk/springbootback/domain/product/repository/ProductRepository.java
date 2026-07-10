package me.soldesk.springbootback.domain.product.repository;

import me.soldesk.springbootback.domain.product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByCategoryId(Long categoryId);
    Optional<Product> findFirstByProductNameContainingAndProductStatusAndStockQuantityGreaterThanOrderByPriceAsc(
            String productName,
            String productStatus,
            Integer stockQuantity
    );
}