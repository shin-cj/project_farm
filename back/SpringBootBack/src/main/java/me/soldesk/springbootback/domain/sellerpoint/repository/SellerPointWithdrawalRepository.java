package me.soldesk.springbootback.domain.sellerpoint.repository;

import me.soldesk.springbootback.domain.sellerpoint.entity.SellerPointWithdrawal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SellerPointWithdrawalRepository extends JpaRepository<SellerPointWithdrawal, Long> {

    List<SellerPointWithdrawal> findBySellerIdOrderByRequestedAtDesc(Long sellerId);

    List<SellerPointWithdrawal> findAllByOrderByRequestedAtDesc();
}
