package com.adjuster.system.safety.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class RecentIncident {
    private String date;
    private String dept;
    private String summary;
    private String status;
}
