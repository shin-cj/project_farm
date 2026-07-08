package me.soldesk.springbootback.external.openai;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Component
public class OpenAiRecipeClient {
    private final RestClient restClient;
    private final String model;

    public OpenAiRecipeClient(
            @Value("${openai.api-key}") String apikey,
            @Value("${openai.model}") String model
    ){
        this.restClient = RestClient.builder()
                .baseUrl("https://api.openai.com/v1")
                .defaultHeader("Authorization","Bearer "+ apikey)
                .defaultHeader("Content-Type","application/json")
                .build();

        this.model = model;
    }


    public String sendPrompt(String userMessage) {
        Map<String, Object> response = restClient.post()
                .uri("/responses")
                .body(Map.of(
                        "model",model,
                        "instructions","너는 농산물 쇼핑몰의 레시피 추천 챗봇이다, 사용자의 입력을 보고 만들 수 있는 요리를 한국어로 추천해줘",
                        "input",userMessage
                ))
                .retrieve()
                .body(new ParameterizedTypeReference<Map<String, Object>>() {});

        String responseJson = restClient.post()
                .uri("/responses")
                .body(Map.of(
                        "model",model,
                        "instructions","너는 농산물 쇼핑몰의 레시피 추천 챗봇이다, 사용자의 입력을 보고 만들 수 있는 요리를 한국어로 추천해줘",
                        "input",userMessage
                ))
                .retrieve()
                .body(String.class);

        System.out.println(responseJson);

        return extractText(response);
    }

    private String extractText(Map<String, Object> response) {
            Object outputText = response.get("output_text");

            if(outputText instanceof String text && !text.isBlank()){
                return text;
            }
            Object output = response.get("output");

            if(!(output instanceof List<?> outputList)){
                return "";
            }

        for (Object outputItem : outputList) {
            if(!(outputItem instanceof Map<?,?> outputMap)){
                continue;
            }

            Object content = outputMap.get("content");

            if(!(content instanceof List<?> contentList)){
                continue;
            }
            for (Object contentItem : contentList) {
                if(!(contentItem instanceof Map<?,?> contentMap)){
                    continue;
                }

                Object text = contentMap.get("text");

                if(text instanceof String value && !value.isBlank()){
                    return value;
                }
            }
        }

        return "";
    }
}
