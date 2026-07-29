package me.soldesk.springbootback.domain.product.service;

import me.soldesk.springbootback.domain.farm.repository.FarmRepository;
import me.soldesk.springbootback.domain.product.dto.ProductKeywordResponse;
import me.soldesk.springbootback.domain.product.dto.ProductResponse;
import me.soldesk.springbootback.domain.product.event.ProductKeywordGenerationRequestedEvent;
import me.soldesk.springbootback.domain.product.repository.ProductRepository;
import me.soldesk.springbootback.external.openai.OpenAiProductKeywordClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import me.soldesk.springbootback.domain.farm.entity.Farm;
import me.soldesk.springbootback.domain.product.entity.Product;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProductKeywordService {

    private static final Logger log =
            LoggerFactory.getLogger(ProductKeywordService.class);

    private final ProductService productService;
    private final OpenAiProductKeywordClient openAiProductKeywordClient;
    private final ProductRepository productRepository;
    private final FarmRepository farmRepository;


    public ProductKeywordService(
            ProductService productService,
            OpenAiProductKeywordClient openAiProductKeywordClient,
            ProductRepository productRepository,
            FarmRepository farmRepository
    ) {
        this.productService = productService;
        this.openAiProductKeywordClient = openAiProductKeywordClient;
        this.productRepository = productRepository;
        this.farmRepository = farmRepository;
    }

    public ProductKeywordResponse getProductKeywords(Long productId) {
        ProductResponse product = productService.getProduct(productId, true);

        return new ProductKeywordResponse(
                product.getProductId(),
                product.getAiKeywords()
        );
    }

    @Async
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void generateProductKeywordsAutomatically(
            ProductKeywordGenerationRequestedEvent event
    ) {
        try {
            generateProductKeywords(event.productId());
        } catch (Exception exception) {
            log.warn(
                    "AI product keyword generation failed. productId={}",
                    event.productId(),
                    exception
            );
        }
    }

    @Transactional
    public ProductKeywordResponse generateProductKeywords(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "상품을 찾을 수 없습니다."
                ));

        Farm farm = farmRepository.findById(product.getFarmId())
                .orElse(null);

        try {
            ProductKeywordResponse response =
                    createProductKeywordResponse(product, farm);

            List<String> keywords = response.getKeywords();

            if (keywords.size() != 2) {
                throw new IllegalStateException(
                        "AI 키워드는 정확히 2개여야 합니다."
                );
            }

            product.setAiKeyword1(keywords.get(0));
            product.setAiKeyword2(keywords.get(1));
            product.setAiKeywordsGeneratedAt(LocalDateTime.now());

            productRepository.save(product);

            return response;
        } catch (Exception exception) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "AI 상품 키워드를 생성하지 못했습니다.",
                    exception
            );
        }
    }

    private ProductKeywordResponse createProductKeywordResponse(
            Product product,
            Farm farm
    ) {
        String productInformation = """
                상품명: %s
                상품 설명: %s
                생산 농장: %s
                원산지: %s
                판매 단위: %s
                판매 방식: %s
                """.formatted(
                product.getProductName(),
                valueOrDefault(product.getDescription(), "설명 없음"),
                valueOrDefault(
                        farm == null ? null : farm.getFarmName(),
                        "농장 정보 없음"
                ),
                valueOrDefault(product.getOrigin(), "원산지 정보 없음"),
                valueOrDefault(product.getUnit(), "판매 단위 정보 없음"),
                "WHOLESALE".equals(
                        farm == null ? null : farm.getSaleType()
                ) ? "도매" : "소매"
        );

        List<String> keywords =
                openAiProductKeywordClient.createKeywords(
                        productInformation
                );

        return new ProductKeywordResponse(
                product.getProductId(),
                keywords
        );
    }

    private String valueOrDefault(String value, String defaultValue) {
        if (value == null || value.isBlank()) {
            return defaultValue;
        }

        return value.trim();
    }
}
