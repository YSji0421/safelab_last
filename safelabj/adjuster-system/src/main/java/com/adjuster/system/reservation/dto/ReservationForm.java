package com.adjuster.system.reservation.dto;

import com.adjuster.system.enums.AccidentType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;

@Getter
@Setter
public class ReservationForm {

    @NotBlank(message = "고객명은 필수입니다.")
    private String clientName;

    private String clientPhone;

    @Email(message = "이메일 형식이 올바르지 않습니다.")
    private String clientEmail;

    @NotNull(message = "예약 일시는 필수입니다.")
    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private LocalDateTime startAt;

    private int durationMin = 30;

    private AccidentType accidentType;

    private String memo;

    /** 최소 하나는 있어야 함 */
    public boolean hasAnyContact() {
        return (clientPhone != null && !clientPhone.isBlank())
            || (clientEmail != null && !clientEmail.isBlank());
    }
}
