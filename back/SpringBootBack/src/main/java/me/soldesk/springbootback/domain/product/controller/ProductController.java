package me.soldesk.springbootback.domain.product.controller;

import me.soldesk.springbootback.domain.product.dto.*;
import me.soldesk.springbootback.domain.product.service.ProductImageService;
import me.soldesk.springbootback.domain.product.service.ProductKeywordService;
import me.soldesk.springbootback.domain.product.service.ProductService;
import me.soldesk.springbootback.domain.stockhistory.dto.ProductStockHistoryResponse;
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
    private final ProductKeywordService productKeywordService;

    public ProductController(ProductService productService, ProductImageService productImageService
    , ProductKeywordService productKeywordService) {
        this.productService = productService;
        this.productImageService = productImageService;
        this.productKeywordService = productKeywordService;
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
            @RequestParam(required = false) String marketCategoryCode,
            @RequestParam(required = false) String marketItemCode,
            @RequestParam(defaultValue = "RETAIL") String saleType,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "LATEST") String sortOption,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size
    ) {
        return productService.getPublicProductPage(
                categoryId,
                marketCategoryCode,
                marketItemCode,
                saleType,
                keyword,
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

    @GetMapping("/{productId}/ai-keywords")
    public ProductKeywordResponse getProductKeywords(
            @PathVariable Long productId
    ){
        return productKeywordService.getProductKeywords(productId);
    }

    @PostMapping("/{productId}/ai-keywords")
    public ProductKeywordResponse generateProductKeywords(
            @PathVariable Long productId
    ){
        return productKeywordService.generateProductKeywords(productId);
    }

    @GetMapping("/{productId}/stock-histories")
    public List<ProductStockHistoryResponse> getProductStockHistories(
            @PathVariable Long productId
    ) {
        return productService.getProductStockHistories(productId);
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
            @PathVariable Long productId,
            @RequestBody ProductStatusRequest request
    ) {
        return productService.rejectProduct(productId, request);
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
