package com.adjuster.system.mail.template;

import com.adjuster.system.entity.Case;
import com.adjuster.system.entity.Consultation;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

@Component
@RequiredArgsConstructor
public class MailTemplateRenderer {

    private final SpringTemplateEngine templateEngine;

    private static final DateTimeFormatter DT =
        DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm", Locale.KOREA);

    public String renderSummary(Consultation consultation, List<String> requiredDocs,
                                List<String> nextSteps) {
        Case c = consultation.getCaseEntity();
        Context ctx = new Context(Locale.KOREA);
        ctx.setVariable("clientName",
            c.getClient() != null ? c.getClient().getClientName() : "고객");
        ctx.setVariable("caseName", c.getCaseName());
        ctx.setVariable("accidentType", c.getAccidentType().getDisplayName());
        ctx.setVariable("consultDatetime", consultation.getConsultDatetime().format(DT));
        ctx.setVariable("summaryContent",
            consultation.getSummaryContent() != null
                ? consultation.getSummaryContent()
                : consultation.getContent());
        ctx.setVariable("requiredDocs", requiredDocs);
        ctx.setVariable("nextSteps", nextSteps);
        return templateEngine.process("mail/templates/summary", ctx);
    }

    public String defaultSubject(Consultation consultation) {
        Case c = consultation.getCaseEntity();
        return "[손해사정 상담 요약] " + c.getCaseName();
    }
}
