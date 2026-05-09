package com.adjuster.system.mail.repository;

import com.adjuster.system.mail.entity.MailLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MailLogRepository extends JpaRepository<MailLog, Long> {
    Page<MailLog> findAllByOrderBySentAtDesc(Pageable pageable);
}
