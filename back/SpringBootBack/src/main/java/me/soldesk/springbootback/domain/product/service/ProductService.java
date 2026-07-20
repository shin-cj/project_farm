package me.soldesk.springbootback.domain.product.service;

import me.soldesk.springbootback.domain.category.repository.CategoryRepository;
import me.soldesk.springbootback.domain.farm.entity.Farm;
import me.soldesk.springbootback.domain.farm.repository.FarmRepository;
import me.soldesk.springbootback.domain.product.dto.ProductRequest;
import me.soldesk.springbootback.domain.product.dto.ProductResponse;
import me.soldesk.springbootback.domain.product.dto.ProductStatusRequest;
import me.soldesk.springbootback.domain.product.dto.ProductStockRequest;
import me.soldesk.springbootback.domain.product.entity.Product;
import me.soldesk.springbootback.domain.product.repository.ProductRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final FarmRepository farmRepository;
    private final CategoryRepository categoryRepository;

    //의존성 주입
    public ProductService(ProductRepository productRepository,
                          FarmRepository farmRepository,
                          CategoryRepository categoryRepository) {

        this.farmRepository = farmRepository;
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
    }

    // 카테고리, 농장, 판매 상태를 조건으로 상품 목록을 조회합니다.
// 각 값이 null이면 해당 조건은 사용하지 않습니다.
    public List<ProductResponse> getProducts(
            Long categoryId,
            Long farmId,
            String productStatus,
            boolean publicOnly
    ) {
        String normalizedProductStatus = productStatus == null
                || productStatus.isBlank()
                ? null
                : productStatus.trim();

        List<Product> products;

        if (publicOnly) {
            products = productRepository.findPublicProducts(categoryId, farmId);
        } else {
            products = productRepository.findProducts(
                    categoryId,
                    farmId,
                    normalizedProductStatus
            );
        }

        List<ProductResponse> responses = new ArrayList<>();

        for (Product product : products) {
            responses.add(toResponse(product));
        }

        return responses;
    }

    //상품 상세 정보를 조회
    public ProductResponse getProduct(Long productId, boolean publicOnly) {

        Product product = productRepository
                .findById(productId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "상품을 찾을 수 없습니다."
                ));

        if (publicOnly) {
            validatePublicProduct(product);
        }

        return toResponse(product);
    }

    //새로운 상품을 등록
    public ProductResponse createProduct(ProductRequest request) {

        //유효성  검사 추가
        validateProductRequest(request);

        Product product = new Product();

        applyRequestToProduct(product, request);

        // 판매자가 상품 등록 단계에서 승인 상태를 직접 정할 수 없도록 고정합니다.
        product.setProductStatus("PENDING");

        applyStockStatus(product);

        Product savedProduct = productRepository.save(product);

        return toResponse(savedProduct);

    }

    //기존 상품 정보를 수정
    public ProductResponse updateProduct(Long productId, ProductRequest request) {

        validateProductRequest(request);

        Product product = productRepository
                .findById(productId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "상품을 찾을 수 없습니다."
                ));

        String currentProductStatus = product.getProductStatus();

        applyRequestToProduct(product, request);

        // 관리자 승인 전 상품은 판매자가 수정해도 승인 대기 상태를 유지합니다.
        if ("PENDING".equals(currentProductStatus)) {
            product.setProductStatus("PENDING");
        }

        applyStockStatus(product);

        //상품을 수정한 현재 시간으로 변경
        product.setUpdatedAt(LocalDateTime.now());

        Product savedProduct = productRepository.save(product);

        return toResponse(savedProduct);
    }

    //판매 상태만 변경
    // 상품명이나 가격은 건드리지 않고 판매 상태만 변경합니다.
    public ProductResponse updateStatus(
            Long productId,
            ProductStatusRequest request
    ) {
        if (request == null
                || request.getProductStatus() == null
                || request.getProductStatus().isBlank()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "변경할 상품 상태를 입력해주세요."
            );
        }

        String nextStatus =
                request.getProductStatus().trim().toUpperCase();

        if (!"ON_SALE".equals(nextStatus)
                && !"HIDDEN".equals(nextStatus)) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "상품 상태는 ON_SALE 또는 HIDDEN만 선택할 수 있습니다."
            );
        }

        Product product = productRepository
                .findById(productId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "상품을 찾을 수 없습니다."
                ));

        if ("PENDING".equals(product.getProductStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "승인 대기 중인 상품은 판매 상태를 변경할 수 없습니다."
            );
        }

        product.setProductStatus(nextStatus);

        // 재고가 0인 상품을 판매 중으로 변경하면 품절로 처리합니다.
        applyStockStatus(product);

        product.setUpdatedAt(LocalDateTime.now());

        Product savedProduct = productRepository.save(product);

        return toResponse(savedProduct);
    }

    //상품의 재고 수량만 변경
    public ProductResponse updateStock(Long productId, ProductStockRequest request){

        if(request == null || request.getStockQuantity() == null){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "변경 할 재고 수량을 입력해주세요.");
        }

        if(request.getStockQuantity() < 0){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "재고는 0개 이상 입력해주세요.");
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "상품을 찾을 수 없습니다."
                ));

        product.setStockQuantity(request.getStockQuantity());

        applyStockStatus(product);

        product.setUpdatedAt(LocalDateTime.now());

        Product savedProduct = productRepository.save(product);

        return toResponse(savedProduct);
    }

    //Product 엔티티를 ProductResponse DTO로 변환
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

    //상품 등록과 수정 전에 요청값을 검사
    private void validateProductRequest(ProductRequest request) {

        if (request == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "상품 정보를 입력해주세요."
            );
        }

        //농장 번호가 비어 있는 가
        if (request.getFarmId() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "농장을 선택해주세요."
            );
        }

        //선택한 농장이 db에 존재 하는 가
        Farm farm = farmRepository.findById(request.getFarmId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "선택한 농장을 찾을 수 없습니다."
                ));

        if (!"APPROVED".equals(farm.getApprovalStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "승인 완료된 농장에만 상품을 등록하거나 수정할 수 있습니다."
            );
        }
        // 카테고리 번호가 비어 있는지 확인
        if (request.getCategoryId() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "카테고리를 선택해주세요."
            );
        }

        // 선택한 카테고리가 실제 DB에 존재하는지 확인
        if (!categoryRepository.existsById(request.getCategoryId())) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "선택한 카테고리를 찾을 수 없습니다."
            );
        }

        // 상품명이 비어 있는지 확인
        if (request.getProductName() == null
                || request.getProductName().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "상품명을 입력해주세요."
            );
        }

        // 가격이 비어 있거나 0원 이하인지 확인
        if (request.getPrice() == null
                || request.getPrice() <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "가격은 1원 이상 입력해주세요."
            );
        }

        // 재고가 비어 있거나 음수인지 확인
        if (request.getStockQuantity() == null
                || request.getStockQuantity() < 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "재고는 0개 이상 입력해주세요."
            );
        }

        // 판매 단위가 비어 있는지 확인
        if (request.getUnit() == null
                || request.getUnit().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "판매 단위를 입력해주세요."
            );
        }
    }

    private void applyRequestToProduct(Product product, ProductRequest request){

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
    }
    // 재고 수량에 따라 상품 판매 상태를 변경합니다.
    private void applyStockStatus(Product product) {

        Integer stockQuantity =
                product.getStockQuantity();

        if (stockQuantity == null) {
            return;
        }

        if (stockQuantity == 0
                && "ON_SALE".equals(product.getProductStatus())) {

            product.setProductStatus("SOLD_OUT");
            return;
        }

        if (stockQuantity > 0
                && "SOLD_OUT".equals(product.getProductStatus())) {

            product.setProductStatus("ON_SALE");
        }
    }

    private void validatePublicProduct(Product product) {
        boolean publicProductStatus = "ON_SALE".equals(product.getProductStatus())
                || "SOLD_OUT".equals(product.getProductStatus());

        Farm farm = farmRepository.findById(product.getFarmId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "상품을 찾을 수 없습니다."
                ));

        if (!publicProductStatus || !"APPROVED".equals(farm.getApprovalStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "상품을 찾을 수 없습니다."
            );
        }
    }


}
