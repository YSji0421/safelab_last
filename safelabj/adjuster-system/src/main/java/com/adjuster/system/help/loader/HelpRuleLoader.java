package com.adjuster.system.help.loader;

import com.adjuster.system.enums.AccidentType;
import com.adjuster.system.help.model.HelpRule;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.*;

/**
 * resources/help/rules.json 을 기동 시 메모리 Map 으로 로드.
 */
@Slf4j
@Component
public class HelpRuleLoader {

    private final Map<AccidentType, HelpRule> rulesByType = new EnumMap<>(AccidentType.class);
    private final HelpRule defaultRule = new HelpRule();

    @Getter
    @Setter
    @NoArgsConstructor
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class RulesRoot {
        private List<HelpRule> rules = new ArrayList<>();
    }

    @PostConstruct
    public void load() {
        try (InputStream is = new ClassPathResource("help/rules.json").getInputStream()) {
            ObjectMapper mapper = new ObjectMapper();
            RulesRoot root = mapper.readValue(is, RulesRoot.class);
            for (HelpRule r : root.getRules()) {
                if (r.getAccidentType() != null) {
                    rulesByType.put(r.getAccidentType(), r);
                }
            }
            log.info("[HelpRuleLoader] Loaded {} rules: {}",
                rulesByType.size(), rulesByType.keySet());
        } catch (Exception e) {
            log.error("[HelpRuleLoader] Failed to load help rules", e);
        }
    }

    public HelpRule get(AccidentType type) {
        if (type == null) return defaultRule;
        return rulesByType.getOrDefault(type, defaultRule);
    }
}
