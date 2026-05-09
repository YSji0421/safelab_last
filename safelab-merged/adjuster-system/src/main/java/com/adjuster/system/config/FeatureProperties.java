package com.adjuster.system.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * phase 1 / phase 2 전환을 위한 기능 스위치 프로퍼티.
 * application.yml 예시:
 *   feature:
 *     mail:
 *       sender: mock    # mock | smtp
 *     help:
 *       engine: static  # static | llm
 */
@Configuration
@ConfigurationProperties(prefix = "feature")
@Getter
@Setter
public class FeatureProperties {

    private Mail mail = new Mail();
    private Help help = new Help();

    @Getter
    @Setter
    public static class Mail {
        private String sender = "mock";
        private String defaultFromName = "손해사정 시스템";
        private String defaultFromAddress = "noreply@adjuster.local";
    }

    @Getter
    @Setter
    public static class Help {
        private String engine = "static";
        private int debounceMs = 2000;
    }
}
