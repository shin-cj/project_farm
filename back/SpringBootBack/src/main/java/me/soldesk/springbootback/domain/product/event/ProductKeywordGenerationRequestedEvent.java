package me.soldesk.springbootback.domain.product.event;

public record ProductKeywordGenerationRequestedEvent(
        Long productId
) {
}
