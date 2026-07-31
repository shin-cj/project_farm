package me.soldesk.springbootback.domain.user.service;

import lombok.RequiredArgsConstructor;
import me.soldesk.springbootback.domain.farm.entity.Farm;
import me.soldesk.springbootback.domain.farm.repository.FarmRepository;
import me.soldesk.springbootback.domain.product.repository.ProductRepository;
import me.soldesk.springbootback.domain.sellerpenalty.entity.SellerPenalty;
import me.soldesk.springbootback.domain.sellerpenalty.repository.SellerPenaltyRepository;
import me.soldesk.springbootback.domain.sellerpoint.repository.SellerPointWithdrawalRepository;
import me.soldesk.springbootback.domain.user.dto.AdminUserPageResponse;
import me.soldesk.springbootback.domain.user.dto.AdminUserSummaryResponse;
import me.soldesk.springbootback.domain.user.dto.AdminUserView;
import me.soldesk.springbootback.domain.user.dto.WithdrawalReviewResponse;
import me.soldesk.springbootback.domain.user.entity.User;
import me.soldesk.springbootback.domain.user.repository.AdminUserRepository;
import me.soldesk.springbootback.domain.user.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final AdminUserRepository adminUserRepository;
    private final FarmRepository  farmRepository;
    private final SellerPenaltyRepository sellerPenaltyRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final SellerPointWithdrawalRepository  sellerPointWithdrawalRepository;


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

        List<Farm> farms =
                seller ? farmRepository.findBySellerId(user.getUserId())
                        : List.of();


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

    @Transactional
    public void approveWithdrawal(Long userId){
        User user = getWithdrawalPendingUser(userId);

        validateWithdrawalApproval(userId);

        user.setStatus("WITHDRAWN");
        user.setUpdatedAt(LocalDateTime.now());

        userRepository.save(user);

    }

    @Transactional
    public void rejectWithdrawal(Long userId){
        User user = getWithdrawalPendingUser(userId);

        user.setStatus("ACTIVE");
        user.setUpdatedAt(LocalDateTime.now());

        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public WithdrawalReviewResponse getWithdrawalReview(Long userId) {
        User user = getWithdrawalPendingUser(userId);
        List<Farm> farms = farmRepository.findBySellerId(userId);

        long activeOrderCount = farms.stream()
                .mapToLong(farm ->
                        farmRepository.countActiveOrdersByFarmId(farm.getFarmId())
                )
                .sum();

        long onSaleProductCount = farms.stream()
                .flatMap(farm ->
                        productRepository.findByFarmId(farm.getFarmId()).stream()
                )
                .filter(product ->
                        "ON_SALE".equals(product.getProductStatus())
                )
                .count();

        long pendingPointWithdrawalCount =
                sellerPointWithdrawalRepository
                        .findBySellerIdOrderByRequestedAtDesc(userId)
                        .stream()
                        .filter(withdrawal ->
                                "REQUESTED".equals(withdrawal.getWithdrawalStatus())
                                || "APPROVED".equals(withdrawal.getWithdrawalStatus())
                        )
                        .count();

        WithdrawalReviewResponse response = new WithdrawalReviewResponse();
        response.setUserId(user.getUserId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setPhone(user.getPhone());
        response.setStatus(user.getStatus());
        response.setFarmNames(
                farms.stream()
                        .map(Farm::getFarmName)
                        .collect(Collectors.joining(", "))
        );
        response.setOnSaleProductCount(onSaleProductCount);
        response.setActiveOrderCount(activeOrderCount);
        response.setPendingPointWithdrawalCount(pendingPointWithdrawalCount);
        response.setApprovable(
                onSaleProductCount == 0
                        && activeOrderCount == 0
                        && pendingPointWithdrawalCount == 0
        );

        return response;
    }

    private void validateWithdrawalApproval(Long sellerId){
        List<Farm> farms = farmRepository.findBySellerId(sellerId);

        boolean hasActiveOrders = farms.stream()
                .anyMatch(farm ->
                        farmRepository.countActiveOrdersByFarmId(farm.getFarmId()) > 0);

        if(hasActiveOrders){
            throw new IllegalArgumentException(
                    "처리 중인 주문 또는 배송이 있어 탈퇴를 승인할 수 없습니다."
            );
        }

        boolean hasOnSaleProducts = farms.stream()
                .flatMap(farm ->
                        productRepository.findByFarmId(
                                farm.getFarmId()
                        ).stream()
                )
                .anyMatch(product ->
                        "ON_SALE".equals(product.getProductStatus())
                );

        if(hasOnSaleProducts){
            throw new IllegalArgumentException(
                    "판매 중인 상품이 있어 탈퇴를 승인 할 수 없습니다."
            );
        }

        boolean hasPendingWithdrawal =
                sellerPointWithdrawalRepository
                        .findBySellerIdOrderByRequestedAtDesc(sellerId)
                        .stream()
                        .anyMatch(withdrawal ->
                                "REQUESTED".equals(withdrawal.getWithdrawalStatus())
                                || "APPROVED".equals(withdrawal.getWithdrawalStatus())
                        );

        if(hasPendingWithdrawal){
            throw new IllegalArgumentException(
                    "처리 중인 포인트 출금 신청이 있어 탈퇴를 승인할 수 없습니다."
            );
        }
    }


    private User getWithdrawalPendingUser(Long userId){
        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException("존재하지 않는 회원입니다."));

        if(!"WITHDRAWAL_PENDING".equals(user.getStatus())){
            throw new IllegalArgumentException("탈퇴 승인 대기 상태인 회원이 아닙니다.");
        }


        return user;
    }

}
