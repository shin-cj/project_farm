package me.soldesk.springbootback.external.api01.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Api01Request {
    private String pageNo;
    private String numOfRows;
    private String returnType;
}
