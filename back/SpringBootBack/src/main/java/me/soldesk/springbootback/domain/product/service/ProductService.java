package me.soldesk.springbootback.domain.product.service;

import me.soldesk.springbootback.domain.product.dto.ProductResponse;
import me.soldesk.springbootback.domain.product.entity.Product;
import me.soldesk.springbootback.domain.product.repository.ProductRepository;
import org.springframework.stereotype.Service;

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
            responses.add(response);
        }

        return responses;
    }
}
