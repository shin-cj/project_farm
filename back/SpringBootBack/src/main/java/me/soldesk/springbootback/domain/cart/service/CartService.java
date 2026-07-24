package me.soldesk.springbootback.domain.cart.service;


import lombok.RequiredArgsConstructor;
import me.soldesk.springbootback.domain.cart.dto.CartRequest;
import me.soldesk.springbootback.domain.cart.dto.CartResponse;
import me.soldesk.springbootback.domain.cart.entity.Cart;
import me.soldesk.springbootback.domain.cart.repository.CartSellerRepository;
import me.soldesk.springbootback.domain.cartitem.repository.CartItemRepository;
import me.soldesk.springbootback.domain.cart.repository.CartRepository;
import me.soldesk.springbootback.domain.cartitem.entity.CartItem;
import me.soldesk.springbootback.domain.farm.dto.FarmResponse;
import me.soldesk.springbootback.domain.farm.entity.Farm;
import me.soldesk.springbootback.domain.farm.service.FarmService;
import me.soldesk.springbootback.domain.product.entity.Product;
import me.soldesk.springbootback.domain.product.repository.ProductRepository;
import me.soldesk.springbootback.domain.user.entity.User;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
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
    private final CartSellerRepository cartSellerRepository;
    private final FarmService farmService;

    @Transactional
    public void addCartItem(CartRequest request){

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("상품이 없습니다."));

        if(!"ON_SALE".equals(product.getProductStatus())){
            throw new IllegalArgumentException("현재 판매 중인 상품이 아닙니다.");
        }

        int addQuantity = request.getQuantity() == null ? 1 : request.getQuantity();

        if(addQuantity < 1){
            throw new IllegalArgumentException("수량은 1개 이상이어야 합니다.");
        }


        Cart cart = cartRepository.findByUserId(request.getUserid())
                .orElseGet(() -> createCart(request.getUserid()));

        CartItem cartItem = cartItemRepository
                .findByCartIdAndProductId(cart.getCartId(),product.getProductId())
                .orElseGet(CartItem::new);
        int currentQuantity = cartItem.getCartItemId() == null ? 0 : cartItem.getQuantity();

        int finalQuantity = currentQuantity + addQuantity;

        validateMinimumOrderQuantity(product, finalQuantity);

        if(finalQuantity > product.getStockQuantity()){
            throw new ResponseStatusException(HttpStatus.CONFLICT, "현재 재고는 " + product.getStockQuantity() + "개입니다.");
        }


        if(cartItem.getCartItemId() == null){
            cartItem.setCartId(cart.getCartId());
            cartItem.setProductId(product.getProductId());
        }

        cartItem.setQuantity(finalQuantity);
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

        FarmResponse farm = farmService.getFarm(product.getFarmId());
        User seller = cartSellerRepository.findById(farm.getSellerId())
                .orElseThrow(() -> new IllegalArgumentException("판매자 정보가 없습니다."));
        CartResponse response = new CartResponse();


        response.setCart_item_id(cartItem.getCartItemId());
        response.setCart_id(cartItem.getCartId());
        response.setProduct_id(product.getProductId());

        response.setProductName(product.getProductName());
        response.setProduct_price(product.getPrice());
        response.setQuantity(cartItem.getQuantity());
        response.setStockQuantity(product.getStockQuantity());
        response.setProductImageUrl(product.getProductImageUrl());
        response.setProductDescription(product.getDescription());
        response.setProductStatus(product.getProductStatus());
        response.setUnit(product.getUnit());
        response.setOrigin(product.getOrigin());
        response.setHarvestDate(product.getHarvestDate());
        response.setExpirationDate(product.getExpirationDate());
        response.setFarmName(farm.getFarmName());
        response.setFarmAddress(farm.getFarmAddress());
        response.setFarmDetailAddress(farm.getFarmDetailAddress());
        response.setFarmRegion(farm.getRegion());
        response.setFarmDescription(farm.getFarmDescription());
        response.setFarmImageUrl(farm.getFarmImageUrl());
        response.setSellerName(seller.getName());

        return response;
    }

    @Transactional
    public void updateQuantity(Long cartItemId, int quantity){
        if(quantity < 1){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "수량은 1개 이상이어야 합니다.");
        }

        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"장바구니 상품이 없습니다."));

        Product product = productRepository
                .findById(cartItem.getProductId())
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"상품이 없습니다."));

        validateMinimumOrderQuantity(product, quantity);

        if(quantity > product.getStockQuantity()){
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,"현재 재고는 " + product.getStockQuantity() + "개입니다."
            );
        }

        cartItem.setQuantity(quantity);
        cartItemRepository.save(cartItem);
    }

    private void validateMinimumOrderQuantity(Product product, int quantity) {
        int minimumOrderQuantity = getMinimumOrderQuantity(product);

        if (quantity < minimumOrderQuantity) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "최소 주문 수량은 " + minimumOrderQuantity + "개입니다."
            );
        }
    }

    private int getMinimumOrderQuantity(Product product) {
        Integer minimumOrderQuantity = product.getMinOrderQuantity();
        return minimumOrderQuantity == null || minimumOrderQuantity < 1
                ? 1
                : minimumOrderQuantity;
    }

}
