package me.soldesk.springbootback.domain.product.controller;

import me.soldesk.springbootback.domain.product.dto.ProductRequest;
import me.soldesk.springbootback.domain.product.dto.ProductResponse;
import me.soldesk.springbootback.domain.product.dto.ProductStatusRequest;
import me.soldesk.springbootback.domain.product.dto.ProductStockRequest;
import me.soldesk.springbootback.domain.product.service.ProductService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
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

    @PatchMapping("/{productId}/stock")
    public ProductResponse updateStock(@PathVariable Long productId, @RequestBody ProductStockRequest request){
        return productService.updateStock(productId,request);
    }
}
