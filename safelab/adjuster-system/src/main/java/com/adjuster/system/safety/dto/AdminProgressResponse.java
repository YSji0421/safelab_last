package com.adjuster.system.safety.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor
public class AdminProgressResponse {
    private int totalStudents;
    private int enrolledStudents;
    private int completionRate;
    private int pendingStudents;
    private int recentIncidents7d;
    private int scenariosCompleted;
    private List<DeptProgress> deptProgress;

    @Getter
    @Builder
    @AllArgsConstructor
    public static class DeptProgress {
        private String id;
        private String name;
        private int total;
        private int completed;
        private int rate;
        private String risk;
    }
}
