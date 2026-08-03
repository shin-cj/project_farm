package me.soldesk.springbootback.domain.order.scheduler;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import me.soldesk.springbootback.domain.delivery.entity.Delivery;
import me.soldesk.springbootback.domain.delivery.repository.DeliveryRepository;
import me.soldesk.springbootback.domain.order.service.OrderService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class PurchaseConfirmationScheduler {

    private final DeliveryRepository deliveryRepository;
    private final OrderService orderService;

    @Scheduled(cron = "${order.purchase-confirmation.cron:0 */10 * * * *}")
    public void confirmDeliveredOrders() {
        LocalDateTime cutoff = LocalDateTime.now().minusDays(2);
        List<Delivery> dueDeliveries = deliveryRepository
                .findByDeliveryStatusAndDeliveredAtLessThanEqual("DELIVERED", cutoff);

        int confirmedCount = 0;

        for (Delivery delivery : dueDeliveries) {
            try {
                if (orderService.confirmPurchaseAutomatically(delivery.getOrderId())) {
                    confirmedCount++;
                }
            } catch (RuntimeException exception) {
                log.error(
                        "자동 구매확정 처리 실패: orderId={}",
                        delivery.getOrderId(),
                        exception
                );
            }
        }

        if (confirmedCount > 0) {
            log.info("자동 구매확정 완료: {}건", confirmedCount);
        }
    }
}
