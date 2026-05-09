package com.adjuster.system.help.dto;

import com.adjuster.system.enums.AccidentType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HelpRequestDto {
    private AccidentType accidentType;
    private String consultationText;
    private Long consultationId;
}
