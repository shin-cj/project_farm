package me.soldesk.springbootback.domain.category.repository;

import me.soldesk.springbootback.domain.category.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
