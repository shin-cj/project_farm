package me.soldesk.springbootback.domain.cart.service;


import lombok.RequiredArgsConstructor;
import me.soldesk.springbootback.domain.cart.dto.CartRequest;
import me.soldesk.springbootback.domain.cart.dto.CartResponse;
import me.soldesk.springbootback.domain.cart.entity.Cart;
import me.soldesk.springbootback.domain.cartitem.repository.CartItemRepository;
import me.soldesk.springbootback.domain.cart.repository.CartRepository;
import me.soldesk.springbootback.domain.cartitem.entity.CartItem;
import me.soldesk.springbootback.domain.product.entity.Product;
import me.soldesk.springbootback.domain.product.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    @Transactional
    public void addCartItem(CartRequest request){

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("상품이 없습니다."));
        Cart cart = cartRepository.findByUserId(request.getUserid())
                .orElseGet(() -> createCart(request.getUserid()));

        CartItem cartItem = cartItemRepository
                .findByCartIdAndProductId(cart.getCartId(),product.getProductId())
                .orElseGet(CartItem::new);

        int quantity = request.getQuantity() == null ? 1 : request.getQuantity();

        if(cartItem.getCartItemId() == null){
            cartItem.setCartId(cart.getCartId());
            cartItem.setProductId(product.getProductId());
            cartItem.setQuantity(quantity);
        }else{
            cartItem.setQuantity(cartItem.getQuantity() + quantity);
        }

        cart.setUpdatedAt(LocalDateTime.now());

        cartRepository.save(cart);
        cartItemRepository.save(cartItem);
    }

    @Transactional(readOnly = true)
    public List<CartResponse> getCartItems(Long userId){
        return cartRepository.findByUserId(userId)
                .map(cart -> cartItemRepository.findByCartId(cart.getCartId())
                        .stream()
                        .map(this::toCartResponse)
                        .toList())
                .orElse(List.of());
    }


    @Transactional
    public void deleteCartItems(Long cartItemId){
        cartItemRepository.deleteById(cartItemId);
    }

    private Cart createCart(Long userId){
        Cart cart = new Cart();
        cart.setUserId(userId);
        cart.setCreatedAt(LocalDateTime.now());
        cart.setUpdatedAt(LocalDateTime.now());
        return cartRepository.save(cart);
    }

    private CartResponse toCartResponse(CartItem cartItem){
        Product product = productRepository.findById(cartItem.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("상품이 없습니다."));

        CartResponse response = new CartResponse();
        response.setCart_item_id(cartItem.getCartItemId());
        response.setCart_id(cartItem.getCartId());
        response.setProduct_id(product.getProductId());
        response.setProductName(product.getProductName());
        response.setProduct_price(product.getPrice());
        response.setQuantity(cartItem.getQuantity());
        response.setProductImageUrl(product.getProductImageUrl());

        return response;
    }

}
