package com.adjuster.system.safety.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "safety_attempts", indexes = {
        @Index(name = "idx_safety_attempts_student", columnList = "studentNo"),
        @Index(name = "idx_safety_attempts_dept", columnList = "deptId")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SafetyAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 32)
    private String studentNo;

    @Column(nullable = false, length = 100)
    private String studentName;

    @Column(nullable = false, length = 32)
    private String deptId;

    @Column(nullable = false, length = 64)
    private String scenarioId;

    @Column(nullable = false)
    private int score;

    @Column(nullable = false)
    private int total;

    @Column(nullable = false)
    private boolean passed;

    @Column(nullable = false)
    private LocalDateTime attemptedAt;
}
