package me.soldesk.springbootback.domain.marketprice.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDate;

/** 프론트엔드가 백엔드에 요청할 데이터를 담는 DTO(데이터 전달 객체)입니다. */
// 모든 필드의 getter 메서드를 Lombok이 자동 생성합니다.
@Getter
// 모든 필드의 setter 메서드를 Lombok이 자동 생성합니다.
@Setter
public class MarketPriceRequest {

    /** 카테고리 번호 */
    private Long categoryId;

    /** 농산물 품목명 */
    private String itemName;

    /** 시세 기준 단위 */
    private String unit;

    /** 시세 기준 시장명 */
    private String marketName;

    /** 최저가 */
    private Long lowestPrice;

    /** 평균가 */
    private Long averagePrice;

    /** 최고가 */
    private Long highestPrice;

    /** 시세 기준 날짜 */
    private LocalDate priceDate;

}
