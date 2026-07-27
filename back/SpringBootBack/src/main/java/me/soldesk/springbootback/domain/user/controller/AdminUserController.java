package me.soldesk.springbootback.domain.user.controller;

import lombok.RequiredArgsConstructor;
import me.soldesk.springbootback.domain.user.dto.AdminUserPageResponse;
import me.soldesk.springbootback.domain.user.service.AdminUserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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

}
