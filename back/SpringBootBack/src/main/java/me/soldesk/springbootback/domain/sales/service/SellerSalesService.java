package me.soldesk.springbootback.domain.sales.service;

import me.soldesk.springbootback.domain.farm.entity.Farm;
import me.soldesk.springbootback.domain.farm.repository.FarmRepository;
import me.soldesk.springbootback.domain.order.entity.Order;
import me.soldesk.springbootback.domain.order.repository.OrderRepository;
import me.soldesk.springbootback.domain.orderitem.entity.OrderItem;
import me.soldesk.springbootback.domain.orderitem.repository.OrderItemRepository;
import me.soldesk.springbootback.domain.product.entity.Product;
import me.soldesk.springbootback.domain.product.repository.ProductRepository;
import me.soldesk.springbootback.domain.review.entity.Review;
import me.soldesk.springbootback.domain.review.repository.ReviewRepository;
import me.soldesk.springbootback.domain.sales.dto.*;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;


@Service
public class SellerSalesService {

    private final FarmRepository farmRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;

    public SellerSalesService(FarmRepository farmRepository, OrderRepository orderRepository, OrderItemRepository orderItemRepository, ReviewRepository reviewRepository, ProductRepository productRepository){
        this.farmRepository = farmRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
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
            dailySales.sales += order.getTotalProductPrice();
            dailySales.orderCount +=1;

            List<OrderItem> orderItems = orderItemRepository.findByOrderId(order.getOrderId());

            for(OrderItem orderItem : orderItems){
                dailySales.soldProduct.add(orderItem.getProductName());
            }
        }

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM/dd");

        return salesMap.entrySet()
                .stream()
                .map(entry -> new SellerSalesTrendResponse(
                        entry.getKey().format(formatter),
                        entry.getValue().sales,
                        entry.getValue().orderCount,
                        entry.getValue().soldProduct
                ))
                .toList();
    }

    private boolean isSalesOrder(Order order) {
        return "PAID".equals(order.getOrderStatus())
                || "PURCHASE_CONFIRMED".equals(order.getOrderStatus())
                || "REFUND_REQUESTED".equals(order.getOrderStatus());
    }

    private List<SellerSalesTrendResponse> createEmptySalesTrend(int days){
        LocalDate today = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM/dd");

        return java.util.stream.IntStream.rangeClosed(1,days)
                .mapToObj(index -> today.minusDays(days-index))
                .map(date -> new SellerSalesTrendResponse(
                        date.format(formatter), 0L, 0L,List.of()
                ))
                .toList();
    }

    private static class DailySales {
        private Long sales = 0L;
        private Long orderCount = 0L;
        private List<String> soldProduct = new ArrayList<>();
    }

    private static class ProductSales{
        private Long quantity = 0L;
        private Long sales = 0L;
    }

    private static class FarmSales {
        private String farmName;
        private Long sales = 0L;
        private Long orderCount = 0L;
    }

    private static class TimeSlotSales {
        private Long sales = 0L;
        private Long orderCount = 0L;
    }

    public SellerSalesStatisticsResponse getSalesStatistics(Long sellerId,int days){
        List<Long> farmIds = farmRepository.findBySellerId(sellerId)
                .stream()
                .map(Farm::getFarmId)
                .toList();

        if (farmIds.isEmpty()){
            return new SellerSalesStatisticsResponse(0L,0L,0L,0L,List.of(),List.of(), createEmptyTimeSlotSales(),0L,List.of());
        }

        LocalDate today = LocalDate.now();
        LocalDate startDate = today.minusDays(days-1);

        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = today.plusDays(1).atStartOfDay();

        List<Order> orders = orderRepository.findByFarmIdInAndOrderedAtBetweenOrderByOrderedAtAsc(
                farmIds,
                startDateTime,
                endDateTime
        );

        Long totalSales = orders.stream()
                .filter(this::isSalesOrder)
                .mapToLong(Order::getTotalProductPrice)
                .sum();

        Long totalOrderCount = orders.stream()
                .filter(this::isSalesOrder)
                .count();

        Map<String,ProductSales> productSalesMap = new HashMap<>();

        orders.stream().filter(this::isSalesOrder)
                .forEach(order->{
                    List<OrderItem> orderItems = orderItemRepository.findByOrderId(order.getOrderId());

                    for(OrderItem orderItem : orderItems){
                        ProductSales productSales = productSalesMap.computeIfAbsent(
                                orderItem.getProductName(),
                                key -> new ProductSales()
                        );

                        productSales.quantity +=orderItem.getQuantity();
                        productSales.sales += orderItem.getItemTotalPrice();
                    }
                });

        List<SellerTopProductResponse> topProduct = productSalesMap.entrySet()
                .stream()
                .map(entry->new SellerTopProductResponse(
                        entry.getKey(),
                        entry.getValue().quantity,
                        entry.getValue().sales
                )).sorted((a,b)->Long.compare(b.getSales(), a.getSales()))
                .limit(3)
                .toList();

        Map<Long,FarmSales> farmSalesMap = new HashMap<>();

        orders.stream()
                .filter(this::isSalesOrder)
                .forEach(order->{
                    FarmSales farmSales = farmSalesMap.computeIfAbsent(
                            order.getFarmId(),
                            farmId -> {
                                FarmSales newFarmSales = new FarmSales();
                                newFarmSales.farmName = farmRepository.findById(farmId)
                                        .map(Farm::getFarmName)
                                        .orElse("농장 정보 없음");
                                return newFarmSales;
                            }
                    );

                    farmSales.sales += order.getTotalProductPrice();
                    farmSales.orderCount += 1;
                });

        List<SellerFarmSalesResponse> farmSales = farmSalesMap.entrySet()
                .stream()
                .map(entry->new SellerFarmSalesResponse(
                        entry.getKey(),
                        entry.getValue().farmName,
                        entry.getValue().sales,
                        entry.getValue().orderCount
                ))
                .sorted((a,b)->Long.compare(b.getSales(),a.getSales()))
                .toList();

        Long averageOrderAmount = totalOrderCount == 0 ? 0L : totalSales / totalOrderCount;

        Long canceledOrRefundedOrderCount = orders.stream()
                .filter(order ->
                        "CANCELED".equals(order.getOrderStatus())||"REFUNDED".equals(order.getOrderStatus()))
                .count();

        List<SellerTimeSlotSalesResponse> timeSlotSales = createTimeSlotSales(orders);
        List<Long> productIds = new ArrayList<>();
        for (Long farmId : farmIds) {
            List<Product> products = productRepository.findByFarmId(farmId);
            for (Product findId : products) {
                productIds.add(findId.getProductId());
            }
        }
        long reviewTotalCount = 0L;
        for (Long productId : productIds){
            long reviewCount = reviewRepository.countByProductId(productId);
            reviewTotalCount += reviewCount;
        }

        List<ReviewSummaryResponse> recentReviews = List.of();
        if (!productIds.isEmpty()) {
            Pageable pageable = PageRequest.of(0, 5); // 최신 리뷰 3개 제한
            List<Review> topReviews = reviewRepository.findTopReviewsByProductIds(productIds, pageable);

            recentReviews = topReviews.stream()
                    .map(review -> {
                        String userName = reviewRepository.findNameByUserId(review.getBuyerId()); // <-- 작성자 이름 필드명에 맞게 변경하세요!

                        return ReviewSummaryResponse.from(review, userName);
                    })
                    .toList();
        }
        return new SellerSalesStatisticsResponse(
                totalSales,
                totalOrderCount,
                averageOrderAmount,
                canceledOrRefundedOrderCount,
                topProduct,
                farmSales,
                timeSlotSales,
                reviewTotalCount,
                recentReviews
        );

    }

    private List<SellerTimeSlotSalesResponse> createTimeSlotSales(List<Order> orders) {
        Map<String, TimeSlotSales> timeSlotSalesMap = new LinkedHashMap<>();

        timeSlotSalesMap.put("오전", new TimeSlotSales());
        timeSlotSalesMap.put("오후", new TimeSlotSales());
        timeSlotSalesMap.put("저녁", new TimeSlotSales());
        timeSlotSalesMap.put("밤", new TimeSlotSales());

        orders.stream()
                .filter(this::isSalesOrder)
                .forEach(order -> {
                    String timeSlotLabel = getTimeSlotLabel(order.getOrderedAt().getHour());
                    TimeSlotSales timeSlotSales = timeSlotSalesMap.get(timeSlotLabel);

                    timeSlotSales.orderCount += 1;
                    timeSlotSales.sales += order.getTotalProductPrice();
                });

        return timeSlotSalesMap.entrySet()
                .stream()
                .map(entry -> new SellerTimeSlotSalesResponse(
                        entry.getKey(),
                        entry.getValue().orderCount,
                        entry.getValue().sales
                ))
                .toList();
    }

    private List<SellerTimeSlotSalesResponse> createEmptyTimeSlotSales() {
        return List.of(
                new SellerTimeSlotSalesResponse("오전", 0L, 0L),
                new SellerTimeSlotSalesResponse("오후", 0L, 0L),
                new SellerTimeSlotSalesResponse("저녁", 0L, 0L),
                new SellerTimeSlotSalesResponse("밤", 0L, 0L)
        );
    }

    private String getTimeSlotLabel(int hour) {
        if (hour >= 6 && hour < 12) {
            return "오전";
        }

        if (hour >= 12 && hour < 18) {
            return "오후";
        }

        if (hour >= 18 && hour < 22) {
            return "저녁";
        }

        return "밤";
    }


}
