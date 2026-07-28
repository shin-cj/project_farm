package me.soldesk.springbootback.domain.auth.service;

import lombok.RequiredArgsConstructor;
import me.soldesk.springbootback.domain.user.dto.UserRequest;
import me.soldesk.springbootback.domain.user.dto.UserResponse;
import me.soldesk.springbootback.domain.user.entity.User;
import me.soldesk.springbootback.domain.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    public User login(UserRequest request) {

        User user = userRepository.findByEmail(request.getEmail());
        if(user == null){
            throw new IllegalArgumentException("존재하지 않는 회원입니다.");
        }else if(!user.getPasswordHash().equals(request.getPasswordHash())){
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        if("SUSPENDED".equals(user.getStatus())){
            throw new IllegalStateException("사용 정지된 계정입니다.");
        }

        return user;
    }

    public UserResponse loginResponse(UserRequest request) {
        User user = login(request);

        // 로그인 성공 후 프론트엔드에 보낼 정보만 담습니다.
        // passwordHash는 DB 비교용으로만 사용하고 응답에는 포함하지 않습니다.
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

    public String updateAccount(String name) {
        System.out.println("====== 회원정보 수정 요청 ======");
        System.out.println("변경 요청된 이름: " + name);
        return "회원 정보가 성공적으로 수정되었습니다.";

    }
}





