package me.soldesk.springbootback.domain.cart.repository;

import me.soldesk.springbootback.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartSellerRepository extends JpaRepository<User, Long> {


}
