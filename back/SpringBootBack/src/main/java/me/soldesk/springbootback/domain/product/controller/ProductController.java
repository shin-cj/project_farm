package me.soldesk.springbootback.domain.product.controller;

import me.soldesk.springbootback.domain.product.dto.ProductRequest;
import me.soldesk.springbootback.domain.product.dto.ProductResponse;
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
            @RequestParam(required = false) String productStatus

    ) {
        return productService.getProducts(categoryId, farmId, productStatus);
    }

    @PostMapping
    public ProductResponse createProduct(@RequestBody ProductRequest request) {
        return productService.createProduct(request);
    }

    @GetMapping("/{productId}")
    public ProductResponse getProduct(@PathVariable Long productId){
        return productService.getProduct(productId);
    }

    @PutMapping("/{productId}")
    public ProductResponse updateProduct(@PathVariable Long productId, @RequestBody ProductRequest request){
        return productService.updateProduct(productId, request);
    }
}
