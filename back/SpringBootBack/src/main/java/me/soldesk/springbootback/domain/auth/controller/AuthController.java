package me.soldesk.springbootback.domain.auth.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import me.soldesk.springbootback.domain.auth.dto.FindEmailRequest;
import me.soldesk.springbootback.domain.auth.dto.LoginRequest;
import me.soldesk.springbootback.domain.auth.dto.PasswordResetRequest;
import me.soldesk.springbootback.domain.auth.service.AuthService;
import me.soldesk.springbootback.domain.user.dto.UserResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // 2. 로그인 API
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try{
            // User 엔티티를 그대로 반환하지 않고, 비밀번호가 빠진 응답 DTO를 반환합니다.
            UserResponse user = authService.loginResponse(request);
            return ResponseEntity.ok(user);
        }catch (IllegalStateException e){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }catch (IllegalArgumentException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/find-email")
    public ResponseEntity<Map<String, List<String>>> findEmail(
            @Valid @RequestBody FindEmailRequest request) {
        return ResponseEntity.ok(Map.of("emails", authService.findEmails(request)));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(
            @Valid @RequestBody PasswordResetRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok(Map.of("message", "비밀번호가 변경되었습니다."));
    }

    // 3. 회원정보 수정 API
    @PutMapping("/update")
    public ResponseEntity<String> updateAccount(@RequestBody Map<String, String> request) {
        String result = authService.updateAccount(request.get("name"));
        return ResponseEntity.ok(result);
    }
}
