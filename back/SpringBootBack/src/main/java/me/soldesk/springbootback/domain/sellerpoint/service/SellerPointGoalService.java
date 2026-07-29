package me.soldesk.springbootback.domain.sellerpoint.service;

import me.soldesk.springbootback.domain.sellerpoint.dto.SellerPointGoalRequest;
import me.soldesk.springbootback.domain.sellerpoint.dto.SellerPointGoalResponse;
import me.soldesk.springbootback.domain.sellerpoint.entity.SellerPoint;
import me.soldesk.springbootback.domain.sellerpoint.entity.SellerPointGoal;
import me.soldesk.springbootback.domain.sellerpoint.repository.SellerPointGoalRepository;
import me.soldesk.springbootback.domain.sellerpoint.repository.SellerPointRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class SellerPointGoalService {

    private final SellerPointGoalRepository sellerPointGoalRepository;
    private final SellerPointRepository sellerPointRepository;

    public SellerPointGoalService(SellerPointGoalRepository sellerPointGoalRepository, SellerPointRepository sellerPointRepository) {
        this.sellerPointGoalRepository = sellerPointGoalRepository;
        this.sellerPointRepository = sellerPointRepository;
    }

    public SellerPointGoalResponse getTodayGoal(Long sellerId){
        LocalDate today = LocalDate.now();

        SellerPointGoal goal = sellerPointGoalRepository.
                                findBySellerIdAndGoalDate(sellerId,today).
                                orElseGet(()->createDefaultGoal(sellerId,today));

        Long todayPoint = getTodayEarnedPoint(sellerId,today);
        Long targetPoint = goal.getTargetPoint();
        Double achievementRate = targetPoint == 0 ? 0.0 : (todayPoint.doubleValue() / targetPoint.doubleValue()) * 100;
        Long remainingPoint = Math.max(targetPoint - todayPoint,0L);

        return new SellerPointGoalResponse(
                sellerId,
                today,
                targetPoint,
                todayPoint,
                achievementRate,
                remainingPoint
        );
    }

    @Transactional
    public SellerPointGoalResponse updateTodayGoal(SellerPointGoalRequest request){
        if(request.getSellerId()== null){
            throw new IllegalArgumentException("판매자 정보가 없습니다.");
        }

        if(request.getTargetPoint() == null||request.getTargetPoint()<=0){
            throw new IllegalArgumentException("목표 포인트는 1 이상이어야 합니다.");
        }

        LocalDate today = LocalDate.now();

        SellerPointGoal goal = sellerPointGoalRepository.findBySellerIdAndGoalDate(request.getSellerId(),today).orElseGet(
                ()->createDefaultGoal(request.getSellerId(),today));

        goal.setTargetPoint(request.getTargetPoint());
        goal.setUpdatedAt(LocalDateTime.now());
        sellerPointGoalRepository.save(goal);

        return getTodayGoal(request.getSellerId());
    }

    private SellerPointGoal createDefaultGoal(Long sellerId,LocalDate goalDate){
        SellerPointGoal goal = new SellerPointGoal();
        goal.setSellerId(sellerId);
        goal.setGoalDate(goalDate);
        goal.setTargetPoint(10000L);

        return sellerPointGoalRepository.save(goal);
    }

    private Long getTodayEarnedPoint(Long sellerId,LocalDate today){
        LocalDateTime startDateTime = today.atStartOfDay();
        LocalDateTime endDateTime = today.plusDays(1).atStartOfDay();

        List<SellerPoint> todayPoints =
                sellerPointRepository.findBySellerIdAndPointStatusAndCreatedAtBetween(sellerId,"EARNED",startDateTime,endDateTime);

        return todayPoints.stream()
                .mapToLong(SellerPoint::getSellerPoint)
                .sum();
    }

}
