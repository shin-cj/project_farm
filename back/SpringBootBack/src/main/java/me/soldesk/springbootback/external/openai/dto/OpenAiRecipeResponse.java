package me.soldesk.springbootback.external.openai.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class OpenAiRecipeResponse {

    private String recipeTitle;

    private List<String> ingredients;

    private List<String> searchIngredients;

    private String recipe;

    private String remark;

}
