package com.adjuster.system.safety.repository;

import com.adjuster.system.safety.entity.SafetyAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SafetyAttemptRepository extends JpaRepository<SafetyAttempt, Long> {

    List<SafetyAttempt> findByStudentNo(String studentNo);

    List<SafetyAttempt> findByDeptId(String deptId);

    @Query("SELECT a.deptId, COUNT(DISTINCT a.studentNo) FROM SafetyAttempt a WHERE a.passed = true GROUP BY a.deptId")
    List<Object[]> countPassedStudentsByDept();
}
