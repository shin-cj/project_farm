package me.soldesk.springbootback.domain.category.service;

import me.soldesk.springbootback.domain.category.dto.CategoryResponse;
import me.soldesk.springbootback.domain.category.entity.Category;
import me.soldesk.springbootback.domain.category.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<CategoryResponse> getCategories() {
        List<Category> categories = categoryRepository
                .findAllByOrderByDisplayOrderAscCategoryIdAsc();
        List<CategoryResponse> responses = new ArrayList<>();

        for (Category category : categories) {
            CategoryResponse response = new CategoryResponse();
            response.setCategoryId(category.getCategoryId());
            response.setCategoryName(category.getCategoryName());
            response.setMarketCategoryCode(category.getMarketCategoryCode());
            response.setDisplayOrder(category.getDisplayOrder());
            responses.add(response);
        }

        return responses;
    }
}
