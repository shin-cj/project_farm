package me.soldesk.springbootback.domain.marketprice.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/** 조회일 기준 평균가격, 1~4주전 평균가격 추이 제공하는 API */
@Getter
@Setter
@ToString
@JsonIgnoreProperties(ignoreUnknown = true)
public class MarketPriceSearchResponse {

    /** 조사일자 */
    @JsonProperty("exmn_ymd")
    private String exmnYmd;

    /** 구분코드 */
    @JsonProperty("se_cd")
    private String seCd;

    /** 구분명 */
    @JsonProperty("se_nm")
    private String seNm;

    /** 부류코드 */
    @JsonProperty("ctgry_cd")
    private String ctgryCd;

    /** 부류명 */
    @JsonProperty("ctgry_nm")
    private String ctgryNm;

    /** 품목코드 */
    @JsonProperty("item_cd")
    private String itemCd;

    /** 품목명 */
    @JsonProperty("item_nm")
    private String itemNm;

    /** 품종코드 */
    @JsonProperty("vrty_cd")
    private String vrtyCd;

    /** 품종명 */
    @JsonProperty("vrty_nm")
    private String vrtyNm;

    /** 등급코드 */
    @JsonProperty("grd_cd")
    private String grdCd;

    /** 등급명 */
    @JsonProperty("grd_nm")
    private String grdNm;

    /** 시군구코드 */
    @JsonProperty("ssg_cd")
    private String ssgCd;

    /** 시군구명 */
    @JsonProperty("ssg_nm")
    private String ssgNm;

    /** 단위 */
    private String unit;

    /** 단위크기 */
    @JsonProperty("unit_sz")
    private String unitSz;

    /** 시장코드 */
    @JsonProperty("mrkt_cd")
    private String mrktCd;

    /** 시장명 */
    @JsonProperty("mrkt_nm")
    private String mrktNm;

    /** 조사일평균가격 */
    @JsonProperty("exmn_dd_avg_prc")
    private String exmnDdAvgPrc;

    /** 조사일가격 */
    @JsonProperty("exmn_dd_prc")
    private String exmnDdPrc;

    /** 조사일최저가격 */
    @JsonProperty("exmn_dd_min_prc")
    private String exmnDdMinPrc;

    /** 조사일최고가격 */
    @JsonProperty("exmn_dd_max_prc")
    private String exmnDdMaxPrc;

    /** 조사일kg환산평균가격 */
    @JsonProperty("exmn_dd_cnvs_avg_prc")
    private String exmnDdCnvsAvgPrc;

    /** 조사일kg환산가격 */
    @JsonProperty("exmn_dd_cnvs_prc")
    private String exmnDdCnvsPrc;

    /** 조사일kg환산최저가격 */
    @JsonProperty("exmn_dd_cnvs_min_prc")
    private String exmnDdCnvsMinPrc;

    /** 조사일kg환산최고가격 */
    @JsonProperty("exmn_dd_cnvs_max_prc")
    private String exmnDdCnvsMaxPrc;

    /** 1일전가격 */
    @JsonProperty("dd1_bfr_prc")
    private String dd1BfrPrc;

    /** 1일전kg환산가격 */
    @JsonProperty("dd1_bfr_cnvs_prc")
    private String dd1BfrCnvsPrc;

    /** 1주일전평균가격 */
    @JsonProperty("ww1_bfr_avg_prc")
    private String ww1BfrAvgPrc;

    /** 1주일전가격 */
    @JsonProperty("ww1_bfr_prc")
    private String ww1BfrPrc;

    /** 1주일전kg환산평균가격 */
    @JsonProperty("ww1_bfr_cnvs_avg_prc")
    private String ww1BfrCnvsAvgPrc;

    /** 1주일전kg환산가격 */
    @JsonProperty("ww1_bfr_cnvs_prc")
    private String ww1BfrCnvsPrc;

    /** 2주일전평균가격 */
    @JsonProperty("ww2_bfr_avg_prc")
    private String ww2BfrAvgPrc;

    /** 2주일전kg환산평균가격 */
    @JsonProperty("ww2_bfr_cnvs_avg_prc")
    private String ww2BfrCnvsAvgPrc;

    /** 3주일전평균가격 */
    @JsonProperty("ww3_bfr_avg_prc")
    private String ww3BfrAvgPrc;

    /** 3주일전kg환산평균가격 */
    @JsonProperty("ww3_bfr_cnvs_avg_prc")
    private String ww3BfrCnvsAvgPrc;

    /** 4주일전평균가격 */
    @JsonProperty("ww4_bfr_avg_prc")
    private String ww4BfrAvgPrc;

    /** 4주일전kg환산평균가격 */
    @JsonProperty("ww4_bfr_cnvs_avg_prc")
    private String ww4BfrCnvsAvgPrc;

    /** 1개월전가격 */
    @JsonProperty("mm1_bfr_prc")
    private String mm1BfrPrc;

    /** 1개월전kg환산가격 */
    @JsonProperty("mm1_bfr_cnvs_prc")
    private String mm1BfrCnvsPrc;

    /** 1년전가격 */
    @JsonProperty("yy1_bfr_prc")
    private String yy1BfrPrc;

    /** 1년전kg환산가격 */
    @JsonProperty("yy1_bfr_cnvs_prc")
    private String yy1BfrCnvsPrc;

    /** 1일전비교등락율 */
    @JsonProperty("dd1_bfr_cmpr_rafrt")
    private String dd1BfrCmprRafrt;

    /** 1주일전비교등락율 */
    @JsonProperty("ww1_bfr_cmpr_rafrt")
    private String ww1BfrCmprRafrt;

    /** 1개월전비교등락율 */
    @JsonProperty("mm1_bfr_cmpr_rafrt")
    private String mm1BfrCmprRafrt;

    /** 1년전비교등락율 */
    @JsonProperty("yy1_bfr_cmpr_rafrt")
    private String yy1BfrCmprRafrt;

    /** 원본등록일시 */
    @JsonProperty("orgnl_reg_dt")
    private String orgnlRegDt;
}
