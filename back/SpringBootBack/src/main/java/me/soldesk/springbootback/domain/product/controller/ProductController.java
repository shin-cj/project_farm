package me.soldesk.springbootback.domain.product.controller;

import me.soldesk.springbootback.domain.product.dto.*;
import me.soldesk.springbootback.domain.product.service.ProductImageService;
import me.soldesk.springbootback.domain.product.service.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;
    private final ProductImageService productImageService;

    public ProductController(ProductService productService, ProductImageService productImageService) {
        this.productService = productService;
        this.productImageService = productImageService;
    }

    @GetMapping
    public List<ProductResponse> getProducts(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long farmId,
            @RequestParam(required = false) String productStatus,
            @RequestParam(defaultValue = "false") boolean publicOnly

    ) {
        return productService.getProducts(categoryId, farmId, productStatus, publicOnly);
    }

    /** 구매자 상품 목록을 검색, 정렬, 페이지 조건에 맞춰 조회합니다. */
    @GetMapping("/public-page")
    public ProductPageResponse getPublicProductPage(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(defaultValue = "RETAIL") String saleType,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "false") boolean sameDayOnly,
            @RequestParam(defaultValue = "LATEST") String sortOption,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size
    ) {
        return productService.getPublicProductPage(
                categoryId,
                saleType,
                keyword,
                sameDayOnly,
                sortOption,
                page,
                size
        );
    }

    @PostMapping(value = "/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ProductImageUploadResponse uploadProductImage(@RequestPart("image")MultipartFile image){
        return productImageService.uploadImage(image);
    }

    @PostMapping
    public ProductResponse createProduct(@RequestBody ProductRequest request) {
        return productService.createProduct(request);
    }

    @GetMapping("/{productId}")
    public ProductResponse getProduct(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "false") boolean publicOnly
    ) {
        return productService.getProduct(productId, publicOnly);
    }

    @PutMapping("/{productId}")
    public ProductResponse updateProduct(@PathVariable Long productId, @RequestBody ProductRequest request){
        return productService.updateProduct(productId, request);
    }

    @PatchMapping("/{productId}/status")
    public ProductResponse updateStatus(
            @PathVariable Long productId,
            @RequestBody ProductStatusRequest request
    ) {
        return productService.updateStatus(productId, request);
    }

    @PatchMapping("/{productId}/approve")
    public ProductResponse approveProduct(
            @PathVariable Long productId
    ) {
        return productService.approveProduct(productId);
    }

    @PatchMapping("/{productId}/reject")
    public ProductResponse rejectProduct(
            @PathVariable Long productId
    ) {
        return productService.rejectProduct(productId);
    }

    @PatchMapping("/{productId}/stock")
    public ProductResponse updateStock(@PathVariable Long productId, @RequestBody ProductStockRequest request){
        return productService.updateStock(productId,request);
    }

    @DeleteMapping("/{productId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProduct(
            @PathVariable Long productId,
            @RequestParam Long sellerId
    ) {
        productService.deleteProduct(productId, sellerId);
    }
}
