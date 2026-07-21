package me.soldesk.springbootback.domain.sellerpoint.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;


@Getter
@Setter
public class SellerPointGoalResponse {

    private Long sellerId;
    private LocalDate goalDate;
    private Long targetPoint;
    private Long todayPoint;
    private Double achievementRate;
    private Long remainingPoint;

    public SellerPointGoalResponse(Long sellerId,LocalDate goalDate,Long targetPoint,Long todayPoint,Double achievementRate, Long remainingPoint){

        this.sellerId = sellerId;
        this.goalDate = goalDate;
        this.targetPoint = targetPoint;
        this.todayPoint = todayPoint;
        this.achievementRate = achievementRate;
        this.remainingPoint = remainingPoint;

    }

}
