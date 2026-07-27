package me.soldesk.springbootback.domain.dashboard.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class AdminMemberStatusResponse {

    private Long activeMembers;
    private Long suspendedMembers;
    private Long withdrawnMembers;

}
