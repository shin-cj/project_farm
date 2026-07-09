package me.soldesk.springbootback.domain.product.service;

import me.soldesk.springbootback.domain.product.dto.ProductRequest;
import me.soldesk.springbootback.domain.product.dto.ProductResponse;
import me.soldesk.springbootback.domain.product.entity.Product;
import me.soldesk.springbootback.domain.product.repository.ProductRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<ProductResponse> getProducts(Long categoryId) {
        List<Product> products;

        if (categoryId == null) {
            products = productRepository.findAll();
        } else {
            products = productRepository.findByCategoryId(categoryId);
        }

        List<ProductResponse> responses = new ArrayList<>();

        for (Product product : products) {
            responses.add(toResponse(product));
        }

        return responses;
    }

    public ProductResponse getProduct(Long productId) {

        Product product = productRepository
                .findById(productId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "상품을 찾을 수 없습니다."
                ));

        return toResponse(product);
    }

    public ProductResponse createProduct(ProductRequest request){

        Product product = new Product();
        product.setFarmId(request.getFarmId());
        product.setCategoryId(request.getCategoryId());
        product.setProductName(request.getProductName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setUnit(request.getUnit());
        product.setOrigin(request.getOrigin());
        product.setHarvestDate(request.getHarvestDate());
        product.setExpirationDate(request.getExpirationDate());
        product.setProductImageUrl(request.getProductImageUrl());
        product.setProductStatus(request.getProductStatus());

        Product savedProduct = productRepository.save(product);

        return toResponse(savedProduct);

    }

    private ProductResponse toResponse(Product product) {
        ProductResponse response = new ProductResponse();
        response.setProductId(product.getProductId());
        response.setFarmId(product.getFarmId());
        response.setCategoryId(product.getCategoryId());
        response.setProductName(product.getProductName());
        response.setDescription(product.getDescription());
        response.setPrice(product.getPrice());
        response.setStockQuantity(product.getStockQuantity());
        response.setUnit(product.getUnit());
        response.setOrigin(product.getOrigin());
        response.setHarvestDate(product.getHarvestDate());
        response.setExpirationDate(product.getExpirationDate());
        response.setProductImageUrl(product.getProductImageUrl());
        response.setProductStatus(product.getProductStatus());
        response.setCreatedAt(product.getCreatedAt());
        response.setUpdatedAt(product.getUpdatedAt());
        return response;
    }


}
