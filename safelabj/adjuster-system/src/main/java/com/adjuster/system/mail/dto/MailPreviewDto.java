package com.adjuster.system.mail.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MailPreviewDto {
    private final Long consultationId;
    private final Long caseId;
    private final String to;
    private final String subject;
    private final String bodyHtml;
}
