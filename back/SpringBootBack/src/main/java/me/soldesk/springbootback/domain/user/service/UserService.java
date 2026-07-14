package me.soldesk.springbootback.domain.user.service;

import lombok.RequiredArgsConstructor;
import me.soldesk.springbootback.domain.user.dto.UserRequest;
import me.soldesk.springbootback.domain.user.entity.User;
import me.soldesk.springbootback.domain.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    // 1. 회원가입 로직
    // UserService.java
    public void registerUser(UserRequest request) {
        User user = new User();
        user.setEmail(request.getEmail());

        // 💡 여기서 암호화 로직을 쓰신다면, 암호화된 값을 넣어야 합니다.
        // 암호화 전이라면, 일단 request에서 가져온 값이 null이 아닌지 확인하세요.
        user.setPasswordHash(request.getPasswordHash());

        user.setName(request.getName());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());
        user.setDetailAddress(request.getDetailAddress());
        user.setRoleId(request.getRoleId());
        user.setStatus("ACTIVE"); // 💡 DB에서 DEFAULT값이라도 엔티티에서 넣어주는 게 안전합니다.

        userRepository.save(user); // 여기서 save를 호출
    }

    // 2. 단건 회원 정보 조회 로직 (조회용)
    public User getUserInfo(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 회원입니다."));
    }
}