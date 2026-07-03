package me.soldesk.springbootback.external.api01.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@JsonIgnoreProperties(ignoreUnknown = true)
public class Api01Response {

    // JSON 최상위의 response
    private ResponseData response;

    @Getter
    @Setter
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ResponseData {

        // 결과 코드와 메시지
        private Header header;

        // 실제 데이터
        private Body body;
    }

    @Getter
    @Setter
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Header {

        private String resultCode;
        private String resultMsg;
    }

    @Getter
    @Setter
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Body {

        private Integer numOfRows;
        private Integer pageNo;
        private Integer totalCount;
        private String dataType;
        private Items items;
    }

    @Getter
    @Setter
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Items {

        // item은 여러 개이므로 List
        private List<Item> item;
    }

    @Getter
    @Setter
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Item {

        // 조사 일자
        @JsonProperty("exmn_ymd")
        private String examinationDate;

        // 도매·소매 구분 코드
        @JsonProperty("se_cd")
        private String divisionCode;

        // 도매·소매 구분명
        @JsonProperty("se_nm")
        private String divisionName;

        // 부류 코드
        @JsonProperty("ctgry_cd")
        private String categoryCode;

        // 부류명
        @JsonProperty("ctgry_nm")
        private String categoryName;

        // 품목 코드
        @JsonProperty("item_cd")
        private String itemCode;

        // 품목명
        @JsonProperty("item_nm")
        private String itemName;

        // 품종 코드
        @JsonProperty("vrty_cd")
        private String varietyCode;

        // 품종명
        @JsonProperty("vrty_nm")
        private String varietyName;

        // 등급 코드
        @JsonProperty("grd_cd")
        private String gradeCode;

        // 등급명
        @JsonProperty("grd_nm")
        private String gradeName;

        // 단위
        private String unit;

        // 단위 크기
        @JsonProperty("unit_sz")
        private String unitSize;

        // 시장 코드
        @JsonProperty("mrkt_cd")
        private String marketCode;

        // 시장명
        @JsonProperty("mrkt_nm")
        private String marketName;

        // 조사 일자 가격
        @JsonProperty("exmn_dd_prc")
        private String price;

        // kg 환산 가격
        @JsonProperty("exmn_dd_cnvs_prc")
        private String convertedPrice;
    }
}