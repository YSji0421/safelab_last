package com.adjuster.system.help.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor
public class HelpResponseDto {
    private final String accidentType;
    private final List<String> suggestedQuestions;
    private final List<String> checklist;
    private final List<String> requiredDocs;
    private final List<String> cautions;
    /** 키워드 매칭으로 추가된 동적 메시지 */
    private final List<String> keywordHints;
    private final String engine;
}
