package me.soldesk.springbootback.external.api01.client;

import me.soldesk.springbootback.external.api01.dto.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import tools.jackson.databind.JsonNode;

@Component
public class Api01Client {

    private final RestClient restClient;
    private final String apiKey;
    public Api01Client(
            RestClient.Builder builder,
            @Value("${external.api01.base-url}") String baseUrl,
            @Value("${external.api01.api-key}") String apiKey
    ) {
        this.restClient = builder
                .baseUrl(baseUrl)
                .build();

        this.apiKey = apiKey;
    }

    // GET 방식 외부 API
    public Api01Response getData(String pageNo, String numOfRows, String returnType) {
        return restClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/price")
                        .queryParam("serviceKey", apiKey)
                        .queryParam("pageNo", pageNo)
                        .queryParam("numOfRows", numOfRows)
                        .queryParam("returnType", returnType)
                        .build())
                .retrieve()
                .body(Api01Response.class);
    }

    // POST 방식 외부 API
    public Api01Response postData(Api01Request request) {
        return restClient.post()
                .uri("/api01")
                .header("Authorization", "Bearer " + apiKey)
                .body(request)
                .retrieve()
                .body(Api01Response.class);
    }
}
