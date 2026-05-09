package com.adjuster.system.safety.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SafetyAttemptRequest {
    private String studentNo;
    private String studentName;
    private String deptId;
    private String scenarioId;
    private int score;
    private int total;
}
