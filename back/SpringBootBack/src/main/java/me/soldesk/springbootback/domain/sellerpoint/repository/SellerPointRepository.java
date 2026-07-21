package me.soldesk.springbootback.domain.sellerpoint.repository;

import me.soldesk.springbootback.domain.sellerpoint.entity.SellerPoint;
import me.soldesk.springbootback.domain.sellerpoint.entity.SellerPointGoal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SellerPointRepository extends JpaRepository<SellerPoint, Long> {

    Optional<SellerPoint> findByOrderId(Long orderId);

    List<SellerPoint> findBySellerIdOrderByCreatedAtDesc(Long sellerId);

    List<SellerPoint> findBySellerIdAndPointStatusAndCreatedAtBetween(Long sellerId,String pointStatus,
                                                                      java.time.LocalDateTime startDateTime,
                                                                      java.time.LocalDateTime endDateTime);
}
