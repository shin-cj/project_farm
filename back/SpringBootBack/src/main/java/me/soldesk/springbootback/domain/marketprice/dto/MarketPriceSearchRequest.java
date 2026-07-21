package me.soldesk.springbootback.domain.marketprice.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class MarketPriceSearchRequest {

    /** 최신일자 (LTE) */
    @JsonProperty("exmn_ymd_lte")
    private String exmnYmdLte;

    /** 과거일자 (GTE) */
    @JsonProperty("exmn_ymd_gte")
    private String exmnYmdGte;

    /** 부류코드 */
    @JsonProperty("ctgry_cd")
    private String ctgryCd;

    /** 품목코드 */
    @JsonProperty("item_cd")
    private String itemCd;

    private Integer pageNo = 1;
    private Integer numOfRows = 1000;

    // ==========================================
    //  추가될 수 있는 검색 조건들
    // ==========================================

    /** 구분코드 */
    @JsonProperty("se_cd")
    private String seCd;

    /** 품종코드 */
    @JsonProperty("vrty_cd")
    private String vrtyCd;

    /** 등급코드 */
    @JsonProperty("grd_cd")
    private String grdCd;

    /** 시군구코드 */
    @JsonProperty("sgg_cd")
    private String sggCd;

    /** 시장코드 */
    @JsonProperty("mrkt_cd")
    private String mrktCd;



}
