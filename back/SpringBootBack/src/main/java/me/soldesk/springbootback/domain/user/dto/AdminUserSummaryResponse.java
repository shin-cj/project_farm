package me.soldesk.springbootback.domain.user.dto;


import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class AdminUserSummaryResponse {

    private Long userId;

    private Long roleId;
    private String roleName;

    private String email;
    private String name;
    private String phone;
    private String status;

    private String address;
    private String detailAddress;

    private String farmIds;
    private String farmNames;
    private Long farmCount;

    private Long activePenaltyPoints;
    private Long totalPenaltyPoints;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

}
