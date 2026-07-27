package me.soldesk.springbootback.domain.stockhistory.service;

import me.soldesk.springbootback.domain.stockhistory.dto.ProductStockHistoryResponse;
import me.soldesk.springbootback.domain.stockhistory.entity.ProductStockHistory;
import me.soldesk.springbootback.domain.stockhistory.repository.ProductStockHistoryRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 재고를 실제로 변경하는 상품·결제 기능에서 공통으로 사용하는 이력 기록 서비스입니다.
 * 재고 자체를 바꾸지는 않고, 바뀐 전후 값을 전달받아 이력만 저장합니다.
 */
@Service
public class ProductStockHistoryService {

    private final ProductStockHistoryRepository productStockHistoryRepository;

    public ProductStockHistoryService(
            ProductStockHistoryRepository productStockHistoryRepository
    ) {
        this.productStockHistoryRepository = productStockHistoryRepository;
    }

    public void record(
            Long productId,
            Long orderId,
            String changeType,
            Integer previousQuantity,
            Integer currentQuantity,
            String changeReason
    ) {
        int previous = previousQuantity == null ? 0 : previousQuantity;
        int current = currentQuantity == null ? 0 : currentQuantity;

        ProductStockHistory history = new ProductStockHistory();
        history.setProductId(productId);
        history.setOrderId(orderId);
        history.setChangeType(changeType);
        history.setPreviousQuantity(previous);
        history.setChangeQuantity(current - previous);
        history.setCurrentQuantity(current);
        history.setChangeReason(changeReason);
        history.setCreatedAt(LocalDateTime.now());

        productStockHistoryRepository.save(history);
    }

    public List<ProductStockHistoryResponse> getProductStockHistories(Long productId) {
        return productStockHistoryRepository
                .findByProductIdOrderByCreatedAtDesc(productId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private ProductStockHistoryResponse toResponse(ProductStockHistory history) {
        ProductStockHistoryResponse response = new ProductStockHistoryResponse();
        response.setStockHistoryId(history.getStockHistoryId());
        response.setProductId(history.getProductId());
        response.setOrderId(history.getOrderId());
        response.setChangeType(history.getChangeType());
        response.setPreviousQuantity(history.getPreviousQuantity());
        response.setChangeQuantity(history.getChangeQuantity());
        response.setCurrentQuantity(history.getCurrentQuantity());
        response.setChangeReason(history.getChangeReason());
        response.setCreatedAt(history.getCreatedAt());
        return response;
    }
}
