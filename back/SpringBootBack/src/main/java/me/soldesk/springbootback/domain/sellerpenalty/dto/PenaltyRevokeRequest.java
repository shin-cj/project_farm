package me.soldesk.springbootback.domain.sellerpenalty.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PenaltyRevokeRequest {

    private Long adminId;
    private String revokeReason;


}
