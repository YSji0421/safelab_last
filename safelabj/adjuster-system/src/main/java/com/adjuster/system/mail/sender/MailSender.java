package com.adjuster.system.mail.sender;

import com.adjuster.system.mail.dto.MailSendDto;
import com.adjuster.system.mail.entity.MailLog;

/**
 * phase 1: MockMailSender (로그만 기록)
 * phase 2: SmtpMailSender (실제 SMTP 발송)
 *
 * feature.mail.sender 프로퍼티로 구현체 분기.
 */
public interface MailSender {

    /**
     * 발송 처리 후 MailLog 를 돌려준다. 실제 발송 여부와 무관하게 로그는 항상 남긴다.
     */
    MailLog send(MailSendDto dto);

    /**
     * 구현체 식별자. 로그/디버깅용.
     */
    String getImplName();
}
