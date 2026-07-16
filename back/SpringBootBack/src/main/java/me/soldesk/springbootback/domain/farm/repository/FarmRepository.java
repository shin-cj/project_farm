package me.soldesk.springbootback.domain.farm.repository;

import me.soldesk.springbootback.domain.farm.entity.Farm;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FarmRepository extends JpaRepository<Farm, Long> {

    List<Farm> findBySellerId(Long sellerId);
}
