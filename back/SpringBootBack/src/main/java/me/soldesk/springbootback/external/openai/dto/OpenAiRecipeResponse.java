package me.soldesk.springbootback.external.openai.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class OpenAiRecipeResponse {

    private Boolean success;

    private String message;

    private String recipeTitle;

    private List<String> ingredients;

    private List<String> searchIngredients;

    private String recipe;

    private String remark;

    //조리 시간
    private String cookingTime;
    //음식량
    private String servings;
    //음식 분류
    private String cuisineType;
    //예상 비용
    private String estimatedBudget;
    //조리 순서를 한 단계 씩 나눈 배열
    private List<String> recipeSteps;

    private String responseId;

    private String responseType;

}
