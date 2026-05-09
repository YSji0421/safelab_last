package com.adjuster.system.safety.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class PendingStudent {
    private String studentNo;
    private String name;
    private String dept;
    private String progress;
    private int daysLeft;
}
