package com.adjuster.system.safety;

import com.adjuster.system.safety.dto.AdminProgressResponse;
import com.adjuster.system.safety.dto.AdminProgressResponse.DeptProgress;
import com.adjuster.system.safety.dto.DeptCourseResponse;
import com.adjuster.system.safety.dto.SafetyAttemptRequest;
import com.adjuster.system.safety.entity.SafetyAttempt;
import com.adjuster.system.safety.repository.SafetyAttemptRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class SafetyService {

    private final SafetyAttemptRepository attemptRepository;

    private static final int PASS_SCORE = 4;

    /** 학과별 교육 컨텐츠 조회 */
    public DeptCourseResponse getCourse(String deptId) {
        DeptCourseResponse course = SafetyContentCatalog.DEPARTMENTS.get(deptId);
        if (course == null) {
            throw new IllegalArgumentException("Unknown department: " + deptId);
        }
        return course;
    }

    /** 학생 시도(이수) 기록 저장 */
    @Transactional
    public SafetyAttempt recordAttempt(SafetyAttemptRequest req) {
        boolean passed = req.getScore() >= PASS_SCORE;
        SafetyAttempt attempt = SafetyAttempt.builder()
                .studentNo(req.getStudentNo())
                .studentName(req.getStudentName())
                .deptId(req.getDeptId())
                .scenarioId(req.getScenarioId())
                .score(req.getScore())
                .total(req.getTotal())
                .passed(passed)
                .attemptedAt(LocalDateTime.now())
                .build();
        return attemptRepository.save(attempt);
    }

    /** 관리자 대시보드용 — 시연 단계에서는 mock 통계 + 실제 attempt 합산 */
    public AdminProgressResponse getAdminProgress() {
        // 시연용 baseline mock — 실제 환경에서는 학생 명부와 조인
        Map<String, int[]> baseline = new HashMap<>(Map.of(
                "chem", new int[]{102, 78},
                "mech", new int[]{118, 71},
                "elec", new int[]{96, 70},
                "comp", new int[]{96, 62}
        ));

        // 실제 attempt에서 합격 학생 수 추가
        attemptRepository.countPassedStudentsByDept().forEach(row -> {
            String deptId = (String) row[0];
            Long passed = (Long) row[1];
            int[] cur = baseline.getOrDefault(deptId, new int[]{0, 0});
            cur[1] = Math.min(cur[0], cur[1] + passed.intValue());
        });

        Map<String, String> deptNames = Map.of(
                "chem", "화공환경과", "mech", "기계과", "elec", "전기정보과", "comp", "컴퓨터정보과"
        );

        List<DeptProgress> deptProgress = baseline.entrySet().stream()
                .map(e -> {
                    int total = e.getValue()[0];
                    int completed = e.getValue()[1];
                    int rate = total == 0 ? 0 : (int) Math.round((completed / (double) total) * 100);
                    String risk = rate >= 75 ? "low" : rate >= 65 ? "mid" : "high";
                    return DeptProgress.builder()
                            .id(e.getKey())
                            .name(deptNames.getOrDefault(e.getKey(), e.getKey()))
                            .total(total)
                            .completed(completed)
                            .rate(rate)
                            .risk(risk)
                            .build();
                })
                .toList();

        int totalStudents = deptProgress.stream().mapToInt(DeptProgress::getTotal).sum();
        int enrolled = deptProgress.stream().mapToInt(DeptProgress::getCompleted).sum();
        int rate = totalStudents == 0 ? 0 : (int) Math.round((enrolled / (double) totalStudents) * 100);

        return AdminProgressResponse.builder()
                .totalStudents(totalStudents)
                .enrolledStudents(enrolled)
                .completionRate(rate)
                .pendingStudents(totalStudents - enrolled)
                .recentIncidents7d(3)
                .scenariosCompleted((int) attemptRepository.count() + 1284)
                .deptProgress(deptProgress)
                .build();
    }
}
