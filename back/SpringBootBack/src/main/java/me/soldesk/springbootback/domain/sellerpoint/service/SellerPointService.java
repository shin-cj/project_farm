package me.soldesk.springbootback.domain.sellerpoint.service;

import lombok.RequiredArgsConstructor;
import me.soldesk.springbootback.domain.farm.entity.Farm;
import me.soldesk.springbootback.domain.farm.repository.FarmRepository;
import me.soldesk.springbootback.domain.order.entity.Order;
import me.soldesk.springbootback.domain.order.repository.OrderRepository;
import me.soldesk.springbootback.domain.sellerpoint.dto.SellerPointHistoryResponse;
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
    private final OrderRepository orderRepository;

    public void earnPoint(Order order) {
        if (sellerPointRepository.findByOrderId(order.getOrderId()).isPresent()) {
            return;
        }

        Farm farm = farmRepository.findById(order.getFarmId())
                .orElseThrow(() -> new IllegalArgumentException("농장 정보가 없습니다."));

        Long totalAmount = order.getTotalProductPrice();
        Long platformFee = Math.round(totalAmount * PLATFORM_FEE_RATE);
        Long sellerPointAmount = totalAmount - platformFee;

        SellerPoint sellerPoint = new SellerPoint();
        sellerPoint.setSellerId(farm.getSellerId());
        sellerPoint.setOrderId(order.getOrderId());
        sellerPoint.setTotalAmount(totalAmount);
        sellerPoint.setPlatformFee(platformFee);
        sellerPoint.setSellerPoint(sellerPointAmount);
        sellerPoint.setPointStatus("PENDING");

        sellerPointRepository.save(sellerPoint);
    }

    public void settlePoint(Order order) {
        SellerPoint sellerPoint = sellerPointRepository.findByOrderId(order.getOrderId())
                .orElseGet(() -> {
                    earnPoint(order);
                    return sellerPointRepository.findByOrderId(order.getOrderId())
                            .orElseThrow(() -> new IllegalStateException("정산 포인트를 생성하지 못했습니다."));
                });

        if ("EARNED".equals(sellerPoint.getPointStatus())) {
            return;
        }

        if (!"PENDING".equals(sellerPoint.getPointStatus())) {
            throw new IllegalArgumentException("취소 또는 환불된 주문은 정산할 수 없습니다.");
        }

        sellerPoint.setPointStatus("EARNED");
        sellerPoint.setUpdatedAt(LocalDateTime.now());
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

        Long pendingPoint = sellerPoints.stream()
                .filter(point -> "PENDING".equals(point.getPointStatus()))
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
                pendingPoint,
                availablePoint,
                canceledPoint,
                refundedPoint,
                totalPlatformFee
        );
    }

    public List<SellerPointHistoryResponse> getHistory(Long sellerId) {
        return sellerPointRepository.findBySellerIdOrderByCreatedAtDesc(sellerId).stream()
                .map(this::toHistoryResponse)
                .toList();
    }

    private SellerPointHistoryResponse toHistoryResponse(SellerPoint sellerPoint) {
        SellerPointHistoryResponse response = new SellerPointHistoryResponse();
        response.setPointId(sellerPoint.getPointId());
        response.setOrderId(sellerPoint.getOrderId());
        response.setOrderNumber(orderRepository.findById(sellerPoint.getOrderId())
                .map(Order::getOrderNumber)
                .orElse("주문 정보 없음"));
        response.setTotalAmount(sellerPoint.getTotalAmount());
        response.setPlatformFee(sellerPoint.getPlatformFee());
        response.setSellerPoint(sellerPoint.getSellerPoint());
        response.setPointStatus(sellerPoint.getPointStatus());
        response.setCreatedAt(sellerPoint.getCreatedAt());
        response.setUpdatedAt(sellerPoint.getUpdatedAt());
        return response;
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
