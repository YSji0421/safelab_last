package com.adjuster.system.reservation.entity;

import com.adjuster.system.enums.AccidentType;
import com.adjuster.system.reservation.enums.ReservationStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "reservations",
       indexes = {
           @Index(name = "idx_res_start", columnList = "start_at"),
           @Index(name = "idx_res_status", columnList = "status")
       })
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String clientName;

    @Column(length = 30)
    private String clientPhone;

    @Column(length = 200)
    private String clientEmail;

    @Column(name = "start_at", nullable = false)
    private LocalDateTime startAt;

    @Column(nullable = false)
    private int durationMin = 30;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private AccidentType accidentType;

    @Column(columnDefinition = "TEXT")
    private String memo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ReservationStatus status = ReservationStatus.REQUESTED;

    /** 사건으로 전환된 경우 연결. nullable. */
    @Column(name = "case_id")
    private Long caseId;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
