package me.soldesk.springbootback.domain.farm.repository;

import me.soldesk.springbootback.domain.farm.entity.Farm;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FarmRepository extends JpaRepository<Farm, Long> {

    List<Farm> findBySellerId(Long sellerId);

    //농장 등록 시 사업자등록번호 중복 확인
    boolean existsByBusinessNumber(String businessNumber);

    //농장 수정 시 현재 농장을 제외 중복 확인
    boolean existsByBusinessNumberAndFarmIdNot(
            String businessNumber, Long farmId
    );

    List<Farm> findByApprovalStatusOrderByFarmIdDesc(
            String approvalStatus
    );
}
