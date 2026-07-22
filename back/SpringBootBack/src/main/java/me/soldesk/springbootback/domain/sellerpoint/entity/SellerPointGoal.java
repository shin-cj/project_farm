package me.soldesk.springbootback.domain.sellerpoint.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "seller_point_goals")
@Getter
@Setter
@NoArgsConstructor
public class SellerPointGoal {

    @Id
    @SequenceGenerator(
            name = "seller_point_goal_seq_generator",
            sequenceName = "seller_point_goals_seq",
            allocationSize = 1
    )
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seller_point_goals_seq_generator")
    @Column(name = "goal_id",nullable = false)
    private Long goalId;

    @Column(name = "seller_id", nullable = false)
    private Long sellerId;

    @Column(name = "goal_date", nullable = false)
    private LocalDate goalDate = LocalDate.now();

    @Column(name = "target_point", nullable = false)
    private Long targetPoint = 10000L;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

}
