package com.adjuster.system.help;

import com.adjuster.system.help.dto.HelpRequestDto;
import com.adjuster.system.help.dto.HelpResponseDto;
import com.adjuster.system.help.engine.HelpRuleEngine;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class HelpService {

    private final HelpRuleEngine engine;

    public HelpResponseDto suggest(HelpRequestDto request) {
        return engine.suggest(request);
    }

    public String engineImpl() {
        return engine.getImplName();
    }
}
