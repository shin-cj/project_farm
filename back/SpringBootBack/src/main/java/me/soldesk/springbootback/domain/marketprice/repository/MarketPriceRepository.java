package me.soldesk.springbootback.domain.marketprice.repository;

import me.soldesk.springbootback.domain.marketprice.entity.MarketPrice;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MarketPriceRepository extends JpaRepository<MarketPrice, Long> {



}
