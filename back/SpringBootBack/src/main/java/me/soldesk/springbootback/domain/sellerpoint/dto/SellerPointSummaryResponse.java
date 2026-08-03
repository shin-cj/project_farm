package me.soldesk.springbootback.domain.sellerpoint.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SellerPointSummaryResponse {

    private Long totalEarnedPoint;
    private Long pendingPoint;
    private Long availablePoint;
    private Long canceledPoint;
    private Long refundedPoint;
    private Long totalPlatformFee;

    public SellerPointSummaryResponse(Long totalEarnedPoint,
                                      Long pendingPoint,
                                      Long availablePoint,
                                      Long canceledPoint,
                                      Long refundedPoint,
                                      Long totalPlatformFee) {
        this.totalEarnedPoint = totalEarnedPoint;
        this.pendingPoint = pendingPoint;
        this.availablePoint = availablePoint;
        this.canceledPoint = canceledPoint;
        this.refundedPoint = refundedPoint;
        this.totalPlatformFee = totalPlatformFee;
    }
}
