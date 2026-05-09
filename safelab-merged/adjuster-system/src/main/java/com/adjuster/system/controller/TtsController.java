package com.adjuster.system.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.DataOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;

@RestController
@RequestMapping("/api/tts")
public class TtsController {

    @Value("${naver.clova.client-id:}")
    private String clientId;

    @Value("${naver.clova.client-secret:}")
    private String clientSecret;

    @Value("${naver.clova.endpoint:https://naveropenapi.apigw.ntruss.com/tts-premium/v1/tts}")
    private String endpoint;

    @PostMapping("/clova")
    public ResponseEntity<byte[]> synthesize(@RequestBody Map<String, Object> body) {
        if (clientId.isEmpty() || clientSecret.isEmpty()) {
            return ResponseEntity.status(503).body("CLOVA credentials not configured".getBytes());
        }

        String text = String.valueOf(body.getOrDefault("text", "")).trim();
        if (text.isEmpty()) {
            return ResponseEntity.badRequest().body("text required".getBytes());
        }

        String speaker = String.valueOf(body.getOrDefault("speaker", "nara"));
        String speed = String.valueOf(body.getOrDefault("speed", "0"));
        String pitch = String.valueOf(body.getOrDefault("pitch", "0"));
        String volume = String.valueOf(body.getOrDefault("volume", "0"));
        String format = String.valueOf(body.getOrDefault("format", "mp3"));

        try {
            String form = "speaker=" + URLEncoder.encode(speaker, StandardCharsets.UTF_8)
                    + "&volume=" + URLEncoder.encode(volume, StandardCharsets.UTF_8)
                    + "&speed=" + URLEncoder.encode(speed, StandardCharsets.UTF_8)
                    + "&pitch=" + URLEncoder.encode(pitch, StandardCharsets.UTF_8)
                    + "&format=" + URLEncoder.encode(format, StandardCharsets.UTF_8)
                    + "&text=" + URLEncoder.encode(text, StandardCharsets.UTF_8);

            HttpURLConnection conn = (HttpURLConnection) new URL(endpoint).openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("X-NCP-APIGW-API-KEY-ID", clientId);
            conn.setRequestProperty("X-NCP-APIGW-API-KEY", clientSecret);
            conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
            conn.setDoOutput(true);
            try (DataOutputStream os = new DataOutputStream(conn.getOutputStream())) {
                os.writeBytes(form);
                os.flush();
            }

            int status = conn.getResponseCode();
            try (InputStream in = (status == 200 ? conn.getInputStream() : conn.getErrorStream())) {
                byte[] payload = in.readAllBytes();
                if (status != 200) {
                    return ResponseEntity.status(status).body(payload);
                }
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType("mp3".equalsIgnoreCase(format)
                        ? MediaType.parseMediaType("audio/mpeg")
                        : MediaType.parseMediaType("audio/wav"));
                headers.setCacheControl("no-store");
                return new ResponseEntity<>(payload, headers, 200);
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(("CLOVA proxy error: " + e.getMessage()).getBytes());
        }
    }
}
