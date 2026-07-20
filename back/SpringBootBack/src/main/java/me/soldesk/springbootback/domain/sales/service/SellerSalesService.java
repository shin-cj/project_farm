package me.soldesk.springbootback.domain.sales.service;

import me.soldesk.springbootback.domain.farm.entity.Farm;
import me.soldesk.springbootback.domain.farm.repository.FarmRepository;
import me.soldesk.springbootback.domain.order.entity.Order;
import me.soldesk.springbootback.domain.order.repository.OrderRepository;
import me.soldesk.springbootback.domain.sales.dto.SellerSalesTrendResponse;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;


@Service
public class SellerSalesService {

    private final FarmRepository farmRepository;
    private final OrderRepository orderRepository;

    public SellerSalesService(FarmRepository farmRepository,OrderRepository orderRepository){
        this.farmRepository = farmRepository;
        this.orderRepository = orderRepository;
    }

    public List<SellerSalesTrendResponse> getSalesTrend(Long sellerId,int days){
        List<Long> farmIds= farmRepository.findBySellerId(sellerId)
                .stream()
                .map(Farm::getFarmId)
                .toList();
        if(farmIds.isEmpty()){
            return createEmptySalesTrend(days);
        }

        LocalDate today = LocalDate.now();
        LocalDate startDate = today.minusDays(days - 1);

        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = today.plusDays(1).atStartOfDay();

        List<Order> orders = orderRepository.findByFarmIdInAndOrderedAtBetweenOrderByOrderedAtAsc(
                farmIds,
                startDateTime,
                endDateTime
        );

        Map<LocalDate,DailySales> salesMap = new LinkedHashMap<>();

        for(int i = days - 1;i>=0;i--){
            LocalDate date = today.minusDays(i);
            salesMap.put(date,new DailySales());
        }

        for (Order order : orders){
            if(!isSalesOrder(order)){
                continue;
            }

            LocalDate orderDate = order.getOrderedAt().toLocalDate();
            DailySales dailySales = salesMap.get(orderDate);

            if(dailySales == null){
                continue;
            }
            dailySales.sales += order.getFinalPrice();
            dailySales.orderCount +=1;
        }

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM/dd");

        return salesMap.entrySet()
                .stream()
                .map(entry -> new SellerSalesTrendResponse(
                        entry.getKey().format(formatter),
                        entry.getValue().sales,
                        entry.getValue().orderCount
                ))
                .toList();
    }

    private boolean isSalesOrder(Order order) {
        return "PAID".equals(order.getOrderStatus())
                || "REFUND_REQUESTED".equals(order.getOrderStatus());
    }

    private List<SellerSalesTrendResponse> createEmptySalesTrend(int days){
        LocalDate today = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM/dd");

        return java.util.stream.IntStream.rangeClosed(1,days)
                .mapToObj(index -> today.minusDays(days-index))
                .map(date -> new SellerSalesTrendResponse(
                        date.format(formatter), 0L, 0L
                ))
                .toList();
    }

    private static class DailySales {
        private Long sales = 0L;
        private Long orderCount = 0L;
    }


}
