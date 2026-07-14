package me.soldesk.springbootback.domain.user.service;

import lombok.RequiredArgsConstructor;
import me.soldesk.springbootback.domain.user.dto.UserRequest;
import me.soldesk.springbootback.domain.user.dto.UserResponse;
import me.soldesk.springbootback.domain.user.entity.User;
import me.soldesk.springbootback.domain.user.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public void registerUser(UserRequest request) {
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPasswordHash(request.getPasswordHash());
        user.setName(request.getName());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        user.setDetailAddress(request.getDetailAddress());
        user.setRoleId(request.getRoleId());
        user.setStatus("ACTIVE");

        userRepository.save(user);
    }

    public User getUserInfo(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));
    }

    public UserResponse getUser(Long userId) {
        User user = getUserInfo(userId);

        UserResponse response = new UserResponse();
        response.setUserId(user.getUserId());
        response.setRoleId(user.getRoleId());
        response.setEmail(user.getEmail());
        response.setName(user.getName());
        response.setPhone(user.getPhone());
        response.setStatus(user.getStatus());
        response.setAddress(user.getAddress());
        response.setDetailAddress(user.getDetailAddress());
        response.setCreatedAt(user.getCreatedAt());
        response.setUpdatedAt(user.getUpdatedAt());

        return response;
    }
}