package me.soldesk.springbootback.domain.delivery.service;

import me.soldesk.springbootback.domain.delivery.dto.SellerOrderInfoResponse;
import me.soldesk.springbootback.domain.delivery.repository.SellerOrderInfoRepository;
import me.soldesk.springbootback.domain.order.entity.Order;
import org.springframework.stereotype.Service;

@Service
public class SellerOrderInfoService {

    private final SellerOrderInfoRepository sellerOrderInfoRepository;

    public SellerOrderInfoService(SellerOrderInfoRepository sellerOrderInfoRepository){
        this.sellerOrderInfoRepository = sellerOrderInfoRepository;
    }

    public SellerOrderInfoResponse getSellerOrderInfo(Long orderId){
        Order order = sellerOrderInfoRepository.findById(orderId).orElseThrow(()-> new IllegalArgumentException("주문 정보를 찾을 수 없습니다"));

        SellerOrderInfoResponse response = new SellerOrderInfoResponse();

        response.setOrderId(order.getOrderId());
        response.setOrderNumber("ORDER-"+order.getOrderNumber());
        response.setOrderName(order.getOrderNumber());
        response.setReceiverName(order.getReceiverName());
        response.setReceiverAddress(order.getReceiverAddress());
        response.setReceiverPhone(order.getReceiverPhone());
        response.setReceiverDetailAddress(order.getReceiverDetailAddress());

        return response;
    }

}
