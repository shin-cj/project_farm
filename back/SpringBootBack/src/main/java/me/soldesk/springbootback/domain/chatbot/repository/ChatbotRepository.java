package me.soldesk.springbootback.domain.chatbot.repository;

import me.soldesk.springbootback.domain.chatbot.entity.Chatbot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChatbotRepository extends JpaRepository<Chatbot, Long> {


    //사용자의 레시피 조회
    @Query("""
        SELECT c
        FROM Chatbot c
        WHERE c.userId = :userId
        ORDER BY c.createdAt DESC
    """)
    List<Chatbot> findSavedRecipesByUserId(@Param("userId") Long userId);

}
