package me.soldesk.springbootback.domain.user.service;

import lombok.RequiredArgsConstructor;
import me.soldesk.springbootback.domain.user.dto.UserProfileUpdateRequest;
import me.soldesk.springbootback.domain.user.dto.UserRequest;
import me.soldesk.springbootback.domain.user.dto.UserResponse;
import me.soldesk.springbootback.domain.user.entity.User;
import me.soldesk.springbootback.domain.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public void registerUser(UserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("이미 가입된 이메일입니다.");
        }

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

   @Transactional
   public void requestWithdrawal(Long userId){
        User user = getUserInfo(userId);

        if(!Long.valueOf(3L).equals(user.getRoleId())){
            throw new IllegalArgumentException("판매자 계정만 탈퇴 승인을 신청할 수 있습니다.");
        }

        if("WITHDRAWAL_PENDING".equals(user.getStatus())){
            throw new IllegalArgumentException("이미 탈퇴 승인을 기다리고 있습니다.");
        }

        if("WITHDRAWN".equals(user.getStatus())){
            throw new IllegalArgumentException("이미 탈퇴 처리된 계정입니다.");
        }

        if(!"ACTIVE".equals(user.getStatus())){
            throw new IllegalArgumentException("현재 계정 상태에서는 탈퇴를 신청할 수 없습니다.");
        }

        user.setStatus("WITHDRAWAL_PENDING");
        user.setUpdatedAt(LocalDateTime.now());

        userRepository.save(user);

   }

   @Transactional
    public UserResponse updateUserProfile(
            Long userId,
            UserProfileUpdateRequest request
   ){
        User user = getUserInfo(userId);

        if("WITHDRAWN".equals(user.getStatus())){
            throw new IllegalArgumentException(
                    "탈퇴한 회원은 정보를 수정할 수 없습니다."
            );
        }

        if("WITHDRAWAL_PENDING".equals(user.getStatus())){
            throw new IllegalArgumentException(
                    "탈퇴 승인 대기 중에는 개인정보를 수정할 수 없습니다."
            );
        }

        user.setName(request.getName().trim());
        user.setPhone(request.getPhone().trim());
        user.setAddress(request.getAddress().trim());
        user.setDetailAddress(request.getDetailAddress().trim());

        if(request.getNewPassword() != null
            && !request.getNewPassword().isBlank()){
            user.setPasswordHash(request.getNewPassword());
        }

        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        return getUser(userId);
   }

}