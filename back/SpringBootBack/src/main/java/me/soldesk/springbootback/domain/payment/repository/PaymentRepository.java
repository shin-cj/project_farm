package me.soldesk.springbootback.domain.payment.repository;

import me.soldesk.springbootback.domain.payment.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
// Payment 엔티티를 DB에 저장하기 위한 Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByOrderId(Long orderId);
}
