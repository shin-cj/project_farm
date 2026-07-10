package me.soldesk.springbootback.domain.cart.controller;

import lombok.RequiredArgsConstructor;
import me.soldesk.springbootback.domain.cart.dto.CartRequest;
import me.soldesk.springbootback.domain.cart.dto.CartResponse;
import me.soldesk.springbootback.domain.cart.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    @GetMapping("/{user_id}")
    public ResponseEntity<List<CartResponse>> getCartItems(@PathVariable Long user_id){
        return ResponseEntity.ok(cartService.getCartItems(user_id));
    }

    @PostMapping("/items")
    public ResponseEntity<Void> addCartItem(@RequestBody CartRequest request){
        cartService.addCartItem(request);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/items/{cart_item_id}")
    public ResponseEntity<Void> deleteCartItem(@PathVariable Long cart_item_id){
        cartService.deleteCartItems(cart_item_id);
        return ResponseEntity.ok().build();
    }
}
