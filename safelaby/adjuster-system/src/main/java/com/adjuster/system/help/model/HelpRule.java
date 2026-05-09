package com.adjuster.system.help.model;

import com.adjuster.system.enums.AccidentType;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Collections;
import java.util.List;
import java.util.Map;

/**
 * rules.json 내 단일 rule. Jackson 으로 역직렬화.
 */
@Getter
@Setter
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class HelpRule {

    private AccidentType accidentType;
    private List<String> suggestedQuestions = Collections.emptyList();
    private List<String> checklist = Collections.emptyList();
    private List<String> requiredDocs = Collections.emptyList();
    private List<String> cautions = Collections.emptyList();

    /** keyword → 추가 노출 메시지 리스트 */
    private Map<String, List<String>> keywords = Collections.emptyMap();
}
