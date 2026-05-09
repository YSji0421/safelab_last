package com.adjuster.system.mail;

import com.adjuster.system.mail.dto.MailPreviewDto;
import com.adjuster.system.mail.dto.MailSendDto;
import com.adjuster.system.mail.entity.MailLog;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.Map;

@Controller
@RequiredArgsConstructor
public class MailController {

    private final MailService mailService;

    /** JSON: 상담 기반 미리보기 DTO 조회 (모달에서 호출) */
    @GetMapping(value = "/api/consultations/{id}/mail/preview", produces = "application/json")
    @ResponseBody
    public MailPreviewDto previewJson(@PathVariable("id") Long consultationId) {
        return mailService.buildPreview(consultationId);
    }

    /** JSON: 발송 처리 */
    @PostMapping(value = "/api/consultations/{id}/mail/send",
                 consumes = "application/json", produces = "application/json")
    @ResponseBody
    public ResponseEntity<Map<String, Object>> sendJson(@PathVariable("id") Long consultationId,
                                                        @Valid @RequestBody MailSendDto dto) {
        dto.setConsultationId(consultationId);
        MailLog log = mailService.send(dto);
        return ResponseEntity.ok(Map.of(
            "success", true,
            "logId", log.getId(),
            "status", log.getStatus().name()
        ));
    }

    /** 페이지: 발송 이력 */
    @GetMapping("/mail/log")
    public String logList(@RequestParam(defaultValue = "0") int page, Model model) {
        model.addAttribute("logs", mailService.findLogs(PageRequest.of(page, 20)));
        return "mail/log_list";
    }

    /** 페이지: 로그 상세 (원문 HTML 보기) */
    @GetMapping("/mail/log/{id}")
    public String logDetail(@PathVariable Long id, Model model) {
        model.addAttribute("log", mailService.findLog(id));
        return "mail/log_detail";
    }
}
