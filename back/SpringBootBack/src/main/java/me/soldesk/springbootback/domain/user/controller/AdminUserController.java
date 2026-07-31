package me.soldesk.springbootback.domain.user.controller;

import lombok.RequiredArgsConstructor;
import me.soldesk.springbootback.domain.user.dto.AdminUserPageResponse;
import me.soldesk.springbootback.domain.user.dto.WithdrawalReviewResponse;
import me.soldesk.springbootback.domain.user.service.AdminUserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final AdminUserService adminUserService;

    @GetMapping
    public AdminUserPageResponse getUsers(
            @RequestParam(defaultValue = "ALL")
            String role,
            @RequestParam(required = false)
            String keyword,
            @RequestParam(defaultValue = "LATEST")
            String sortOption,
            @RequestParam(defaultValue = "ALL")
            String status,
            @RequestParam(defaultValue = "0")
            int page,
            @RequestParam(defaultValue = "20")
            int size
    ){
        return adminUserService.getUsers(role, keyword, sortOption, status, page, size);
    }

    @PatchMapping("/{userId}/withdrawal/approve")
    public ResponseEntity<Map<String, String>> approveWithdrawal(
        @PathVariable Long userId
    ){
        adminUserService.approveWithdrawal(userId);

        return ResponseEntity.ok(
                Map.of(
                        "status", "success",
                            "message", "회원 탈퇴가 승인되었습니다."
                )
        );
    }

    @PatchMapping("/{userId}/withdrawal/reject")
    public ResponseEntity<Map<String, String>> rejectWithdrawal(
        @PathVariable Long userId
    ){
        adminUserService.rejectWithdrawal(userId);

        return ResponseEntity.ok(
                Map.of(
                        "status", "success",
                        "message","회원 탈퇴 요쳥이 반려되었습니다."
                )
        );
    }

    @GetMapping("/{userId}/withdrawal-review")
    public WithdrawalReviewResponse getWithdrawalReview(
            @PathVariable Long userId
    ) {
        return adminUserService.getWithdrawalReview(userId);
    }

}
