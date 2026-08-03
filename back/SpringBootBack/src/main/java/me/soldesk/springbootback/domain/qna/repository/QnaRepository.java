package me.soldesk.springbootback.domain.qna.repository;


import me.soldesk.springbootback.domain.qna.dto.QnaResponse;
import me.soldesk.springbootback.domain.qna.entity.Qna;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface QnaRepository extends JpaRepository<Qna, Long> {
    // 상품 ID로 QnA 목록 조회
    List<Qna> findByProductIdAndDeletedAtIsNullOrderByCreatedAtDesc(Long productId);

    List<Qna> findByDeletedAtIsNullOrderByCreatedAtDesc();

    List<Qna> findByBuyerIdOrderByCreatedAtDesc(Long buyerId);

    @Query("SELECT u.name FROM User u WHERE u.userId = :userId")
    String findNameByUserId(Long userId);

    @Query("SELECT p.productName FROM Product p WHERE p.productId = :productId")
    String findProductNameByProductId(Long productId);
}
