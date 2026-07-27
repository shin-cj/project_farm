package me.soldesk.springbootback.domain.sellerpoint.service;

import lombok.RequiredArgsConstructor;
import me.soldesk.springbootback.domain.farm.entity.Farm;
import me.soldesk.springbootback.domain.farm.repository.FarmRepository;
import me.soldesk.springbootback.domain.order.entity.Order;
import me.soldesk.springbootback.domain.sellerpoint.dto.SellerPointSummaryResponse;
import me.soldesk.springbootback.domain.sellerpoint.entity.SellerPoint;
import me.soldesk.springbootback.domain.sellerpoint.repository.SellerPointRepository;
import me.soldesk.springbootback.domain.sellerpoint.repository.SellerPointWithdrawalRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SellerPointService {

    private static final double PLATFORM_FEE_RATE = 0.05;

    private final SellerPointRepository sellerPointRepository;
    private final SellerPointWithdrawalRepository sellerPointWithdrawalRepository;
    private final FarmRepository farmRepository;

    public void earnPoint(Order order) {
        if (sellerPointRepository.findByOrderId(order.getOrderId()).isPresent()) {
            return;
        }

        Farm farm = farmRepository.findById(order.getFarmId())
                .orElseThrow(() -> new IllegalArgumentException("농장 정보가 없습니다."));

        Long totalAmount = order.getFinalPrice();
        Long platformFee = Math.round(totalAmount * PLATFORM_FEE_RATE);
        Long sellerPointAmount = totalAmount - platformFee;

        SellerPoint sellerPoint = new SellerPoint();
        sellerPoint.setSellerId(farm.getSellerId());
        sellerPoint.setOrderId(order.getOrderId());
        sellerPoint.setTotalAmount(totalAmount);
        sellerPoint.setPlatformFee(platformFee);
        sellerPoint.setSellerPoint(sellerPointAmount);
        sellerPoint.setPointStatus("EARNED");

        sellerPointRepository.save(sellerPoint);
    }

    public void markCanceled(Long orderId) {
        updatePointStatus(orderId, "CANCELED");
    }

    public void markRefunded(Long orderId) {
        updatePointStatus(orderId, "REFUNDED");
    }

    public SellerPointSummaryResponse getSummary(Long sellerId) {
        List<SellerPoint> sellerPoints = sellerPointRepository.findBySellerIdOrderByCreatedAtDesc(sellerId);

        Long totalEarnedPoint = sellerPoints.stream()
                .filter(point -> "EARNED".equals(point.getPointStatus()))
                .mapToLong(SellerPoint::getSellerPoint)
                .sum();

        Long canceledPoint = sellerPoints.stream()
                .filter(point -> "CANCELED".equals(point.getPointStatus()))
                .mapToLong(SellerPoint::getSellerPoint)
                .sum();

        Long refundedPoint = sellerPoints.stream()
                .filter(point -> "REFUNDED".equals(point.getPointStatus()))
                .mapToLong(SellerPoint::getSellerPoint)
                .sum();

        Long totalPlatformFee = sellerPoints.stream()
                .filter(point -> "EARNED".equals(point.getPointStatus()))
                .mapToLong(SellerPoint::getPlatformFee)
                .sum();

        Long lockedWithdrawalPoint = sellerPointWithdrawalRepository.findBySellerIdOrderByRequestedAtDesc(sellerId).stream()
                .filter(withdrawal -> List.of("REQUESTED", "APPROVED", "COMPLETED")
                        .contains(withdrawal.getWithdrawalStatus()))
                .mapToLong(withdrawal -> withdrawal.getWithdrawalAmount())
                .sum();

        Long availablePoint = Math.max(totalEarnedPoint - lockedWithdrawalPoint, 0L);

        return new SellerPointSummaryResponse(
                totalEarnedPoint,
                availablePoint,
                canceledPoint,
                refundedPoint,
                totalPlatformFee
        );
    }

    private void updatePointStatus(Long orderId, String pointStatus) {
        SellerPoint sellerPoint = sellerPointRepository.findByOrderId(orderId)
                .orElse(null);

        if (sellerPoint == null) {
            return;
        }

        sellerPoint.setPointStatus(pointStatus);
        sellerPoint.setUpdatedAt(LocalDateTime.now());
        sellerPointRepository.save(sellerPoint);
    }
}
