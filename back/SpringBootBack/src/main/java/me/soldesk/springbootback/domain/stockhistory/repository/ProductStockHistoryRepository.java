package me.soldesk.springbootback.domain.stockhistory.repository;

import me.soldesk.springbootback.domain.stockhistory.entity.ProductStockHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/** 상품별 재고 이력을 최신순으로 조회합니다. */
public interface ProductStockHistoryRepository
        extends JpaRepository<ProductStockHistory, Long> {

    List<ProductStockHistory> findByProductIdOrderByCreatedAtDesc(Long productId);
}
