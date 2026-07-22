package me.soldesk.springbootback.domain.farm.dto;

import lombok.Getter;

/**
 * 농장 이미지 업로드가 끝난 후
 * 프론트엔드에 이미지 주소를 전달하는 DTO입니다.
 */

@Getter
public class FarmImageUploadResponse {

    //브라우저에서 농장 이미지를 조회 할 주소
    private final String imageUrl;

    public FarmImageUploadResponse(String imageUrl){
        this.imageUrl = imageUrl;
    }
}
