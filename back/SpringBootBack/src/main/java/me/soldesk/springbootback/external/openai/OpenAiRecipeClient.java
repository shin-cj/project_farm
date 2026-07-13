package me.soldesk.springbootback.external.openai;

import me.soldesk.springbootback.external.openai.dto.OpenAiRecipeResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import tools.jackson.databind.ObjectMapper;

import java.util.List;
import java.util.Map;

@Component
public class OpenAiRecipeClient {
    private final RestClient restClient;
    private final String model;
    private final ObjectMapper objectMapper;

    //오픈 ai호출 하기 위한 함수
    public OpenAiRecipeClient(
            @Value("${openai.api-key}") String apikey,
            @Value("${openai.model}") String model,
            ObjectMapper objectMapper
    ){
        this.restClient = RestClient.builder()
                .baseUrl("https://api.openai.com/v1")
                .defaultHeader("Authorization","Bearer "+ apikey)
                .defaultHeader("Content-Type","application/json")
                .build();

        this.model = model;
        this.objectMapper = objectMapper;
    }

    //사용자에게 입력 받은 질문으로 ai 프롬포트를 뽑아내고 json 형태로 반환 받는 함수
    public OpenAiRecipeResponse crateRecipe(String userMessage) {
        Map<String, Object> response = restClient.post()
                .uri("/responses")
                .body(Map.of(
                        "model",model,
                        "instructions",
                        """
                                너는 농산물 쇼핑몰의 레시피 추천 챗봇이다.
                                
                                사용자의 입력에 현실에 존재하지 않는 재료, 먹을 수 없는 물건, 판타지 생물, 위험한 물질이 포함되어 있으면 레시피를 추천하지 마라.
                                
                                예:
                                붉은 용의 꼬리, 페가수스의 뿔, 유니콘 고기, 독극물, 플라스틱, 금속, 약품
                                
                                이 경우 반드시 아래 JSON 형식으로만 응답해라.
                                
                                {
                                  "success": false,
                                  "message": "질문을 다시 입력해주세요!",
                                  "recipeTitle": null,
                                  "ingredients": [],
                                  "searchIngredients": [],
                                  "recipe": null,
                                  "remark": "존재하지 않거나 먹을 수 없는 재료는 레시피로 추천할 수 없습니다."
                                }
                                
                                정상적인 식재료 요청이면 success를 true로 응답해라.
                                
                                사용자의 입력을 보고 만들 수 있는 레시피를 하나 추천해라.
                                
                                반드시 아래 JSON 형식으로만 응답해라.
                                설명 문장, 마크다운, 코드 블록 없이 JSON만 응답해라.
                                
                                ingredients는 화면에 보여줄 전체 재료명이다.
                                searchIngredients는 DB 상품 검색에 사용할 핵심 농산물 이름만 넣어라.
                                searchIngredients에는 수량, 단위, 손질 상태, 부위명, 설명을 넣지 마라.
                                searchIngredients에는 우리 쇼핑몰에서 판매할 수 있는 농산물/채소/과일/식재료 이름만 넣어라.
                                
                                예:
                                "양파 1개" -> "양파"
                                "대파 1대" -> "대파"
                                "다진 마늘 1큰술" -> "마늘"
                                "돼지고기 앞다리살 300g" -> "돼지고기"
                                
                                {
                                  "success":true,
                                  "message":"추천 가능한 레시피입니다.",
                                  "recipeTitle": "레시피 제목",
                                  "ingredients": ["재료1", "재료2", "재료3", "재료4", "재료5..."],
                                  "searchIngredients": ["재료1", "재료2", "재료3", "재료4", "재료5..."],
                                  "recipe": "조리 순서",
                                  "remark": "참고 사항"
                                }
                                

                                """,
                        "input",userMessage
                ))
                .retrieve()
                .body(new ParameterizedTypeReference<Map<String, Object>>() {});

        String text = extractText(response);

        try {
            return objectMapper.readValue(text, OpenAiRecipeResponse.class);
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
