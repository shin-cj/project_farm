package me.soldesk.springbootback.domain.marketprice.dto;

import lombok.Getter;
import lombok.Setter;
/** 조회일 기준 평균가격, 1~4주전 평균가격 추이 제공하는 API */
@Getter
@Setter
public class MarketPriceSearchRequest {

    /** 조사일자 */
    private String exmn_ymd;

    /** 구분코드 */
    private String se_cd;

    /** 구분명 */
    private String se_nm;

    /** 부류코드 */
    private String ctgry_cd;

    /** 부류명 */
    private String ctgry_nm;

    /** 품목코드 */
    private String item_cd;

    /** 품목명 */
    private String item_nm;

    /** 품종코드 */
    private String vrty_cd;

    /** 품종명 */
    private String vrty_nm;

    /** 등급코드 */
    private String grd_cd;

    /** 등급명 */
    private String grd_nm;

    /** 단위 */
    private String unit;

    /** 단위크기 */
    private String unit_sz;

    /** 조사일평균가격 */
    private String exmn_dd_avg_prc;

    /** 조사일kg환산평균가격 */
    private String exmn_dd_cnvs_avg_prc;

    /** 1주일전평균가격 */
    private String ww1_bfr_avg_prc;

    /** 1주일전kg환산평균가격 */
    private String ww1_bfr_cnvs_avg_prc;

    /** 2주일전평균가격 */
    private String ww2_bfr_avg_prc;

    /** 2주일전kg환산평균가격 */
    private String ww2_bfr_cnvs_avg_prc;

    /** 3주일전평균가격 */
    private String ww3_bfr_avg_prc;

    /** 3주일전kg환산평균가격 */
    private String ww3_bfr_cnvs_avg_prc;

    /** 4주일전평균가격 */
    private String ww4_bfr_avg_prc;

    /** 4주일전kg환산평균가격 */
    private String ww4_bfr_cnvs_avg_prc;
}
