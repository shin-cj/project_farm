package me.soldesk.springbootback.domain.sellerpenalty.dto;


import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class SellerPenaltyResponse {

    private Long penaltyId;
    private Long reportId;
    private Long sellerId;
    private Long productId;

    private String penaltyType;
    private Integer penaltyPoints;
    private String penaltyReason;
    private String penaltyStatus;

    private Long createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;


}
