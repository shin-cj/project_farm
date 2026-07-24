package me.soldesk.springbootback.domain.user.service;

import lombok.RequiredArgsConstructor;
import me.soldesk.springbootback.domain.farm.entity.Farm;
import me.soldesk.springbootback.domain.farm.repository.FarmRepository;
import me.soldesk.springbootback.domain.sellerpenalty.entity.SellerPenalty;
import me.soldesk.springbootback.domain.sellerpenalty.repository.SellerPenaltyRepository;
import me.soldesk.springbootback.domain.user.dto.AdminUserPageResponse;
import me.soldesk.springbootback.domain.user.dto.AdminUserSummaryResponse;
import me.soldesk.springbootback.domain.user.dto.AdminUserView;
import me.soldesk.springbootback.domain.user.entity.User;
import me.soldesk.springbootback.domain.user.repository.AdminUserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final AdminUserRepository adminUserRepository;
    private final FarmRepository  farmRepository;
    private final SellerPenaltyRepository sellerPenaltyRepository;


    @Transactional(readOnly = true)
    public AdminUserPageResponse getUsers(
            String role,
            String keyword,
            String sortOption,
            String status,
            int page,
            int size
    ){
        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size,1), 100);

        Long roleId = convertRoleId(role);
        String searchPattern = createSearchPattern(keyword);
        Long farmId = parseFarmId(keyword);

        PageRequest pageable =
                PageRequest.of(safePage,safeSize);

        String normalizedStatus =
                status == null || status.isBlank() || "ALL".equalsIgnoreCase(status)
                ? null
                : status.trim().toUpperCase();

        String normalizedSort =
                sortOption == null || sortOption.isBlank()
                ? "LATEST"
                : sortOption.trim().toUpperCase();

        List<String> allowedSorts =
                List.of("LATEST","TOTAL_PENALTY", "ACTIVE_PENALTY");

        if (!allowedSorts.contains(normalizedSort)) {
            throw new IllegalArgumentException("올바르지 않은 정렬 기준 입니다.");
        }

        Page<User> result =
                adminUserRepository.findAdminUsers(
                        List.of(2L,3L),
                        roleId,
                        normalizedStatus,
                        searchPattern,
                        farmId,
                        normalizedSort,
                        pageable
                );
        List<AdminUserSummaryResponse> users =
                result.getContent()
                        .stream()
                        .map(this::toResponse)
                        .toList();

        return new AdminUserPageResponse(
                users,
                result.getNumber(),
                result.getSize(),
                result.getTotalElements(),
                result.getTotalPages()
        );
    }
    private AdminUserSummaryResponse toResponse(User user) {
        AdminUserSummaryResponse response = new AdminUserSummaryResponse();

        response.setUserId(user.getUserId());
        response.setRoleId(user.getRoleId());
        response.setRoleName(convertRoleName(user.getRoleId()));
        response.setEmail(user.getEmail());
        response.setName(user.getName());
        response.setPhone(user.getPhone());
        response.setStatus(user.getStatus());
        response.setAddress(user.getAddress());
        response.setDetailAddress(user.getDetailAddress());
        response.setCreatedAt(user.getCreatedAt());
        response.setUpdatedAt(user.getUpdatedAt());
        addSellerInformation(response, user);

        return response;
    }

    private void addSellerInformation(
            AdminUserSummaryResponse response,
            User user
    ){
        boolean seller =
                Long.valueOf(3L).equals(user.getRoleId());

        if(!seller){
            response.setFarmIds(null);
            response.setFarmNames(null);
            response.setFarmCount(0L);
            response.setActivePenaltyPoints(0L);
            response.setTotalPenaltyPoints(0L);
            return;
        }

        List<Farm> farms =
                farmRepository.findBySellerId(
                        user.getUserId()
                );

        List<SellerPenalty> penalties =
                sellerPenaltyRepository
                        .findBySellerIdOrderByCreatedAtDesc(
                                user.getUserId()
                        );
        response.setFarmCount((long) farms.size());

        if(farms.isEmpty()){
            response.setFarmIds(null);
            response.setFarmNames(null);
        }else {
            String farmIds =
                    farms.stream()
                            .map(Farm::getFarmId)
                            .map(String::valueOf)
                            .collect(
                                    Collectors.joining(", ")
                            );

            String farmNames =
                    farms.stream()
                            .map(Farm::getFarmName)
                            .collect(
                                    Collectors.joining(", ")
                            );

            response.setFarmIds(farmIds);
            response.setFarmNames(farmNames);
        }

        long activePenaltyPoints =
                penalties.stream()
                        .filter(penalty ->
                                "ACTIVE".equals(
                                        penalty.getPenaltyStatus()
                                )
                        )
                        .mapToLong(this::getPenaltyPoints)
                        .sum();

        long totalPenaltyPoints =
                penalties.stream()
                        .mapToLong(this::getPenaltyPoints)
                        .sum();

        response.setActivePenaltyPoints(activePenaltyPoints);
        response.setTotalPenaltyPoints(totalPenaltyPoints);
    }

    private String convertRoleName(Long roleId) {
        if(Long.valueOf(2L).equals(roleId)){
            return "BUYER";
        }
        if(Long.valueOf(3L).equals(roleId)){
            return "SELLER";
        }

        return "UNKNOWN";
    }

    private long getPenaltyPoints(SellerPenalty penalty){
        if (penalty.getPenaltyPoints() == null){
            return 0L;
        }

        return penalty.getPenaltyPoints().longValue();
    }

    private Long convertRoleId(String role){
        if(role == null || role.isBlank() || "ALL".equalsIgnoreCase(role)){
            return null;
        }

        if("BUYER".equalsIgnoreCase(role)){
            return 2L;
        }

        if("SELLER".equalsIgnoreCase(role)){
            return 3L;
        }

        throw new IllegalArgumentException(
                "회원 유형은 ALL, BUYER, SELLER만 가능합니다."
        );
    }

    private String createSearchPattern(String keyword){
        if(keyword == null || keyword.isBlank()){
            return null;
        }

        return "%" + keyword.trim().toLowerCase() + "%";
    }

    private Long parseFarmId(String keyword){
        if(keyword == null || keyword.isBlank()){
            return null;
        }

        try {
            return Long.valueOf(keyword.trim());
        }catch (NumberFormatException e){
            return null;
        }
    }

}
