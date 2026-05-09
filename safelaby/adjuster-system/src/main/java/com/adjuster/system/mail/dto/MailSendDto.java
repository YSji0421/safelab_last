package com.adjuster.system.mail.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MailSendDto {
    private Long consultationId;
    private Long caseId;

    @NotBlank @Email
    private String to;

    @NotBlank
    private String subject;

    @NotBlank
    private String bodyHtml;
}
