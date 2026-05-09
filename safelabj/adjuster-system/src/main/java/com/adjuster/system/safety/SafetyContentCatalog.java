package com.adjuster.system.safety;

import com.adjuster.system.safety.dto.DeptCourseResponse;
import com.adjuster.system.safety.dto.DeptCourseResponse.EmergencyContact;
import com.adjuster.system.safety.dto.DeptCourseResponse.ScenarioMeta;

import java.util.List;
import java.util.Map;

/**
 * 학과별 안전교육 컨텐츠 정적 카탈로그.
 * 프론트의 src/data/departments.js 와 동일한 내용을 백엔드에서도 노출.
 * 시연용으로 정적 보관 — 추후 DB 이전 시 SafetyCourse 엔티티로 마이그레이션.
 */
public class SafetyContentCatalog {

    private SafetyContentCatalog() {}

    public static final Map<String, DeptCourseResponse> DEPARTMENTS = Map.of(
            "chem", DeptCourseResponse.builder()
                    .deptId("chem")
                    .deptName("화공환경과")
                    .icon("🧪")
                    .scenarios(List.of(
                            ScenarioMeta.builder()
                                    .id("chem-1").title("강산(황산) 피부 접촉 사고").difficulty("중")
                                    .summary("실험 중 황산이 손등에 튀었습니다. 60초 안의 행동을 시뮬레이션합니다.")
                                    .tags(List.of("화상", "응급세척"))
                                    .relatedClause("약관 제3조(보상하는 손해), 별표1 후유장해등급").build(),
                            ScenarioMeta.builder()
                                    .id("chem-2").title("유독가스 누출 — 후드 고장").difficulty("상")
                                    .summary("드래프트 챔버가 멈춘 채로 염소가스가 누출됩니다.")
                                    .tags(List.of("중독", "흡입"))
                                    .relatedClause("약관 제3조 ② 유독가스 흡입 중독 포함").build()
                    ))
                    .emergencyContacts(List.of(
                            new EmergencyContact("화공환경과 안전관리자", "032-870-2401", "화학물질 누출·중독 1차 대응"),
                            new EmergencyContact("화학실험실 책임교수", "032-870-2410", "실험 중 사고 보고"),
                            new EmergencyContact("인근 응급의료센터(인하대병원)", "032-890-2114", "화상·중독 응급실")
                    ))
                    .build(),
            "mech", DeptCourseResponse.builder()
                    .deptId("mech")
                    .deptName("기계과")
                    .icon("⚙️")
                    .scenarios(List.of(
                            ScenarioMeta.builder().id("mech-1").title("선반 작업 중 옷자락 끼임").difficulty("상")
                                    .summary("선반 회전 중 작업복 소매가 척에 빨려 들어가는 상황입니다.")
                                    .tags(List.of("끼임", "절단"))
                                    .relatedClause("약관 별표1 1~3급 후유장해(상지 절단)").build(),
                            ScenarioMeta.builder().id("mech-2").title("그라인더 파편 안구 비산").difficulty("중")
                                    .summary("보안경 미착용 상태로 그라인더 파편이 튀었습니다.")
                                    .tags(List.of("안구", "외상"))
                                    .relatedClause("약관 별표1 1~3급(시력 상실)").build()
                    ))
                    .emergencyContacts(List.of(
                            new EmergencyContact("기계과 안전관리자", "032-870-2501", "공작기계 사고 1차 대응"),
                            new EmergencyContact("기계실습실 책임교수", "032-870-2510", "실습 중 사고 보고"),
                            new EmergencyContact("인근 응급의료센터(인하대병원)", "032-890-2114", "외상·절단 응급실")
                    ))
                    .build(),
            "elec", DeptCourseResponse.builder()
                    .deptId("elec")
                    .deptName("전기정보과")
                    .icon("⚡")
                    .scenarios(List.of(
                            ScenarioMeta.builder().id("elec-1").title("배전반 작업 중 감전").difficulty("상")
                                    .summary("활선 차단 미확인 상태로 배전반 접촉 후 감전.")
                                    .tags(List.of("감전", "낙하"))
                                    .relatedClause("약관 제3조, 별표1 신경계통 장해").build(),
                            ScenarioMeta.builder().id("elec-2").title("실습실 분전반 합선 화재").difficulty("중")
                                    .summary("브레이커 트립 + 분전반 불꽃·연기 발생.")
                                    .tags(List.of("화재", "연기흡입"))
                                    .relatedClause("약관 제4장 중대한 화상치료 간접지원금").build()
                    ))
                    .emergencyContacts(List.of(
                            new EmergencyContact("전기정보과 안전관리자", "032-870-2601", "감전·전기화재 1차 대응"),
                            new EmergencyContact("전력실습실 책임교수", "032-870-2610", "실습 중 사고 보고"),
                            new EmergencyContact("한국전기안전공사", "1588-7500", "감전·정전 24시간")
                    ))
                    .build(),
            "comp", DeptCourseResponse.builder()
                    .deptId("comp")
                    .deptName("컴퓨터정보과")
                    .icon("💻")
                    .scenarios(List.of(
                            ScenarioMeta.builder().id("comp-1").title("서버실 UPS 발열 화재").difficulty("중")
                                    .summary("서버실 UPS 타는 냄새와 연기 발생.")
                                    .tags(List.of("화재", "연기흡입"))
                                    .relatedClause("약관 제4장 중대한 화상치료 간접지원금").build(),
                            ScenarioMeta.builder().id("comp-2").title("장시간 작업 후 의식 저하").difficulty("하")
                                    .summary("팀 프로젝트 밤샘 중 동료가 의식을 잃었습니다.")
                                    .tags(List.of("응급", "의식저하"))
                                    .relatedClause("약관 제3조 보상하는 손해(연구활동 중 사고)").build()
                    ))
                    .emergencyContacts(List.of(
                            new EmergencyContact("컴퓨터정보과 안전관리자", "032-870-2701", "서버실·실습실 사고 1차 대응"),
                            new EmergencyContact("실습실 책임교수", "032-870-2710", "실습 중 사고 보고"),
                            new EmergencyContact("인근 응급의료센터(인하대병원)", "032-890-2114", "응급의식저하·화상")
                    ))
                    .build()
    );
}
