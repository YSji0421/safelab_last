package com.adjuster.system.help.engine;

import com.adjuster.system.help.dto.HelpRequestDto;
import com.adjuster.system.help.dto.HelpResponseDto;

/**
 * phase 1: StaticRuleHelpEngine (JSON seed 기반)
 * phase 2: LlmHelpEngine (외부 LLM 호출)
 *
 * feature.help.engine 프로퍼티로 구현체 분기.
 */
public interface HelpRuleEngine {

    HelpResponseDto suggest(HelpRequestDto request);

    String getImplName();
}
