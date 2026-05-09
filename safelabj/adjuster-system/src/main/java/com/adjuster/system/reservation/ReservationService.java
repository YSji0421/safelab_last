package com.adjuster.system.reservation;

import com.adjuster.system.exception.ValidationException;
import com.adjuster.system.reservation.dto.ReservationForm;
import com.adjuster.system.reservation.entity.Reservation;
import com.adjuster.system.reservation.enums.ReservationStatus;
import com.adjuster.system.reservation.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
@Transactional
public class ReservationService {

    private final ReservationRepository reservationRepository;

    public Long create(ReservationForm form) {
        validate(form);

        Reservation r = new Reservation();
        r.setClientName(form.getClientName().trim());
        r.setClientPhone(blankToNull(form.getClientPhone()));
        r.setClientEmail(blankToNull(form.getClientEmail()));
        r.setStartAt(form.getStartAt());
        r.setDurationMin(form.getDurationMin() > 0 ? form.getDurationMin() : 30);
        r.setAccidentType(form.getAccidentType());
        r.setMemo(form.getMemo());
        r.setStatus(ReservationStatus.REQUESTED);
        return reservationRepository.save(r).getId();
    }

    public void changeStatus(Long id, ReservationStatus next) {
        Reservation r = findOrThrow(id);
        ReservationStatus cur = r.getStatus();

        if (cur == next) return;
        if (cur == ReservationStatus.CANCELLED || cur == ReservationStatus.NO_SHOW
            || cur == ReservationStatus.COMPLETED) {
            throw new ValidationException("종결된 예약은 상태를 변경할 수 없습니다.");
        }
        if (next == ReservationStatus.CONFIRMED && hasOverlap(r)) {
            throw new ValidationException("같은 시간대에 이미 확정된 예약이 있습니다.");
        }
        r.setStatus(next);
    }

    @Transactional(readOnly = true)
    public Page<Reservation> search(ReservationStatus status, LocalDate from, LocalDate to, Pageable pageable) {
        LocalDateTime f = from == null ? null : from.atStartOfDay();
        LocalDateTime t = to   == null ? null : to.plusDays(1).atStartOfDay();
        return reservationRepository.searchByRange(status, f, t, pageable);
    }

    @Transactional(readOnly = true)
    public List<Reservation> findTodays() {
        LocalDateTime start = LocalDate.now().atStartOfDay();
        LocalDateTime end   = start.plusDays(1);
        return reservationRepository.findByStartAtBetweenOrderByStartAtAsc(start, end);
    }

    @Transactional(readOnly = true)
    public Reservation findById(Long id) {
        return findOrThrow(id);
    }

    @Transactional(readOnly = true)
    public java.util.Optional<Reservation> findByCaseIdOptional(Long caseId) {
        return reservationRepository.findByCaseId(caseId);
    }

    public void linkToCase(Long reservationId, Long caseId) {
        Reservation r = findOrThrow(reservationId);
        r.setCaseId(caseId);
        if (r.getStatus() == ReservationStatus.REQUESTED
            || r.getStatus() == ReservationStatus.CONFIRMED) {
            r.setStatus(ReservationStatus.COMPLETED);
        }
    }

    // --- helpers ---

    private Reservation findOrThrow(Long id) {
        return reservationRepository.findById(id)
            .orElseThrow(() -> new NoSuchElementException("예약을 찾을 수 없습니다. id=" + id));
    }

    private void validate(ReservationForm form) {
        if (form.getStartAt() == null) {
            throw new ValidationException("예약 일시는 필수입니다.");
        }
        if (form.getStartAt().isBefore(LocalDateTime.now())) {
            throw new ValidationException("과거 시간으로는 예약할 수 없습니다.");
        }
        if (!form.hasAnyContact()) {
            throw new ValidationException("연락처 또는 이메일 중 최소 하나는 필요합니다.");
        }
    }

    /** CONFIRMED 로 전환 시 같은 시간대(분 단위 겹침) 확정 예약이 있는지 점검 */
    private boolean hasOverlap(Reservation r) {
        LocalDate day = r.getStartAt().toLocalDate();
        LocalDateTime dayStart = day.atStartOfDay();
        LocalDateTime dayEnd   = day.plusDays(1).atStartOfDay();

        LocalDateTime myStart = r.getStartAt();
        LocalDateTime myEnd   = myStart.plusMinutes(r.getDurationMin());

        return reservationRepository
            .findByStatusAndStartAtBetween(ReservationStatus.CONFIRMED, dayStart, dayEnd)
            .stream()
            .filter(other -> !other.getId().equals(r.getId()))
            .anyMatch(other -> {
                LocalDateTime oStart = other.getStartAt();
                LocalDateTime oEnd   = oStart.plusMinutes(other.getDurationMin());
                return oStart.isBefore(myEnd) && myStart.isBefore(oEnd);
            });
    }

    private String blankToNull(String s) {
        return (s == null || s.isBlank()) ? null : s.trim();
    }
}
