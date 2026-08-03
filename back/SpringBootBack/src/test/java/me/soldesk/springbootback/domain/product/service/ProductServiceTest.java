package me.soldesk.springbootback.domain.product.service;

import me.soldesk.springbootback.domain.category.repository.CategoryRepository;
import me.soldesk.springbootback.domain.farm.repository.FarmRepository;
import me.soldesk.springbootback.domain.product.dto.ProductResponse;
import me.soldesk.springbootback.domain.product.dto.ProductStockRequest;
import me.soldesk.springbootback.domain.product.entity.Product;
import me.soldesk.springbootback.domain.product.repository.ProductRepository;
import me.soldesk.springbootback.domain.review.service.ReviewService;
import me.soldesk.springbootback.domain.stockhistory.service.ProductStockHistoryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.context.ApplicationEventPublisher;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class ProductServiceTest {

    private ProductRepository productRepository;
    private ProductService productService;
    private Product product;

    @BeforeEach
    void setUp() {
        productRepository = mock(ProductRepository.class);
        FarmRepository farmRepository = mock(FarmRepository.class);
        ProductStockHistoryService stockHistoryService = mock(ProductStockHistoryService.class);

        productService = new ProductService(
                productRepository,
                farmRepository,
                mock(CategoryRepository.class),
                mock(ProductImageService.class),
                stockHistoryService,
                mock(ApplicationEventPublisher.class),
                mock(ReviewService.class)
        );

        product = new Product();
        product.setProductId(1L);
        product.setFarmId(10L);
        product.setStockQuantity(0);
        product.setMinOrderQuantity(2);

        when(productRepository.findByIdForUpdate(1L)).thenReturn(Optional.of(product));
        when(productRepository.save(any(Product.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(farmRepository.findById(10L)).thenReturn(Optional.empty());
    }

    @Test
    void restockingSoldOutProductReturnsItToOnSale() {
        product.setProductStatus("SOLD_OUT");

        ProductResponse response = productService.updateStock(1L, stockRequest(5));

        assertEquals("ON_SALE", response.getProductStatus());
        verify(productRepository).findByIdForUpdate(1L);
    }

    @Test
    void stockChangeDoesNotBypassPendingApproval() {
        product.setProductStatus("PENDING");

        ProductResponse response = productService.updateStock(1L, stockRequest(5));

        assertEquals("PENDING", response.getProductStatus());
    }

    @Test
    void stockChangeDoesNotReplaceHiddenStatusWithSoldOut() {
        product.setProductStatus("HIDDEN");

        ProductResponse response = productService.updateStock(1L, stockRequest(0));

        assertEquals("HIDDEN", response.getProductStatus());
    }

    @Test
    void publicProductDetailAllowsSoldOutProduct() {
        product.setProductStatus("SOLD_OUT");
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        ProductResponse response = productService.getProduct(1L, true);

        assertEquals("SOLD_OUT", response.getProductStatus());
    }

    private ProductStockRequest stockRequest(int quantity) {
        ProductStockRequest request = new ProductStockRequest();
        request.setStockQuantity(quantity);
        request.setChangeReason("테스트 재고 변경");
        return request;
    }
}
