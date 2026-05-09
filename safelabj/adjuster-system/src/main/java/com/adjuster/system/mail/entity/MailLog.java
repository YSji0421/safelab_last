package com.adjuster.system.mail.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "mail_logs",
       indexes = {
           @Index(name = "idx_mail_consultation", columnList = "consultation_id"),
           @Index(name = "idx_mail_sent_at", columnList = "sent_at")
       })
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
public class MailLog {

    public enum Status { SENT, MOCK, FAILED }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "consultation_id")
    private Long consultationId;

    @Column(name = "case_id")
    private Long caseId;

    @Column(nullable = false, length = 200)
    private String toAddress;

    @Column(nullable = false, length = 200)
    private String subject;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String bodyHtml;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Status status;

    @Column(length = 500)
    private String errorMessage;

    @CreatedDate
    @Column(name = "sent_at", updatable = false)
    private LocalDateTime sentAt;
}
