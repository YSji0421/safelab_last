package com.adjuster.system.mail.sender;

import com.adjuster.system.mail.dto.MailSendDto;
import com.adjuster.system.mail.entity.MailLog;
import com.adjuster.system.mail.repository.MailLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

/**
 * phase 1 기본 구현체. feature.mail.sender=mock (기본값) 일 때 활성.
 * 실제 이메일은 발송하지 않고 MailLog 에만 기록.
 */
@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(prefix = "feature.mail", name = "sender", havingValue = "mock", matchIfMissing = true)
public class MockMailSender implements MailSender {

    private final MailLogRepository mailLogRepository;

    @Override
    public MailLog send(MailSendDto dto) {
        MailLog log = new MailLog();
        log.setConsultationId(dto.getConsultationId());
        log.setCaseId(dto.getCaseId());
        log.setToAddress(dto.getTo());
        log.setSubject(dto.getSubject());
        log.setBodyHtml(dto.getBodyHtml());
        log.setStatus(MailLog.Status.MOCK);
        MailLog saved = mailLogRepository.save(log);
        MockMailSender.log.info("[MockMailSender] to={}, subject={}, logId={}",
            dto.getTo(), dto.getSubject(), saved.getId());
        return saved;
    }

    @Override
    public String getImplName() {
        return "mock";
    }
}
