package me.soldesk.springbootback.domain.chatbot.repository;

import me.soldesk.springbootback.domain.chatbot.entity.Chatbot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatbotRepository extends JpaRepository<Chatbot, Long> {

    List<Chatbot> findByUserIdOrderByCreatedAtDesc(Long userId);

}
