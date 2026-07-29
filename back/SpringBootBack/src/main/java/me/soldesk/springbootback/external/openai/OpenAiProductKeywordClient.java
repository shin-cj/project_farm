package me.soldesk.springbootback.external.openai;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import tools.jackson.databind.ObjectMapper;

import java.util.List;
import java.util.Map;

@Component
public class OpenAiProductKeywordClient {

    private final RestClient restClient;
    private final String model;
    private final ObjectMapper objectMapper;

    public OpenAiProductKeywordClient(
            @Value("${openai.api-key}") String apiKey,
            @Value("${openai.model}") String model,
            ObjectMapper objectMapper
    ) {
        this.restClient = RestClient.builder()
                .baseUrl("https://api.openai.com/v1")
                .defaultHeader("Authorization", "Bearer " + apiKey)
                .defaultHeader("Content-Type", "application/json")
                .build();

        this.model = model;
        this.objectMapper = objectMapper;
    }

    public List<String> createKeywords(String productInformation) {

        Map<String, Object> requestBody = Map.of(
                "model", model,
                "instructions", """
                        농산물 상품 정보를 분석하여 구매자에게 도움이 되는
                        핵심 키워드를 정확히 두 개 생성하세요.

                        각 키워드는 한글 10자 이내로 작성하세요.
                        서로 다른 의미의 키워드를 작성하세요.
                        과장된 표현과 해시태그 기호는 사용하지 마세요.

                        반드시 아래 JSON 형식만 반환하세요.
                        {"keywords":["키워드1","키워드2"]}
                        """,
                "input", productInformation,
                "store", false
        );

        Map<String, Object> response = restClient.post()
                .uri("/responses")
                .body(requestBody)
                .retrieve()
                .body(new ParameterizedTypeReference<>() {
                });

        String responseText = extractText(response);

        try {
            KeywordResult result = objectMapper.readValue(
                    responseText,
                    KeywordResult.class
            );

            if (result == null || result.keywords() == null) {
                throw new IllegalStateException(
                        "AI 키워드 결과가 비어 있습니다."
                );
            }

            List<String> keywords = result.keywords()
                    .stream()
                    .map(String::trim)
                    .filter(keyword -> !keyword.isBlank())
                    .distinct()
                    .toList();

            if (keywords.size() != 2) {
                throw new IllegalStateException(
                        "AI 키워드가 정확히 두 개 생성되지 않았습니다."
                );
            }

            return keywords;

        } catch (Exception exception) {
            throw new IllegalStateException(
                    "AI 키워드 응답을 처리하지 못했습니다.",
                    exception
            );
        }
    }

    private String extractText(Map<String, Object> response) {

        if (response == null) {
            throw new IllegalStateException(
                    "OpenAI 응답이 없습니다."
            );
        }

        Object outputText = response.get("output_text");

        if (outputText instanceof String text && !text.isBlank()) {
            return text;
        }

        Object output = response.get("output");

        if (!(output instanceof List<?> outputList)) {
            throw new IllegalStateException(
                    "OpenAI 응답 형식이 올바르지 않습니다."
            );
        }

        for (Object outputItem : outputList) {
            if (!(outputItem instanceof Map<?, ?> outputMap)) {
                continue;
            }

            Object content = outputMap.get("content");

            if (!(content instanceof List<?> contentList)) {
                continue;
            }

            for (Object contentItem : contentList) {
                if (!(contentItem instanceof Map<?, ?> contentMap)) {
                    continue;
                }

                Object text = contentMap.get("text");

                if (text instanceof String resultText
                        && !resultText.isBlank()) {
                    return resultText;
                }
            }
        }

        throw new IllegalStateException(
                "OpenAI 응답에서 키워드 내용을 찾지 못했습니다."
        );
    }

    private record KeywordResult(List<String> keywords) {
    }
}