package me.soldesk.springbootback.domain.marketprice.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import me.soldesk.springbootback.domain.marketprice.dto.MarketPriceSearchRequest;
import me.soldesk.springbootback.domain.marketprice.dto.MarketPriceSearchResponse;
import me.soldesk.springbootback.domain.marketprice.dto.MarketPriceSearchResult;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.File;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MarketPriceService {

    private final RestClient.Builder restClientBuilder;

    private final ObjectMapper objectMapper;

    private RestClient restClient;

    @PostConstruct
    public void init(){
        this.restClient = restClientBuilder.build();
    }

    @Value("${external.api01.api-key}")
    private String apikey;

    String filePath = "./src/main/java/me/soldesk/springbootback/domain/marketprice/api/";

    // 가격 추이 정보 조회(조회일 기준 1~4주전 평균 가격 제공)-7월 16일 기준 이전 데이터 모두 업데이트 됨, 업데이트 주기는 모르겠음
    // 최근 4주 가격 추이 미니 차트 제작용 - 소비자 제공
    public void fetchPriceSequel() {
        String url = "https://apis.data.go.kr/B552845/priceSequel/info?serviceKey=" + apikey
                    + "&pageNo=1&numOfRows=1000&cond%5Bexmn_ymd%3A%3AEQ%5D=20260630&returnType=JSON";
        String fileName = filePath+"api_priceSequel.json";

        downloadJsonApi(url, fileName);
    }

    // 최근일자 도,소매가격정보 조회(최신 데이터 반영하여 1일,1주일,1개월,1년 전 평균 가격 제공) - 특정 품목을 즐겨찾기 해둔 소비자에게 제공
    // 등락률 계산 후 판매자에게 제공
    public void fetchRecent(){
       String url = "https://apis.data.go.kr/B552845/recent/price?serviceKey=" + apikey +
               "&pageNo=1&numOfRows=1000&returnType=JSON";
       String fileName = filePath+"api_recent.json";

       downloadJsonApi(url, fileName);
    }

    // 일별 도,소매 가격정보 조회(JSON 저장 X)특정 품목의 '날짜별 전국 평균' 시세
    // 등락률 계산 후 판매자에게 제공
    public MarketPriceSearchResult searchPerDay(MarketPriceSearchRequest request) throws Exception{
        UriComponentsBuilder builder = UriComponentsBuilder.fromUriString("https://apis.data.go.kr/B552845/perDay/price")
                .queryParam("serviceKey", apikey)
                .queryParam("pageNo", request.getPageNo())
                .queryParam("numOfRows", request.getNumOfRows())
                .queryParam("cond%5Bexmn_ymd%3A%3ALTE%5D", request.getExmnYmdLte())//최신일자
                .queryParam("cond%5Bexmn_ymd%3A%3AGTE%5D", request.getExmnYmdGte())//과거일자
                .queryParam("cond%5Bctgry_cd%3A%3AEQ%5D", request.getCtgryCd())//부류코드
                .queryParam("cond%5Bitem_cd%3A%3AEQ%5D", request.getItemCd())//품목코드
                .queryParam("returnType", "JSON");

        //추가 검색어
        addQueryParam(builder,"cond%5Bse_cd%3A%3AEQ%5D", request.getSeCd());//구분코드
        addQueryParam(builder,"cond%5Bvrty_cd%3A%3AEQ%5D", request.getVrtyCd());//품종코드
        addQueryParam(builder,"cond%5Bgrd_cd%3A%3AEQ%5D", request.getGrdCd());//등급코드
        addQueryParam(builder,"cond%5Bsgg_cd%3A%3AEQ%5D", request.getSggCd());//시군구코드
        addQueryParam(builder,"cond%5Bmrkt_cd%3A%3AEQ%5D", request.getMrktCd());//시장코드

        return executeSearchAndConvert(builder);
    }

    //지역별 품목별 도,소매 가격정보 조회(JSON 저장 X)특정 지역의 '가게별' 시세 확인용 -소비자용(지역 내에서 더 싸게 구입하고 싶은 소비자)"내 주변 시세 검색"
    public MarketPriceSearchResult searchPerRegion(MarketPriceSearchRequest request) throws Exception{
        UriComponentsBuilder builder = UriComponentsBuilder.fromUriString("https://apis.data.go.kr/B552845/perRegion/price")
                .queryParam("serviceKey", apikey)
                .queryParam("pageNo", request.getPageNo())
                .queryParam("numOfRows", request.getNumOfRows())
                .queryParam("cond%5Bexmn_ymd%3A%3ALTE%5D", request.getExmnYmdLte())//최신일자
                .queryParam("cond%5Bexmn_ymd%3A%3AGTE%5D", request.getExmnYmdGte())//과거일자
                .queryParam("cond%5Bsgg_cd%3A%3AEQ%5D", request.getSggCd())//시군구코드
                .queryParam("returnType", "JSON");

        //추가 검색어
        addQueryParam(builder,"cond%5Bse_cd%3A%3AEQ%5D", request.getSeCd());//구분코드
        addQueryParam(builder,"cond%5Bctgry_cd%3A%3AEQ%5D", request.getCtgryCd());//부류코드
        addQueryParam(builder,"cond%5Bitem_cd%3A%3AEQ%5D", request.getItemCd());//품목코드
        addQueryParam(builder,"cond%5Bvrty_cd%3A%3AEQ%5D", request.getVrtyCd());//품종코드
        addQueryParam(builder,"cond%5Bgrd_cd%3A%3AEQ%5D", request.getGrdCd());//등급코드

        return executeSearchAndConvert(builder);
    }



    //===========================================
    //코드 길이 줄이기용 공용 메서드
    //===========================================

    private Object searchJsonApi(URI uri) {
            return restClient
                    .get()
                    .uri(uri)
                    .retrieve()
                    .body(Object.class);
    }

    private void downloadJsonApi(String url, String fileName) {
        try {

            URI uri = java.net.URI.create(url);

            Object response = restClient
                    .get()
                    .uri(uri)
                    .retrieve()
                    .body(Object.class);

            // 2. 파일 객체 생성 및 폴더 확인
            File file = new File(fileName);
            if (file.getParentFile() != null) {
                Files.createDirectories(Paths.get(file.getParentFile().getAbsolutePath()));
            }
            // 3. JSON 데이터를 파일로 직렬화하여 저장
            objectMapper.writeValue(file, response);
            System.out.println("JSON 파일 저장 성공: " + file.getAbsolutePath());

        } catch (Exception e) {
            throw new RuntimeException("공공데이터 JSON 파일을 로컬에 저장하는 중 오류가 발생했습니다. 에러 원인: " + e.getMessage(), e);
        }
    }

    private void checkCommonApiError(JsonNode root){

        if (root == null || root.isEmpty()) {
            throw new RuntimeException("공공데이터 API 서버로부터 응답을 받지 못했습니다. 잠시 후 다시 시도해 주세요.");
        }

        String resultCode = root.path("response").path("header").path("resultCode").asText();

        if (resultCode == null || resultCode.isEmpty() || "0".equals(resultCode) || "00".equals(resultCode)) {
            return;
        }
        switch (resultCode) {
            case "-1":  throw new RuntimeException("시스템 내부 오류가 발생하였습니다.");
            case "-3":  throw new RuntimeException("등록되지 않은 서비스입니다.");
            case "-5":  throw new RuntimeException("API 서버 오류가 발생하였습니다.");
            case "-10": throw new RuntimeException("트래픽 허용 횟수를 초과하였습니다. 내일 다시 시도해 주세요.");
            default:    throw new RuntimeException("알 수 없는 공공데이터 에러가 발생했습니다. (코드: " + resultCode + ")");
        }

    }

    private JsonNode checkNoContentError(JsonNode root) {
        int totalCount = root.path("response").path("body").path("totalCount").asInt();
        JsonNode itemArray = root.path("response").path("body").path("items").path("item");

        if (totalCount == 0 || itemArray.isEmpty()) {
            throw new RuntimeException("요청하신 조건에 부합하는 시세 데이터가 존재하지 않습니다.");
        }
        return itemArray;
    }

    private void addQueryParam(UriComponentsBuilder builder, String name, String value) {
        if (StringUtils.hasText(value)) {
            builder.queryParam(name, value);
        }
    }

    private MarketPriceSearchResult executeSearchAndConvert(UriComponentsBuilder builder) throws Exception {

        URI uri = builder.build(true).toUri();

        Object apiResponse = searchJsonApi(uri);
        JsonNode root = objectMapper.convertValue(apiResponse, JsonNode.class);

        checkCommonApiError(root);
        JsonNode itemNode = checkNoContentError(root);

        int totalCount = root.path("response").path("body").path("totalCount").asInt();

        List<MarketPriceSearchResponse> list = objectMapper.readValue(
                itemNode.toString(),
                new TypeReference<>() {}
        );

        return new MarketPriceSearchResult(totalCount, list);
    }


}
