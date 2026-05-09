package com.adjuster.system.help;

import com.adjuster.system.help.dto.HelpRequestDto;
import com.adjuster.system.help.dto.HelpResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/help")
@RequiredArgsConstructor
public class HelpController {

    private final HelpService helpService;

    @PostMapping("/suggest")
    public HelpResponseDto suggest(@RequestBody HelpRequestDto request) {
        // consultationText 길이 방어: 10000자 초과 시 자름
        if (request.getConsultationText() != null
            && request.getConsultationText().length() > 10_000) {
            request.setConsultationText(request.getConsultationText().substring(0, 10_000));
        }
        return helpService.suggest(request);
    }
}
