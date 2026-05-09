package com.adjuster.system.safety.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class AccidentDistributionItem {
    private String type;
    private int count;
}
