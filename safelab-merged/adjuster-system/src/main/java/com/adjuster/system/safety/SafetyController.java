package com.adjuster.system.safety;

import com.adjuster.system.safety.dto.AccidentDistributionItem;
import com.adjuster.system.safety.dto.AdminProgressResponse;
import com.adjuster.system.safety.dto.DeptCourseResponse;
import com.adjuster.system.safety.dto.PendingStudent;
import com.adjuster.system.safety.dto.RecentIncident;
import com.adjuster.system.safety.dto.SafetyAttemptRequest;
import com.adjuster.system.safety.entity.SafetyAttempt;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/safety")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class SafetyController {

    private final SafetyService safetyService;

    /** 학과별 교육 컨텐츠 (시나리오 + 긴급연락처) */
    @GetMapping("/courses/{deptId}")
    public ResponseEntity<DeptCourseResponse> getCourse(@PathVariable String deptId) {
        return ResponseEntity.ok(safetyService.getCourse(deptId));
    }

    /** 모든 학과 목록 */
    @GetMapping("/courses")
    public ResponseEntity<Map<String, DeptCourseResponse>> listCourses() {
        return ResponseEntity.ok(SafetyContentCatalog.DEPARTMENTS);
    }

    /** 시도 기록 저장 (학생 퀴즈 제출 시) */
    @PostMapping("/attempts")
    public ResponseEntity<SafetyAttempt> recordAttempt(@RequestBody SafetyAttemptRequest req) {
        return ResponseEntity.ok(safetyService.recordAttempt(req));
    }

    /** 관리자 대시보드 KPI + 학과별 진척도 */
    @GetMapping("/admin/progress")
    public ResponseEntity<AdminProgressResponse> getAdminProgress() {
        return ResponseEntity.ok(safetyService.getAdminProgress());
    }

    /** 사고 유형 분포 (학기 누적) */
    @GetMapping("/admin/accidents/distribution")
    public ResponseEntity<List<AccidentDistributionItem>> getAccidentDistribution() {
        return ResponseEntity.ok(safetyService.getAccidentDistribution());
    }

    /** 최근 사고신고 사례 */
    @GetMapping("/admin/accidents/recent")
    public ResponseEntity<List<RecentIncident>> getRecentIncidents() {
        return ResponseEntity.ok(safetyService.getRecentIncidents());
    }

    /** 미이수자 — 안내 발송 대상 (마감 임박순) */
    @GetMapping("/admin/pending")
    public ResponseEntity<List<PendingStudent>> getPendingStudents() {
        return ResponseEntity.ok(safetyService.getPendingStudents());
    }
}
