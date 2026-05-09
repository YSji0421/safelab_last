package com.adjuster.system.reservation.repository;

import com.adjuster.system.reservation.entity.Reservation;
import com.adjuster.system.reservation.enums.ReservationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    @Query("""
        SELECT r FROM Reservation r
         WHERE (:status IS NULL OR r.status = :status)
           AND (:from   IS NULL OR r.startAt >= :from)
           AND (:to     IS NULL OR r.startAt <  :to)
         ORDER BY r.startAt ASC
    """)
    Page<Reservation> searchByRange(@Param("status") ReservationStatus status,
                                    @Param("from") LocalDateTime from,
                                    @Param("to") LocalDateTime to,
                                    Pageable pageable);

    /** 오늘의 예약 (대시보드 위젯) */
    List<Reservation> findByStartAtBetweenOrderByStartAtAsc(LocalDateTime from, LocalDateTime to);

    /** 같은 날짜 CONFIRMED 목록 (서비스에서 겹침 검사) */
    List<Reservation> findByStatusAndStartAtBetween(ReservationStatus status,
                                                    LocalDateTime from,
                                                    LocalDateTime to);

    /** 사건에 연결된 예약 역조회 */
    java.util.Optional<Reservation> findByCaseId(Long caseId);
}
