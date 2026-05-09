package com.adjuster.system.reservation.enums;

public enum ReservationStatus {
    REQUESTED("요청"),
    CONFIRMED("확정"),
    COMPLETED("완료"),
    CANCELLED("취소"),
    NO_SHOW("노쇼");

    private final String displayName;

    ReservationStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}
