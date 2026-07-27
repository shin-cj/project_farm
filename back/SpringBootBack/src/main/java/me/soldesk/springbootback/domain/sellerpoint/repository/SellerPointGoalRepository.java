package me.soldesk.springbootback.domain.sellerpoint.repository;

import me.soldesk.springbootback.domain.sellerpoint.entity.SellerPointGoal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface SellerPointGoalRepository extends JpaRepository<SellerPointGoal,Long> {

    Optional<SellerPointGoal> findBySellerIdAndGoalDate(Long sellerId, LocalDate goalDate);
}