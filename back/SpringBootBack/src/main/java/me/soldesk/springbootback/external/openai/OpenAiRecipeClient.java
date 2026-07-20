package me.soldesk.springbootback.external.openai;

import me.soldesk.springbootback.external.openai.dto.OpenAiRecipeResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import tools.jackson.databind.ObjectMapper;

import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class OpenAiRecipeClient {
    private final RestClient restClient;
    private final String model;
    private final ObjectMapper objectMapper;
    private final String instructions;


    //오픈 ai호출 하기 위한 함수
    public OpenAiRecipeClient(
            @Value("${openai.api-key}") String apikey,
            @Value("${openai.model}") String model,
            ObjectMapper objectMapper,
            @Value("classpath:prompts/recipe-chatbot-prompt.txt")
            Resource promptResource
    ){
        this.restClient = RestClient.builder()
                .baseUrl("https://api.openai.com/v1")
                .defaultHeader("Authorization","Bearer "+ apikey)
                .defaultHeader("Content-Type","application/json")
                .build();

        this.model = model;
        this.objectMapper = objectMapper;

        try{
            this.instructions =
                    promptResource.getContentAsString(StandardCharsets.UTF_8);
        }catch (Exception e){
            throw new IllegalArgumentException("레시피 챗봇 프롬포트 파일을 읽지 못했습니다.",e);
        }
    }

    //사용자에게 입력 받은 질문으로 ai 프롬포트를 뽑아내고 json 형태로 반환 받는 함수
    public OpenAiRecipeResponse crateRecipe(String userMessage, String previousResponseId) {
        Map<String,Object> body = new HashMap<>();

        body.put("model",model);
        body.put("instructions", instructions);
        body.put("input",userMessage);
        body.put("store",true);

        if(previousResponseId != null && !previousResponseId.isBlank()){
            body.put("previous_response_id",previousResponseId);
        }

        Map<String, Object> response = restClient.post()
                .uri("/responses")
                .body(body)
                .retrieve()
                .body(new ParameterizedTypeReference<Map<String, Object>>() {});

        String text = extractText(response);

        try {
            OpenAiRecipeResponse result =
                    objectMapper.readValue(text, OpenAiRecipeResponse.class);

            result.setResponseId((String) response.get("id"));

            return result;
        }catch (Exception e){
            throw new IllegalStateException("OpenAi 레시피 응답을 JSON으로 변환하지 못했습니다. 응답:"+text,e);
        }

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
