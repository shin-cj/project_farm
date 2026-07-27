package me.soldesk.springbootback.domain.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class AdminUserPageResponse {

    private List<AdminUserSummaryResponse> content;

    private int page;
    private int size;

    private long totalElements;
    private int totalPages;

}
