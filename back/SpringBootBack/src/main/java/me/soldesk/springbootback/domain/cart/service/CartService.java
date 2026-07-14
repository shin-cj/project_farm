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
                .orElseThrow(() -> new IllegalArgumentException("?怨밸?????곷뮸??덈뼄."));

        if(!"ON_SALE".equals(product.getProductStatus())){
            throw new IllegalArgumentException("?袁⑹삺 ?癒?꼻 餓λ쵐???怨밸????袁⑤뻸??덈뼄.");
        }

        int addQuantity = request.getQuantity() == null ? 1 : request.getQuantity();

        if(addQuantity < 1){
            throw new IllegalArgumentException("??롮쎗?? 1揶???곴맒??곷선????몃빍??");
        }


        Cart cart = cartRepository.findByUserId(request.getUserid())
                .orElseGet(() -> createCart(request.getUserid()));

        CartItem cartItem = cartItemRepository
                .findByCartIdAndProductId(cart.getCartId(),product.getProductId())
                .orElseGet(CartItem::new);
        //?貫而?뤃??????용┸ ??롮쎗 ?④쑴沅?
        int currentQuantity = cartItem.getCartItemId() == null ? 0 : cartItem.getQuantity();

        //疫꿸퀣????롮쎗????덉쨮 ??곸뱽 ??롮쎗 ?酉釉?묾?
        int finalQuantity = currentQuantity + addQuantity;

        if(finalQuantity > product.getStockQuantity()){
            //?癒?쑎 筌롫뗄?놅쭪????袁⑥쨴?紐껋쨮 ??륁죬 ???у첎? ?봔鈺곌퉲鍮???貫而?뤃??????용┛筌왖 ??낅뮉筌왖, ??삘뀲 ??됱뇚 ?怨뱀넺?紐? ?癒?뼊.
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
                .orElseThrow(() -> new IllegalArgumentException("?怨밸?????곷뮸??덈뼄."));

        FarmResponse farm = farmService.getFarm(product.getFarmId());
        User seller = cartSellerRepository.findById(farm.getSellerId())
                .orElseThrow(() -> new IllegalArgumentException("?癒?꼻???類ｋ궖揶쎛 ??곷뮸??덈뼄."));
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
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "??롮쎗?? 1揶???곴맒??곷선????몃빍??");
        }

        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"?貫而?뤃????怨밸?????곷뮸??덈뼄."));

        Product product = productRepository
                .findById(cartItem.getProductId())
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"?怨밸?????곷뮸??덈뼄."));

        if(quantity > product.getStockQuantity()){
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,"?怨밸? ???х몴??λ뜃???????곷뮸??덈뼄."+"?袁⑹삺 ?????"+product.getStockQuantity() + "??낅빍??"
            );
        }

        cartItem.setQuantity(quantity);
        cartItemRepository.save(cartItem);
    }

}
