package com.adjuster.system.mail;

import com.adjuster.system.entity.Case;
import com.adjuster.system.entity.Consultation;
import com.adjuster.system.enums.HistoryActionType;
import com.adjuster.system.help.dto.HelpRequestDto;
import com.adjuster.system.help.dto.HelpResponseDto;
import com.adjuster.system.help.engine.HelpRuleEngine;
import com.adjuster.system.mail.dto.MailPreviewDto;
import com.adjuster.system.mail.dto.MailSendDto;
import com.adjuster.system.mail.entity.MailLog;
import com.adjuster.system.mail.repository.MailLogRepository;
import com.adjuster.system.mail.sender.MailSender;
import com.adjuster.system.mail.template.MailTemplateRenderer;
import com.adjuster.system.service.CaseHistoryService;
import com.adjuster.system.service.ConsultationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class MailService {

    private final ConsultationService consultationService;
    private final MailTemplateRenderer renderer;
    private final MailSender mailSender;
    private final MailLogRepository mailLogRepository;
    private final CaseHistoryService caseHistoryService;
    private final HelpRuleEngine helpRuleEngine;

    /** 기본 "다음 단계" 안내 (phase 1) */
    private static final List<String> DEFAULT_NEXT_STEPS = List.of(
        "필요 서류를 준비하여 담당 손해사정사에게 전달해 주세요.",
        "추가 문의 사항은 본 메일에 회신 주시기 바랍니다.",
        "치료 중인 경우 영수증 및 진단서를 지속적으로 수집해 주세요."
    );

    @Transactional(readOnly = true)
    public MailPreviewDto buildPreview(Long consultationId) {
        Consultation consultation = consultationService.findById(consultationId);
        Case c = consultation.getCaseEntity();

        // 필요 서류는 help engine 의 rule 을 재활용
        HelpRequestDto helpReq = new HelpRequestDto();
        helpReq.setAccidentType(c.getAccidentType());
        HelpResponseDto help = helpRuleEngine.suggest(helpReq);

        String bodyHtml = renderer.renderSummary(consultation, help.getRequiredDocs(), DEFAULT_NEXT_STEPS);
        String subject  = renderer.defaultSubject(consultation);
        String to       = (c.getClient() != null) ? c.getClient().getEmail() : null;

        return new MailPreviewDto(consultationId, c.getId(), to, subject, bodyHtml);
    }

    public MailLog send(MailSendDto dto) {
        // 발송
        MailLog log = mailSender.send(dto);
        // 히스토리 기록 (caseId 가 있는 경우)
        if (dto.getCaseId() != null) {
            caseHistoryService.record(dto.getCaseId(), HistoryActionType.MAIL_SENT,
                "상담 요약 이메일 발송: " + dto.getTo());
        }
        return log;
    }

    @Transactional(readOnly = true)
    public Page<MailLog> findLogs(Pageable pageable) {
        return mailLogRepository.findAllByOrderBySentAtDesc(pageable);
    }

    @Transactional(readOnly = true)
    public MailLog findLog(Long id) {
        return mailLogRepository.findById(id)
            .orElseThrow(() -> new java.util.NoSuchElementException("메일 로그가 없습니다. id=" + id));
    }
}
