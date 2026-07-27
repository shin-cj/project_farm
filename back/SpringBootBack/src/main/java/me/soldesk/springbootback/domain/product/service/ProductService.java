package me.soldesk.springbootback.domain.product.service;

import me.soldesk.springbootback.domain.category.repository.CategoryRepository;
import me.soldesk.springbootback.domain.farm.entity.Farm;
import me.soldesk.springbootback.domain.farm.repository.FarmRepository;
import me.soldesk.springbootback.domain.product.dto.ProductRequest;
import me.soldesk.springbootback.domain.product.dto.ProductPageResponse;
import me.soldesk.springbootback.domain.product.dto.ProductResponse;
import me.soldesk.springbootback.domain.product.dto.ProductStatusRequest;
import me.soldesk.springbootback.domain.product.dto.ProductStockRequest;
import me.soldesk.springbootback.domain.product.entity.Product;
import me.soldesk.springbootback.domain.product.repository.ProductRepository;
import me.soldesk.springbootback.domain.stockhistory.dto.ProductStockHistoryResponse;
import me.soldesk.springbootback.domain.stockhistory.service.ProductStockHistoryService;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final FarmRepository farmRepository;
    private final CategoryRepository categoryRepository;
    private final ProductImageService productImageService;
    private final ProductStockHistoryService productStockHistoryService;

    //의존성 주입
    public ProductService(ProductRepository productRepository,
                          FarmRepository farmRepository,
                          CategoryRepository categoryRepository,
                          ProductImageService productImageService,
                          ProductStockHistoryService productStockHistoryService) {

        this.farmRepository = farmRepository;
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.productImageService = productImageService;
        this.productStockHistoryService = productStockHistoryService;
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

        Map<Long, Farm> farmById = farmRepository.findAllById(
                products.stream()
                        .map(Product::getFarmId)
                        .distinct()
                        .toList()
        ).stream().collect(Collectors.toMap(
                Farm::getFarmId,
                farm -> farm
        ));

        List<ProductResponse> responses = new ArrayList<>();

        for (Product product : products) {
            responses.add(toResponse(
                    product,
                    farmById.get(product.getFarmId())
            ));
        }

        return responses;
    }

    /**
     * 구매자에게 공개할 상품을 판매 방식, 검색어, 정렬, 페이지 조건으로 조회합니다.
     * 기존 상품 관리 목록 API와 분리하여 판매자 화면의 응답 형식은 바꾸지 않습니다.
     */
    public ProductPageResponse getPublicProductPage(
            Long categoryId,
            String saleType,
            String keyword,
            boolean sameDayOnly,
            String sortOption,
            int page,
            int size
    ) {
        if (page < 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "페이지 번호는 0 이상이어야 합니다."
            );
        }

        if (size != 12 && size != 24 && size != 48) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "페이지 표시 개수는 12, 24, 48 중 하나여야 합니다."
            );
        }

        String normalizedSaleType = saleType == null || saleType.isBlank()
                ? "RETAIL"
                : saleType.trim().toUpperCase();

        if (!"RETAIL".equals(normalizedSaleType)
                && !"WHOLESALE".equals(normalizedSaleType)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "판매 구분은 RETAIL 또는 WHOLESALE만 가능합니다."
            );
        }

        String normalizedSortOption = sortOption == null || sortOption.isBlank()
                ? "LATEST"
                : sortOption.trim().toUpperCase();

        Sort sort;

        if ("LATEST".equals(normalizedSortOption)) {
            sort = Sort.by(
                    Sort.Order.asc("productStatus"),
                    Sort.Order.desc("productId")
            );
        } else if ("PRICE_LOW".equals(normalizedSortOption)) {
            sort = Sort.by(
                    Sort.Order.asc("productStatus"),
                    Sort.Order.asc("price"),
                    Sort.Order.desc("productId")
            );
        } else if ("PRICE_HIGH".equals(normalizedSortOption)) {
            sort = Sort.by(
                    Sort.Order.asc("productStatus"),
                    Sort.Order.desc("price"),
                    Sort.Order.desc("productId")
            );
        } else {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "정렬 기준은 LATEST, PRICE_LOW, PRICE_HIGH 중 하나여야 합니다."
            );
        }

        String normalizedKeyword = keyword == null || keyword.isBlank()
                ? null
                : keyword.trim().toLowerCase().replaceAll("\\s+", "");

        String normalizedSameDayDelivery =
                sameDayOnly ? "Y" : null;

        Page<Product> productPage = productRepository.findPublicProductPage(
                categoryId,
                normalizedSaleType,
                normalizedSameDayDelivery,
                normalizedKeyword,
                PageRequest.of(page, size, sort)
        );

        List<Product> products = productPage.getContent();

        Map<Long, Farm> farmById = farmRepository.findAllById(
                products.stream()
                        .map(Product::getFarmId)
                        .distinct()
                        .toList()
        ).stream().collect(Collectors.toMap(
                Farm::getFarmId,
                farm -> farm
        ));

        List<ProductResponse> responses = new ArrayList<>();

        for (Product product : products) {
            responses.add(toResponse(
                    product,
                    farmById.get(product.getFarmId())
            ));
        }

        ProductPageResponse response = new ProductPageResponse();
        response.setProducts(responses);
        response.setCurrentPage(productPage.getNumber());
        response.setPageSize(productPage.getSize());
        response.setTotalElements(productPage.getTotalElements());
        response.setTotalPages(productPage.getTotalPages());
        response.setFirst(productPage.isFirst());
        response.setLast(productPage.isLast());

        return response;
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
    @Transactional
    public ProductResponse createProduct(ProductRequest request) {

        //유효성  검사 추가
        validateProductRequest(request, true);

        Product product = new Product();

        applyRequestToProduct(product, request);

        // 판매자가 상품 등록 단계에서 승인 상태를 직접 정할 수 없도록 고정합니다.
        product.setProductStatus("PENDING");

        applyStockStatus(product);

        Product savedProduct = productRepository.save(product);

        productStockHistoryService.record(
                savedProduct.getProductId(),
                null,
                "INITIAL_STOCK",
                0,
                savedProduct.getStockQuantity(),
                "상품 등록 초기 재고"
        );

        return toResponse(savedProduct);

    }

    //기존 상품 정보를 수정
    @Transactional
    public ProductResponse updateProduct(Long productId, ProductRequest request) {

        validateProductRequest(request, false);

        Product product = productRepository
                .findById(productId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "상품을 찾을 수 없습니다."
                ));

        String previousImageUrl = product.getProductImageUrl();
        Integer previousStockQuantity = product.getStockQuantity();

        applyRequestToProduct(product, request);

        // 상품명, 가격, 이미지 등의 일반 정보를 수정하면
        // 관리자가 다시 확인할 수 있도록 승인 대기 상태로 변경합니다.
        product.setProductStatus("PENDING");

        product.setRejectionReason(null);

        applyStockStatus(product);

        //상품을 수정한 현재 시간으로 변경
        product.setUpdatedAt(LocalDateTime.now());

        Product savedProduct = productRepository.save(product);

        if (!Objects.equals(previousStockQuantity, savedProduct.getStockQuantity())) {
            productStockHistoryService.record(
                    savedProduct.getProductId(),
                    null,
                    "MANUAL_ADJUSTMENT",
                    previousStockQuantity,
                    savedProduct.getStockQuantity(),
                    "상품 정보 수정 화면에서 재고 변경"
            );
        }

        if (!Objects.equals(
                previousImageUrl,
                savedProduct.getProductImageUrl()
        )) {
            productImageService.deleteStoredImage(previousImageUrl);
        }

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

        if ("PENDING".equals(product.getProductStatus())
                || "REJECTED".equals(product.getProductStatus())) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "승인 대기 또는 승인 거절 상품은 판매 상태를 변경할 수 없습니다."
            );
        }

        product.setProductStatus(nextStatus);

        // 재고가 0인 상품을 판매 중으로 변경하면 품절로 처리합니다.
        applyStockStatus(product);

        product.setUpdatedAt(LocalDateTime.now());

        Product savedProduct = productRepository.save(product);

        return toResponse(savedProduct);
    }

    // 관리자가 승인 대기 상품을 승인합니다.
    public ProductResponse approveProduct(Long productId) {

        Product product = productRepository
                .findById(productId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "상품을 찾을 수 없습니다."
                ));

        if (!"PENDING".equals(product.getProductStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "승인 대기 중인 상품만 승인할 수 있습니다."
            );
        }

        Farm farm = farmRepository
                .findById(product.getFarmId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "상품이 등록된 농장을 찾을 수 없습니다."
                ));

        if (!"APPROVED".equals(farm.getApprovalStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "승인 완료된 농장의 상품만 승인할 수 있습니다."
            );
        }

        product.setProductStatus("ON_SALE");
        product.setRejectionReason(null);

        applyStockStatus(product);

        product.setUpdatedAt(LocalDateTime.now());

        Product savedProduct = productRepository.save(product);

        return toResponse(savedProduct);
    }

    // 관리자가 승인 대기 상품을 거절
    public ProductResponse rejectProduct(Long productId, ProductStatusRequest request) {

        Product product = productRepository
                .findById(productId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "상품을 찾을 수 없습니다."
                ));

        if (!"PENDING".equals(product.getProductStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "승인 대기 중인 상품만 거절할 수 있습니다."
            );
        }

        if (request == null
                || request.getRejectionReason() == null
                || request.getRejectionReason().isBlank()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "상품 거절 사유를 입력해주세요."
            );
        }

        String rejectionReason = request.getRejectionReason().trim();

        if (rejectionReason.length() > 500) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "상품 거절 사유는 500자 이하로 입력해주세요."
            );
        }

        product.setProductStatus("REJECTED");
        product.setRejectionReason(rejectionReason);
        product.setUpdatedAt(LocalDateTime.now());

        Product savedProduct = productRepository.save(product);

        return toResponse(savedProduct);
    }

    //상품의 재고 수량만 변경
    @Transactional
    public ProductResponse updateStock(Long productId, ProductStockRequest request){

        if(request == null || request.getStockQuantity() == null){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "변경 할 재고 수량을 입력해주세요.");
        }

        if (request.getChangeReason() == null || request.getChangeReason().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "재고 변경 사유를 입력해주세요.");
        }

        String changeReason = request.getChangeReason().trim();

        if (changeReason.length() > 500) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "재고 변경 사유는 500자 이하로 입력해주세요.");
        }

        if(request.getStockQuantity() < 0){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "재고는 0개 이상 입력해주세요.");
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "상품을 찾을 수 없습니다."
                ));

        Integer previousStockQuantity = product.getStockQuantity();
        product.setStockQuantity(request.getStockQuantity());

        applyStockStatus(product);

        product.setUpdatedAt(LocalDateTime.now());

        Product savedProduct = productRepository.save(product);

        if (!Objects.equals(previousStockQuantity, savedProduct.getStockQuantity())) {
            productStockHistoryService.record(
                    savedProduct.getProductId(),
                    null,
                    "MANUAL_ADJUSTMENT",
                    previousStockQuantity,
                    savedProduct.getStockQuantity(),
                    changeReason
            );
        }

        return toResponse(savedProduct);
    }

    /** 상품 재고 이력을 최신 변경 순서로 조회합니다. */
    public List<ProductStockHistoryResponse> getProductStockHistories(Long productId) {
        productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "상품을 찾을 수 없습니다."
                ));

        return productStockHistoryService.getProductStockHistories(productId);
    }

    /** 판매자 본인의 상품을 삭제합니다. 연결된 거래 데이터가 있으면 삭제하지 않습니다. */
    @Transactional
    public void deleteProduct(Long productId, Long sellerId) {
        if (sellerId == null || sellerId <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "판매자 정보를 확인할 수 없습니다."
            );
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "상품을 찾을 수 없습니다."
                ));

        Farm farm = farmRepository.findById(product.getFarmId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "상품의 농장 정보를 찾을 수 없습니다."
                ));

        if (!sellerId.equals(farm.getSellerId())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "본인이 등록한 상품만 삭제할 수 있습니다."
            );
        }

        String productImageUrl = product.getProductImageUrl();

        try {
            productRepository.delete(product);
            productRepository.flush();
        } catch (DataIntegrityViolationException exception) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "장바구니, 주문, 문의 또는 리뷰에 연결된 상품은 삭제할 수 없습니다. 판매 중지를 이용해 주세요."
            );
        }

        productImageService.deleteStoredImage(productImageUrl);
    }

    //Product 엔티티를 ProductResponse DTO로 변환
    private ProductResponse toResponse(Product product) {

        Farm farm = farmRepository.findById(product.getFarmId())
                .orElse(null);

        return toResponse(product, farm);
    }

    private ProductResponse toResponse(Product product, Farm farm) {

        ProductResponse response = new ProductResponse();

        response.setProductId(product.getProductId());
        response.setFarmId(product.getFarmId());
        response.setFarmName(
                farm == null ? "농장 정보 없음" : farm.getFarmName()
        );
        response.setCategoryId(product.getCategoryId());
        response.setMarketItemCode(product.getMarketItemCode());
        response.setProductName(product.getProductName());
        response.setDescription(product.getDescription());
        response.setPrice(product.getPrice());
        response.setStockQuantity(product.getStockQuantity());
        response.setUnit(product.getUnit());
        response.setSaleType(
                farm == null ? "RETAIL" : farm.getSaleType()
        );
        response.setMinOrderQuantity(product.getMinOrderQuantity());
        response.setOrigin(product.getOrigin());
        response.setHarvestDate(product.getHarvestDate());
        response.setExpirationDate(product.getExpirationDate());
        response.setProductImageUrl(product.getProductImageUrl());
        response.setProductStatus(product.getProductStatus());
        response.setRejectionReason(product.getRejectionReason());
        response.setCreatedAt(product.getCreatedAt());
        response.setUpdatedAt(product.getUpdatedAt());
        response.setSameDayDelivery(product.getSameDayDelivery());

        return response;
    }

    // 상품 등록과 수정 전에 요청값을 검사합니다.
    private void validateProductRequest(
            ProductRequest request,
            boolean requireCompleteRegistration
    ) {

        // 요청 데이터 자체가 없는지 확인합니다.
        if (request == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "상품 정보를 입력해주세요."
            );
        }

        // 농장 번호가 비어 있는지 확인합니다.
        if (request.getFarmId() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "농장을 선택해주세요."
            );
        }

        if (requireCompleteRegistration
                && (request.getMarketItemCode() == null
                || request.getMarketItemCode().isBlank())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "공공 시세 품목을 선택해주세요."
            );
        }

        if (request.getMarketItemCode() != null
                && !request.getMarketItemCode().isBlank()
                && !request.getMarketItemCode().trim().matches("\\d{1,10}")) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "공공 시세 품목 코드는 숫자 10자리 이하로 입력해주세요."
            );
        }

        // 선택한 농장이 실제 DB에 존재하는지 확인합니다.
        Farm farm = farmRepository.findById(request.getFarmId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "선택한 농장을 찾을 수 없습니다."
                ));

        // 관리자에게 승인받은 농장인지 확인합니다.
        if (!"APPROVED".equals(farm.getApprovalStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "승인 완료된 농장에만 상품을 등록하거나 수정할 수 있습니다."
            );
        }

        // 카테고리 번호가 비어 있는지 확인합니다.
        if (request.getCategoryId() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "카테고리를 선택해주세요."
            );
        }

        // 선택한 카테고리가 실제 DB에 존재하는지 확인합니다.
        if (!categoryRepository.existsById(request.getCategoryId())) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "선택한 카테고리를 찾을 수 없습니다."
            );
        }

        // 상품명이 비어 있는지 확인합니다.
        if (request.getProductName() == null
                || request.getProductName().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "상품명을 입력해주세요."
            );
        }

        if (requireCompleteRegistration
                && (request.getDescription() == null
                || request.getDescription().isBlank())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "상품 설명을 입력해주세요."
            );
        }

        // 가격이 비어 있거나 0원 이하인지 확인합니다.
        if (request.getPrice() == null
                || request.getPrice() <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "가격은 1원 이상 입력해주세요."
            );
        }

        // 재고가 비어 있거나 음수인지 확인합니다.
        if (request.getStockQuantity() == null
                || request.getStockQuantity() < 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "재고는 0개 이상 입력해주세요."
            );
        }

        // 판매 단위가 비어 있는지 확인합니다.
        if (request.getUnit() == null
                || request.getUnit().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "판매 단위를 입력해주세요."
            );
        }

        if (requireCompleteRegistration
                && (request.getOrigin() == null
                || request.getOrigin().isBlank())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "원산지를 입력해주세요."
            );
        }

        if (requireCompleteRegistration
                && request.getHarvestDate() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "수확일을 입력해주세요."
            );
        }

        if (requireCompleteRegistration
                && request.getExpirationDate() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "유통기한을 입력해주세요."
            );
        }

        LocalDate minimumExpirationDate = LocalDate.now().plusDays(7);

        if (requireCompleteRegistration
                && request.getExpirationDate().isBefore(minimumExpirationDate)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "유통기한은 오늘부터 7일 이후여야 합니다."
            );
        }

        if (requireCompleteRegistration
                && request.getHarvestDate().isAfter(request.getExpirationDate())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "수확일은 유통기한보다 늦을 수 없습니다."
            );
        }

        if (requireCompleteRegistration
                && (request.getProductImageUrl() == null
                || request.getProductImageUrl().isBlank())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "상품 이미지를 등록해주세요."
            );
        }

        // 상품의 판매 방식은 선택한 농장의 판매 방식을 사용합니다.
        String saleType = farm.getSaleType();

        if (!"RETAIL".equals(saleType)
                && !"WHOLESALE".equals(saleType)) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "농장의 판매 방식 정보가 올바르지 않습니다."
            );
        }

        // 최소 주문 수량은 반드시 1개 이상이어야 합니다.
        if (request.getMinOrderQuantity() == null
                || request.getMinOrderQuantity() < 1) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "최소 주문 수량은 1개 이상이어야 합니다."
            );
        }

        // 소매 상품은 1개부터 구매할 수 있도록 고정합니다.
        if ("RETAIL".equals(saleType)
                && request.getMinOrderQuantity() != 1) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "소매 상품의 최소 주문 수량은 1개입니다."
            );
        }

        // 도매 상품은 최소 2개 이상 주문하도록 제한합니다.
        if ("WHOLESALE".equals(saleType)
                && request.getMinOrderQuantity() <= 1) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "도매 상품의 최소 주문 수량은 2개 이상이어야 합니다."
            );
        }

        String sameDayDelivery = request.getSameDayDelivery();

        if (sameDayDelivery != null
                && !sameDayDelivery.isBlank()
                && !"Y".equals(sameDayDelivery.trim().toUpperCase())
                && !"N".equals(sameDayDelivery.trim().toUpperCase())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "당일배송 여부는 Y 또는 N만 가능합니다."
            );
        }

        if ("WHOLESALE".equals(saleType)
                && "Y".equals(sameDayDelivery == null
                ? "N"
                : sameDayDelivery.trim().toUpperCase())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "도매 상품은 당일배송으로 등록할 수 없습니다."
            );
        }
    }

    private void applyRequestToProduct(Product product, ProductRequest request){

        product.setFarmId(request.getFarmId());
        product.setCategoryId(request.getCategoryId());
        product.setMarketItemCode(
                request.getMarketItemCode() == null || request.getMarketItemCode().isBlank()
                        ? null
                        : request.getMarketItemCode().trim()
        );
        product.setProductName(request.getProductName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setUnit(request.getUnit());
        product.setMinOrderQuantity(request.getMinOrderQuantity());
        product.setSameDayDelivery(request.getSameDayDelivery()==null || request.getSameDayDelivery().isBlank() ? "N" : request.getSameDayDelivery().trim().toUpperCase());
        product.setOrigin(request.getOrigin());
        product.setHarvestDate(request.getHarvestDate());
        product.setExpirationDate(request.getExpirationDate());
        product.setProductImageUrl(request.getProductImageUrl());

    }
    // 재고 수량에 따라 상품 판매 상태를 변경합니다.
    private void applyStockStatus(Product product) {

        Integer stockQuantity =
                product.getStockQuantity();

        if (stockQuantity == null) {
            return;
        }

        Integer minOrderQuantity =
                product.getMinOrderQuantity() == null
                        ? 1
                        : product.getMinOrderQuantity();

        boolean insufficientStock =
                stockQuantity < minOrderQuantity;

        if (insufficientStock
                && "ON_SALE".equals(product.getProductStatus())) {

            product.setProductStatus("SOLD_OUT");
            return;
        }

        if (!insufficientStock
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
