package me.soldesk.springbootback.domain.delivery.controller;

import me.soldesk.springbootback.domain.delivery.dto.DeliveryRequest;
import me.soldesk.springbootback.domain.delivery.dto.DeliveryResponse;
import me.soldesk.springbootback.domain.delivery.service.DeliveryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class DeliveryController {

    private final DeliveryService deliveryService;

    public DeliveryController(DeliveryService deliveryService){
        this.deliveryService=deliveryService;
    }

    @GetMapping("/api/deliveries")
    public DeliveryResponse getDelivery(@RequestParam Long orderId){
        return deliveryService.getDeliveryOrderId(orderId);
    }

    @PostMapping("/api/seller/deliveries")
    public DeliveryResponse registerDelivery(@RequestBody DeliveryRequest deliveryRequest){
        return deliveryService.registerDelivery(deliveryRequest);
    }

    @GetMapping("/api/admin/deliveries")
    public List<DeliveryResponse> getAdminDeliveries(){
        return deliveryService.getAdminDeliveries();
    }

    @PatchMapping("/api/admin/deliveries/{deliveryId}/status")
    public DeliveryResponse updateDeliveryStatus(
            @PathVariable Long deliveryId,@RequestBody DeliveryRequest request){
     return deliveryService.updateDeliveryStatus(deliveryId,request);
    }
}
