package me.soldesk.springbootback.domain.payment.service;

import me.soldesk.springbootback.domain.delivery.repository.DeliveryRepository;
import me.soldesk.springbootback.domain.farm.repository.FarmRepository;
import me.soldesk.springbootback.domain.order.entity.Order;
import me.soldesk.springbootback.domain.order.repository.OrderRepository;
import me.soldesk.springbootback.domain.orderitem.entity.OrderItem;
import me.soldesk.springbootback.domain.orderitem.repository.OrderItemRepository;
import me.soldesk.springbootback.domain.payment.dto.PaymentConfirmRequest;
import me.soldesk.springbootback.domain.payment.repository.PaymentRepository;
import me.soldesk.springbootback.domain.product.entity.Product;
import me.soldesk.springbootback.domain.product.repository.ProductRepository;
import me.soldesk.springbootback.domain.sellerpoint.service.SellerPointService;
import me.soldesk.springbootback.domain.stockhistory.service.ProductStockHistoryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.client.ExpectedCount.once;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withStatus;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

class PaymentServiceTest {

    private PaymentRepository paymentRepository;
    private OrderRepository orderRepository;
    private OrderItemRepository orderItemRepository;
    private ProductRepository productRepository;
    private SellerPointService sellerPointService;
    private PaymentService paymentService;
    private MockRestServiceServer server;

    private Order order;
    private Product product;
    private PaymentConfirmRequest request;

    @BeforeEach
    void setUp() {
        paymentRepository = mock(PaymentRepository.class);
        orderRepository = mock(OrderRepository.class);
        orderItemRepository = mock(OrderItemRepository.class);
        productRepository = mock(ProductRepository.class);
        DeliveryRepository deliveryRepository = mock(DeliveryRepository.class);
        FarmRepository farmRepository = mock(FarmRepository.class);
        sellerPointService = mock(SellerPointService.class);
        ProductStockHistoryService stockHistoryService = mock(ProductStockHistoryService.class);

        RestClient.Builder restClientBuilder = RestClient.builder();
        server = MockRestServiceServer.bindTo(restClientBuilder).build();
        paymentService = new PaymentService(
                restClientBuilder,
                "test_secret_key",
                paymentRepository,
                orderRepository,
                orderItemRepository,
                productRepository,
                deliveryRepository,
                farmRepository,
                sellerPointService,
                stockHistoryService
        );

        order = new Order();
        order.setOrderId(1L);
        order.setOrderNumber("ORDER-TEST-1");
        order.setFarmId(10L);
        order.setTotalProductPrice(10_000L);
        order.setDeliveryFee(3_000L);
        order.setFinalPrice(13_000L);
        order.setOrderStatus("PAYMENT_WAIT");

        OrderItem orderItem = new OrderItem();
        orderItem.setOrderId(1L);
        orderItem.setProductId(100L);
        orderItem.setQuantity(2);

        product = new Product();
        product.setProductId(100L);
        product.setProductName("테스트 상품");
        product.setStockQuantity(10);
        product.setProductStatus("ON_SALE");
        product.setMinOrderQuantity(1);

        request = new PaymentConfirmRequest();
        request.setOrderId("ORDER-TEST-1");
        request.setPaymentKey("payment-key-1");
        request.setAmount(13_000L);

        when(orderRepository.findByOrderNumber(request.getOrderId())).thenReturn(Optional.of(order));
        when(paymentRepository.findByOrderId(order.getOrderId())).thenReturn(Optional.empty());
        when(orderItemRepository.findByOrderId(order.getOrderId())).thenReturn(List.of(orderItem));
        when(productRepository.findByIdForUpdate(product.getProductId())).thenReturn(Optional.of(product));
        when(productRepository.save(any(Product.class))).thenAnswer(invocation -> invocation.getArgument(0));
    }

    @Test
    void confirmPaymentStoresLocalDataAfterTossApproval() {
        expectTossConfirmSuccess();

        Map<String, Object> response = paymentService.confirmPayment(request);

        assertEquals("DONE", response.get("status"));
        assertEquals(8, product.getStockQuantity());
        assertEquals("PAID", order.getOrderStatus());
        verify(paymentRepository).flush();
        verify(sellerPointService).earnPoint(order);
        server.verify();
    }

    @Test
    void confirmPaymentRecoversByLookingUpAnAlreadyApprovedPayment() {
        server.expect(once(), requestTo("https://api.tosspayments.com/v1/payments/confirm"))
                .andExpect(method(HttpMethod.POST))
                .andRespond(withStatus(org.springframework.http.HttpStatus.BAD_REQUEST)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body("{\"code\":\"ALREADY_PROCESSED_PAYMENT\"}"));
        server.expect(once(), requestTo("https://api.tosspayments.com/v1/payments/payment-key-1"))
                .andExpect(method(HttpMethod.GET))
                .andRespond(withSuccess(tossDoneResponse(), MediaType.APPLICATION_JSON));

        Map<String, Object> response = paymentService.confirmPayment(request);

        assertEquals("DONE", response.get("status"));
        assertEquals("PAID", order.getOrderStatus());
        server.verify();
    }

    @Test
    void confirmPaymentCancelsTossPaymentWhenLocalFlushFails() {
        expectTossConfirmSuccess();
        doThrow(new DataIntegrityViolationException("DB 저장 실패"))
                .when(paymentRepository)
                .flush();
        server.expect(once(), requestTo("https://api.tosspayments.com/v1/payments/payment-key-1/cancel"))
                .andExpect(method(HttpMethod.POST))
                .andRespond(withSuccess("{}", MediaType.APPLICATION_JSON));

        IllegalStateException exception = assertThrows(
                IllegalStateException.class,
                () -> paymentService.confirmPayment(request)
        );

        assertEquals(
                "결제 승인 후 내부 처리에 실패하여 결제를 자동 취소했습니다. 다시 결제해주세요.",
                exception.getMessage()
        );
        server.verify();
    }

    private void expectTossConfirmSuccess() {
        server.expect(once(), requestTo("https://api.tosspayments.com/v1/payments/confirm"))
                .andExpect(method(HttpMethod.POST))
                .andRespond(withSuccess(tossDoneResponse(), MediaType.APPLICATION_JSON));
    }

    private String tossDoneResponse() {
        return """
                {
                  "paymentKey": "payment-key-1",
                  "orderId": "ORDER-TEST-1",
                  "status": "DONE",
                  "method": "카드",
                  "totalAmount": 13000
                }
                """;
    }
}
