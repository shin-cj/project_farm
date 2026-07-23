package me.soldesk.springbootback.domain.user.dto;

import java.time.LocalDateTime;

public interface AdminUserView {

    Long getUserId();

    Long getRoleId();

    String getRoleName();

    String getEmail();

    String getName();

    String getPhone();

    String getStatus();

    String getAddress();

    String getDetailAddress();

    String getFarmIds();

    String getFarmNames();

    Long getFarmCount();

    Long getActivePenaltyPoints();

    Long getTotalPenaltyPoints();

    LocalDateTime getCreatedAt();

    LocalDateTime getUpdatedAt();
}
