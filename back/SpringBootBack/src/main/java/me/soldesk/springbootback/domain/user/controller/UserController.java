package me.soldesk.springbootback.domain.user.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import me.soldesk.springbootback.domain.user.dto.UserProfileUpdateRequest;
import me.soldesk.springbootback.domain.user.dto.UserRequest;
import me.soldesk.springbootback.domain.user.dto.UserResponse;
import me.soldesk.springbootback.domain.user.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<Map<String, String>> signUp(@Valid @RequestBody UserRequest request) {
        Map<String, String> response = new HashMap<>();

        try {
            userService.registerUser(request);
            response.put("status", "success");
            response.put("message", "회원가입이 완료되었습니다.");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            response.put("status", "error");
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/{userId}")
    public UserResponse getUser(@PathVariable Long userId) {

        return userService.getUser(userId);
    }

    @PatchMapping("/{userId}/withdrawal-request")
    public ResponseEntity<Map<String, String>> requestWithdrawal(@PathVariable Long userId) {

        userService.requestWithdrawal(userId);

        return ResponseEntity.ok(
                Map.of(
                        "status", "success",
                        "message","회원 탈퇴 승인 요청이 접수되었습니다."
                )
        );
    }

    @PatchMapping("/{userId}/withdraw")
    public ResponseEntity<Map<String, String>> withdrawBuyer(@PathVariable Long userId) {
        userService.withdrawBuyer(userId);

        return ResponseEntity.ok(
                Map.of(
                        "status", "success",
                        "message", "회원 탈퇴가 완료되었습니다."
                )
        );
    }

    @PutMapping("/{userId}")
    public UserResponse updateUserProfile(
        @PathVariable Long userId,
        @Valid @RequestBody UserProfileUpdateRequest request
    ){
        return userService.updateUserProfile(userId, request);
    }
}
