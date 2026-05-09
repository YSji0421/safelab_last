package com.adjuster.system.safety.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor
public class DeptCourseResponse {
    private String deptId;
    private String deptName;
    private String icon;
    private List<ScenarioMeta> scenarios;
    private List<EmergencyContact> emergencyContacts;

    @Getter
    @Builder
    @AllArgsConstructor
    public static class ScenarioMeta {
        private String id;
        private String title;
        private String summary;
        private String difficulty;
        private List<String> tags;
        private String relatedClause;
    }

    @Getter
    @Builder
    @AllArgsConstructor
    public static class EmergencyContact {
        private String label;
        private String phone;
        private String desc;
    }
}
