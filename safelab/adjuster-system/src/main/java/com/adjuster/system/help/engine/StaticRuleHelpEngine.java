package com.adjuster.system.help.engine;

import com.adjuster.system.help.dto.HelpRequestDto;
import com.adjuster.system.help.dto.HelpResponseDto;
import com.adjuster.system.help.loader.HelpRuleLoader;
import com.adjuster.system.help.model.HelpRule;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * phase 1 기본 구현체. feature.help.engine=static (기본값) 일 때 활성.
 * rule JSON + 키워드 매칭으로 응답 생성.
 */
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(prefix = "feature.help", name = "engine", havingValue = "static", matchIfMissing = true)
public class StaticRuleHelpEngine implements HelpRuleEngine {

    private final HelpRuleLoader ruleLoader;

    @Override
    public HelpResponseDto suggest(HelpRequestDto request) {
        HelpRule rule = ruleLoader.get(request.getAccidentType());

        List<String> hints = new ArrayList<>();
        String text = request.getConsultationText() == null ? "" : request.getConsultationText();
        for (Map.Entry<String, List<String>> kw : rule.getKeywords().entrySet()) {
            if (text.contains(kw.getKey())) {
                hints.addAll(kw.getValue());
            }
        }

        return HelpResponseDto.builder()
            .accidentType(request.getAccidentType() == null ? null : request.getAccidentType().name())
            .suggestedQuestions(rule.getSuggestedQuestions())
            .checklist(rule.getChecklist())
            .requiredDocs(rule.getRequiredDocs())
            .cautions(rule.getCautions())
            .keywordHints(hints)
            .engine(getImplName())
            .build();
    }

    @Override
    public String getImplName() {
        return "static";
    }
}
