package me.soldesk.springbootback.domain.auth.service;

import lombok.RequiredArgsConstructor;
import me.soldesk.springbootback.domain.user.dto.UserRequest;
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
        return user;
    }

    public String updateAccount(String name) {
        System.out.println("====== 회원정보 수정 요청 ======");
        System.out.println("변경 요청된 이름: " + name);
        return "회원 정보가 성공적으로 수정되었습니다.";

    }
}





