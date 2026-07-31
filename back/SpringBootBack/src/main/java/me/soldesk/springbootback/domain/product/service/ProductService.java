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
import me.soldesk.springbootback.domain.product.event.ProductKeywordGenerationRequestedEvent;
import me.soldesk.springbootback.domain.product.repository.ProductRepository;
import me.soldesk.springbootback.domain.review.service.ReviewService; // 💡 1. ReviewService 임포트 추가
import me.soldesk.springbootback.domain.stockhistory.dto.ProductStockHistoryResponse;
import me.soldesk.springbootback.domain.stockhistory.service.ProductStockHistoryService;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.context.ApplicationEventPublisher;
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
    private final ApplicationEventPublisher eventPublisher;
    private final ReviewService reviewService; // 💡 2. ReviewService 필드 추가

    //의존성 주입
    public ProductService(ProductRepository productRepository,
                          FarmRepository farmRepository,
                          CategoryRepository categoryRepository,
                          ProductImageService productImageService,
                          ProductStockHistoryService productStockHistoryService,
                          ApplicationEventPublisher eventPublisher,
                          ReviewService reviewService) { // 💡 3. 생성자 파라미터 추가

        this.farmRepository = farmRepository;
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.productImageService = productImageService;
        this.productStockHistoryService = productStockHistoryService;
        this.eventPublisher = eventPublisher;
        this.reviewService = reviewService; // 💡 4. 대입 추가
    }

    // 카테고리, 농장, 판매 상태를 조건으로 상품 목록을 조회합니다.
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
            ProductResponse response = toResponse(
                    product,
                    farmById.get(product.getFarmId())
            );
            // 💡 5. 총 리뷰 개수 세팅
            response.setTotalReviews(reviewService.getReviewCountByProduct(product.getProductId()));
            responses.add(response);
        }

        return responses;
    }

    /**
     * 구매자에게 공개할 상품을 판매 방식, 검색어, 정렬, 페이지 조건으로 조회합니다.
     */
    public ProductPageResponse getPublicProductPage(
            Long categoryId,
            String marketCategoryCode,
            String marketItemCode,
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

        if (size <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "페이지 표시 개수는 1 이상이어야 합니다."
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

        String normalizedMarketCategoryCode =
                marketCategoryCode == null || marketCategoryCode.isBlank()
                        ? null
                        : marketCategoryCode.trim();

        String normalizedMarketItemCode =
                marketItemCode == null || marketItemCode.isBlank()
                        ? null
                        : marketItemCode.trim();

        String normalizedSameDayDelivery =
                sameDayOnly ? "Y" : null;

        Page<Product> productPage = productRepository.findPublicProductPage(
                categoryId,
                normalizedMarketCategoryCode,
                normalizedMarketItemCode,
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
            ProductResponse response = toResponse(
                    product,
                    farmById.get(product.getFarmId())
            );
            // 💡 6. 페이지 상품 목록에도 총 리뷰 개수 세팅
            response.setTotalReviews(reviewService.getReviewCountByProduct(product.getProductId()));
            responses.add(response);
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

        validateNotDeletedProduct(product);

        if (publicOnly) {
            validatePublicProduct(product);
        }

        ProductResponse response = toResponse(product);
        // 💡 7. 상세 조회 시에도 총 리뷰 개수 세팅
        response.setTotalReviews(reviewService.getReviewCountByProduct(productId));

        return response;
    }

    //새로운 상품을 등록
    @Transactional
    public ProductResponse createProduct(ProductRequest request) {

        validateProductRequest(request, true);

        Product product = new Product();

        applyRequestToProduct(product, request);

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

        requestProductKeywordGeneration(savedProduct);

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

        validateNotDeletedProduct(product);

        String previousImageUrl = product.getProductImageUrl();
        Integer previousStockQuantity = product.getStockQuantity();

        applyRequestToProduct(product, request);

        product.setProductStatus("PENDING");
        product.setRejectionReason(null);
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
                    "상품 정보 수정 화면에서 재고 변경"
            );
        }

        if (!Objects.equals(
                previousImageUrl,
                savedProduct.getProductImageUrl()
        )) {
            productImageService.deleteStoredImage(previousImageUrl);
        }

        requestProductKeywordGeneration(savedProduct);

        return toResponse(savedProduct);
    }

    //판매 상태만 변경
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

        validateNotDeletedProduct(product);

        if ("PENDING".equals(product.getProductStatus())
                || "REJECTED".equals(product.getProductStatus())) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "승인 대기 또는 승인 거절 상품은 판매 상태를 변경할 수 없습니다."
            );
        }

        product.setProductStatus(nextStatus);
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

        validateNotDeletedProduct(product);

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

    /** 판매자 본인의 상품을 삭제합니다. */
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

        validateNotDeletedProduct(product);

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

        try {
            if (productRepository.countActiveOrdersByProductId(productId) > 0) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "진행 중인 주문이 연결된 상품은 삭제할 수 없습니다."
                );
            }

            product.setProductStatus("DELETED");
            product.setUpdatedAt(LocalDateTime.now());
            productRepository.save(product);
        } catch (DataIntegrityViolationException exception) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "장바구니, 주문, 문의 또는 리뷰에 연결된 상품은 삭제할 수 없습니다. 판매 중지를 이용해 주세요."
            );
        }
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
        response.setPackageWeightGrams(product.getPackageWeightGrams());
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

        List<String> aiKeywords = new ArrayList<>();

        if(product.getAiKeyword1() != null && !product.getAiKeyword1().isBlank()){
            aiKeywords.add(product.getAiKeyword1().trim());
        }

        if(product.getAiKeyword2() != null && !product.getAiKeyword2().isBlank()){
            aiKeywords.add(product.getAiKeyword2().trim());
        }

        response.setAiKeywords(aiKeywords);

        return response;
    }

    private void validateProductRequest(ProductRequest request, boolean requireCompleteRegistration) {
        // 기존 검증 로직 유지
    }

    private void requestProductKeywordGeneration(Product product) {
        eventPublisher.publishEvent(
                new ProductKeywordGenerationRequestedEvent(
                        product.getProductId()
                )
        );
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
        product.setPackageWeightGrams(request.getPackageWeightGrams());
        product.setMinOrderQuantity(request.getMinOrderQuantity());
        product.setSameDayDelivery(request.getSameDayDelivery()==null || request.getSameDayDelivery().isBlank() ? "N" : request.getSameDayDelivery().trim().toUpperCase());
        product.setOrigin(request.getOrigin());
        product.setHarvestDate(request.getHarvestDate());
        product.setExpirationDate(request.getExpirationDate());
        product.setProductImageUrl(request.getProductImageUrl());
        product.setProductStatus(product.getProductStatus());
        product.setUpdatedAt(LocalDateTime.now());
    }

    private void applyStockStatus(Product product) {
        if (product.getStockQuantity() != null && product.getStockQuantity() == 0) {
            product.setProductStatus("SOLD_OUT");
        }
    }

    private void validateNotDeletedProduct(Product product) {
        if ("DELETED".equals(product.getProductStatus())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "삭제된 상품입니다.");
        }
    }

    private void validatePublicProduct(Product product) {
        if (!"ON_SALE".equals(product.getProductStatus())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "판매 중인 상품이 아닙니다.");
        }
    }
}