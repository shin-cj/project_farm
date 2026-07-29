package me.soldesk.springbootback.domain.marketprice.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import me.soldesk.springbootback.domain.marketprice.dto.*;
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
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.text.SimpleDateFormat;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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

    private MarketPriceSearchResponse searchRecentPrice(MarketPriceSearchRequest request) throws Exception {

        UriComponentsBuilder builder = UriComponentsBuilder.fromUriString("https://apis.data.go.kr/B552845/recent/price")
                .queryParam("serviceKey",apikey)
                .queryParam("pageNo",1)
                .queryParam("numOfRows",1)
                .queryParam("returnType", "JSON");

        addQueryParam(builder,"cond%5Bse_cd%3A%3AEQ%5D",request.getSeCd());
        addQueryParam(builder, "cond%5Bctgry_cd%3A%3AEQ%5D", request.getCtgryCd());
        addQueryParam(builder, "cond%5Bitem_cd%3A%3AEQ%5D", request.getItemCd());
        addQueryParam(builder, "cond%5Bvrty_cd%3A%3AEQ%5D", request.getVrtyCd());
        addQueryParam(builder, "cond%5Bgrd_cd%3A%3AEQ%5D", request.getGrdCd());

        URI uri = builder.build(true).toUri();

        Object apiResponse = searchJsonApi(uri);
        JsonNode root = objectMapper.convertValue(apiResponse,JsonNode.class);

        checkCommonApiError(root);

        JsonNode itemNode = root.path("response").path("body").path("items").path("item");

        if(itemNode.isEmpty()){
            throw new RuntimeException("최근 시세 데이터가 없습니다.");
        }

        List<MarketPriceSearchResponse> list = objectMapper.readValue(
                itemNode.toString(),new TypeReference<>() {}
        );

        return list.get(0);

    }

    private Long parsePrice(String price){
        if(!StringUtils.hasText(price)){
            return 0L;
        }

        try {
            return Long.parseLong(price.replace(",","").trim());
        }catch (NumberFormatException e){
            return 0L;
        }
    }

    private String calculateChangeRate(Long currentPrice, Long previousPrice) {
        if (currentPrice == null || previousPrice == null || previousPrice <= 0) {
            return "0";
        }

        double rate = ((double) (currentPrice - previousPrice) / previousPrice) * 100;
        return String.valueOf(Math.round(rate * 100) / 100.0);
    }

    private String defaultChangeRate(String apiChangeRate, Long currentPrice, Long previousPrice) {
        if (StringUtils.hasText(apiChangeRate)) {
            return apiChangeRate;
        }

        return calculateChangeRate(currentPrice, previousPrice);
    }

    private Double calculateChangeRateNumber(Long currentPrice, Long previousPrice) {
        if (currentPrice == null || previousPrice == null || previousPrice <= 0) {
            return 0.0;
        }

        double rate = ((double) (currentPrice - previousPrice) / previousPrice) * 100;
        return Math.round(rate * 100) / 100.0;
    }

    private List<MarketPriceSearchResponse> readRecentPriceFile() throws Exception {
        File file = new File(filePath + "api_priceSequel.json");

        if (!file.exists()) {
            fetchPriceSequel();
        }

        JsonNode root = objectMapper.readTree(file);
        JsonNode itemNode = root.path("response").path("body").path("items").path("item");

        if (itemNode.isEmpty()) {
            throw new RuntimeException("최근 시세 랭킹 데이터가 없습니다.");
        }

        return objectMapper.readValue(
                itemNode.toString(),
                new TypeReference<>() {}
        );
    }

    private List<MarketPriceSearchResponse> readTodayPriceFile() throws Exception {
        File file = new File(filePath + "api_recent.json");

        if (!file.exists()) {
            fetchRecent();
        }

        JsonNode root = objectMapper.readTree(file);
        JsonNode itemNode = root.path("response").path("body").path("items").path("item");

        if (itemNode.isEmpty()) {
            throw new RuntimeException("오늘 시세 데이터가 없습니다.");
        }

        return objectMapper.readValue(
                itemNode.toString(),
                new TypeReference<>() {}
        );
    }

    private BuyerMainRankingItemResponse toRankingItem(MarketPriceSearchResponse item, Long previousPrice) {
        Long currentPrice = parsePrice(item.getExmnDdPrc());

        Long changeAmount = currentPrice - previousPrice;
        Double changeRate = calculateChangeRateNumber(currentPrice, previousPrice);
        boolean weightUnit = isWeightUnit(item.getUnit());
        String displayUnit = formatMarketUnit(item.getUnitSz(), item.getUnit());
        Long comparisonPrice = weightUnit
                ? parsePrice(item.getExmnDdCnvsPrc())
                : currentPrice;

        return new BuyerMainRankingItemResponse(
                item.getItemCd(),
                item.getItemNm(),
                item.getVrtyNm(),
                item.getCtgryNm(),
                item.getSeNm(),
                displayUnit,
                currentPrice,
                previousPrice,
                changeAmount,
                changeRate,
                weightUnit ? "kg" : displayUnit,
                comparisonPrice
        );
    }

    private boolean isWeightUnit(String unit) {
        if (!StringUtils.hasText(unit)) {
            return false;
        }

        String normalizedUnit = unit.trim().toLowerCase();
        return "g".equals(normalizedUnit)
                || "kg".equals(normalizedUnit)
                || normalizedUnit.startsWith("kg(");
    }

    private String formatMarketUnit(String unitSize, String unit) {
        String normalizedSize = StringUtils.hasText(unitSize)
                ? unitSize.trim()
                : "";
        String normalizedUnit = StringUtils.hasText(unit)
                ? unit.trim()
                : "";

        if (!StringUtils.hasText(normalizedSize)) {
            return StringUtils.hasText(normalizedUnit)
                    ? normalizedUnit
                    : "단위";
        }

        return normalizedSize + normalizedUnit;
    }

    private List<BuyerMainRankingItemResponse> createTopRanking(
            List<MarketPriceSearchResponse> recentList,
            String period,
            boolean isUp,
            int limit
    ) {
        return recentList.stream()
                .map(item -> {
                    Long previousPrice = switch (period) {
                        case "DAY" -> parsePrice(item.getDd1BfrPrc());
                        case "WEEK" -> parsePrice(item.getWw1BfrPrc());
                        case "MONTH" -> parsePrice(item.getMm1BfrPrc());
                        default -> 0L;
                    };

                    return toRankingItem(item, previousPrice);
                })
                .filter(item -> item.getCurrentPrice() > 0 && item.getPreviousPrice() > 0)
                .filter(item -> isUp ? item.getChangeRate() > 0 : item.getChangeRate() < 0)
                .collect(Collectors.toMap(
                        item -> item.getItemName() + "|"
                                + item.getVarietyName() + "|"
                                + item.getSaleTypeName() + "|"
                                + item.getUnit(),
                        item -> item,
                        (first, second) -> Math.abs(first.getChangeRate()) >= Math.abs(second.getChangeRate())
                                ? first
                                : second
                ))
                .values()
                .stream()
                .sorted(isUp
                        ? Comparator.comparing(BuyerMainRankingItemResponse::getChangeRate).reversed()
                        : Comparator.comparing(BuyerMainRankingItemResponse::getChangeRate))
                .limit(limit)
                .toList();
    }

    private List<MarketPriceSearchResponse> filterRecentList(
            List<MarketPriceSearchResponse> recentList,
            MarketPriceSearchRequest request
    ) {
        return recentList.stream()
                .filter(item -> !"500".equals(item.getCtgryCd()))
                .filter(item -> !"600".equals(item.getCtgryCd()))
                .filter(item -> !StringUtils.hasText(request.getSeCd())
                        || request.getSeCd().equals(item.getSeCd()))
                .filter(item -> !StringUtils.hasText(request.getCtgryCd())
                        || request.getCtgryCd().equals(item.getCtgryCd()))
                .filter(item -> !StringUtils.hasText(request.getItemCd())
                        || request.getItemCd().equals(item.getItemCd()))
                .toList();
    }

    private LocalDate parseApiDate(String dateText) {
        if (!StringUtils.hasText(dateText)) {
            return LocalDate.now();
        }

        try {
            return LocalDate.parse(dateText, DateTimeFormatter.ofPattern("yyyyMMdd"));
        } catch (Exception e) {
            return LocalDate.now();
        }
    }

    @Value("${external.api01.api-key}")
    private String apikey;

    String filePath = "./src/main/java/me/soldesk/springbootback/domain/marketprice/api/";

    public BuyerMainRankingResponse getBuyerMainRanking(MarketPriceSearchRequest request) throws Exception {
        List<MarketPriceSearchResponse> recentList = filterRecentList(readTodayPriceFile(), request);
        int rankingLimit = request.getLimit() == null || request.getLimit() <= 0 ? 5 : request.getLimit();

        String baseDate = recentList.stream()
                .map(MarketPriceSearchResponse::getExmnYmd)
                .filter(StringUtils::hasText)
                .max(String::compareTo)
                .orElse("");

        return new BuyerMainRankingResponse(
                baseDate,
                createTopRanking(recentList, "DAY", true, rankingLimit),
                createTopRanking(recentList, "DAY", false, rankingLimit),
                createTopRanking(recentList, "WEEK", true, rankingLimit),
                createTopRanking(recentList, "WEEK", false, rankingLimit),
                createTopRanking(recentList, "MONTH", true, rankingLimit),
                createTopRanking(recentList, "MONTH", false, rankingLimit)
        );
    }

    public List<BuyerMainRankingItemResponse> getBuyerMainTodayPrices(MarketPriceSearchRequest request) throws Exception {
        List<MarketPriceSearchResponse> recentList = filterRecentList(readTodayPriceFile(), request);
        int resultLimit = request.getLimit() == null || request.getLimit() <= 0 ? 200 : request.getLimit();

        return recentList.stream()
                .map(item -> toRankingItem(item, parsePrice(item.getDd1BfrPrc())))
                .filter(item -> item.getCurrentPrice() > 0)
                .collect(Collectors.toMap(
                        item -> item.getItemName() + "|"
                                + item.getVarietyName() + "|"
                                + item.getSaleTypeName() + "|"
                                + item.getUnit(),
                        item -> item,
                        (first, second) -> first
                ))
                .values()
                .stream()
                .sorted(Comparator.comparing(BuyerMainRankingItemResponse::getItemName))
                .limit(resultLimit)
                .toList();
    }

    // 가격 추이 정보 조회(조회일 기준 1~4주전 평균 가격 제공)-7월 16일 기준 이전 데이터 모두 업데이트 됨, 업데이트 주기는 모르겠음
    // 최근 4주 가격 추이 미니 차트 제작용 - 소비자 제공
    public void fetchPriceSequel() {
        String fileName = filePath + "api_priceSequel.json";
        for (int i =0; i<=30; i++) {
            String day = today(i);

            String url = "https://apis.data.go.kr/B552845/priceSequel/info?serviceKey=" + apikey
                + "&pageNo=1&numOfRows=1000&cond%5Bexmn_ymd%3A%3AEQ%5D=" + day + "&returnType=JSON";
            try {
                URI uri = java.net.URI.create(url);
                Object response = searchJsonApi(uri);
                JsonNode data = objectMapper.convertValue(response, JsonNode.class);
                checkCommonApiError(data);

                int totalCount = data.path("response").path("body").path("totalCount").asInt();

                if (totalCount > 0) {
                    downloadJsonApi(response, fileName);
                    return;
                }
            }catch (Exception e){
                System.err.println(day+"날짜 조회 중 오류 발생 : " +e.getMessage());
            }
        }
        System.out.println("최근 30일 간 조회할 수 있는 시세 데이터가 없습니다.");
    }

    public MarketPriceSearchResponse getPriceSequelJson(String keyword, String saleType){
        String fileName = filePath + "api_priceSequel.json";
        File file = new File(fileName);

        if(!file.exists()){
            throw new RuntimeException("저장된 시세 파일이 존재하지 않습니다. 업데이트를 먼저 해주세요.");
        }
        try {
            JsonNode data = objectMapper.readValue(file, JsonNode.class);
            JsonNode itemsNode = data.path("response")
                    .path("body")
                    .path("items")
                    .path("item");

            String targetKeyword = keyword.trim();
            String targetSaleType = "WHOLESALE".equalsIgnoreCase(saleType) ? "중도매" : "소매";
            String targetGrd = "상품";

            JsonNode matchedNode = null;

            for (JsonNode item : itemsNode) {
                String itemNm = item.path("item_nm").asText("");
                String seNm = item.path("se_nm").asText("");
                String itemGrd = item.path("grd_nm").asText("");

                // 💡 검색어 포함 여부 && 소도매 일치 && 상품등급 일치 검사
                if (itemNm.contains(targetKeyword) && seNm.equals(targetSaleType) && itemGrd.equals(targetGrd)) {
                    matchedNode = item;
                    break; // 조건을 만족하는 대표 항목을 찾았으므로 탈출
                }
            }

            // 만약 '상품' 등급으로 찾았는데 없으면, 등급 조건만 빼고 첫 번째 항목으로 재시도 (안전장치)
            if (matchedNode == null && !targetKeyword.isEmpty()) {
                for (JsonNode item : itemsNode) {
                    if (item.path("item_nm").asText("").contains(targetKeyword)) {
                        matchedNode = item;
                        break;
                    }
                }
            }

            // 검색 결과가 없는 경우
            if (matchedNode == null) {
                return null; // 또는 empty DTO 반환
            }

            // 4. 찾은 JsonNode에서 값들을 추출하여 DTO 객체로 변환!
            return MarketPriceSearchResponse.builder()
                    .itemNm(matchedNode.path("item_nm").asText())
                    .seNm(matchedNode.path("se_nm").asText())
                    .grdNm(matchedNode.path("grd_nm").asText())
                    .unit(matchedNode.path("unit_sz").asText() + matchedNode.path("unit").asText())
                    .exmnDdCnvsAvgPrc(matchedNode.path("exmn_dd_cnvs_avg_prc").asText("0")) // 오늘(이번주) 가격
                    .ww1BfrCnvsAvgPrc(matchedNode.path("ww1_bfr_cnvs_avg_prc").asText("0"))  // 1주 전
                    .ww2BfrCnvsAvgPrc(matchedNode.path("ww2_bfr_cnvs_avg_prc").asText("0"))  // 2주 전
                    .ww3BfrCnvsAvgPrc(matchedNode.path("ww3_bfr_cnvs_avg_prc").asText("0"))  // 3주 전
                    .ww4BfrCnvsAvgPrc(matchedNode.path("ww4_bfr_cnvs_avg_prc").asText("0"))  // 4주 전
                    .build();

        }catch (Exception e){
            throw  new RuntimeException("데이터 파일을 읽는 중 오류가 발생했습니다 : "+ e.getMessage(), e);
        }
    }

    public String today(int beforeDay){
        LocalDate currentDate = LocalDate.now();
        LocalDate day = currentDate.minusDays(beforeDay);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");
        return day.format(formatter);
    }

    // 최근일자 도,소매가격정보 조회(최신 데이터 반영하여 1일,1주일,1개월,1년 전 평균 가격 제공) - 특정 품목을 즐겨찾기 해둔 소비자에게 제공
    // 등락률 계산 후 판매자에게 제공
    public void fetchRecent(){
       String url = "https://apis.data.go.kr/B552845/recent/price?serviceKey=" + apikey +
               "&pageNo=1&numOfRows=1000&returnType=JSON";
       String fileName = filePath+"api_recent.json";

       URI uri = java.net.URI.create(url);
       Object response = searchJsonApi(uri);
       JsonNode data = objectMapper.convertValue(response, JsonNode.class);
       checkCommonApiError(data);

       downloadJsonApi(response, fileName);
    }

    public Map<String, Object> getAutoUpdateStatus() {
        Map<String, Object> statusMap = new HashMap<>();

        // 스케줄러가 저장하는 대표 파일 확인
        File file = new File(filePath + "api_priceSequel.json");

        if (file.exists()) {
            long lastModified = file.lastModified(); // 파일 수정 시간 (ms)
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

            statusMap.put("isUpdated", true);
            statusMap.put("lastUpdatedTime", sdf.format(lastModified));
            statusMap.put("fileName", file.getName());
        } else {
            statusMap.put("isUpdated", false);
            statusMap.put("lastUpdatedTime", "자동 업데이트 기록 없음");
        }

        return statusMap;
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
        //addQueryParam(builder,"cond%5Bgrd_cd%3A%3AEQ%5D", request.getGrdCd());//등급코드

        return sameLabel(builder,request);
    }



    //===========================================
    //코드 길이 줄이기용 공용 메서드
    //===========================================

    // 평균과 등락률 계산하는 메서드
    private List<DailyAvgPriceDto> avgForDate(List<MarketPriceSearchResponse> list){
        //조건에 맞는 당일 평균 금액
        Map<String, Double> dateAvgMap = list.stream()
                .collect(Collectors.groupingBy(
                        MarketPriceSearchResponse::getExmnYmd,
                        Collectors.averagingDouble(item -> {
                            String cnvsAvgPrc = item.getExmnDdCnvsAvgPrc();
                            String avgPrc = item.getExmnDdAvgPrc();
                            String cnvsPrc = item.getExmnDdCnvsPrc();
                            String ddPrc = item.getExmnDdPrc();

                            String priceStr = StringUtils.hasText(cnvsAvgPrc)
                                    ? cnvsAvgPrc
                                    : StringUtils.hasText(avgPrc)
                                    ? avgPrc
                                    : StringUtils.hasText(cnvsPrc)
                                    ? cnvsPrc
                                    : ddPrc;
                            if (!StringUtils.hasText(priceStr)) {
                                return 0.0; // 가격 데이터가 없는 경우 0 처리
                            }

                            try {
                                return Double.parseDouble(priceStr.replace(",", "").trim());
                            } catch (NumberFormatException e) {
                                return 0.0;
                            }
                        })
                ));
        //오름차순 정렬
        List<String> sortedDates = dateAvgMap.keySet().stream()
                .sorted()
                .toList();

        //빈 리스트 객체
        List<DailyAvgPriceDto> dailyList = new ArrayList<>();

        // 각 날짜마다 평균값 계산 후 등락률 계산하는 반복문
        for(int i = 0; i<sortedDates.size(); i++){
            String todayDate = sortedDates.get(i);

            long todayAvg = Math.round(dateAvgMap.get(todayDate));

            Long prevAvg = null;
            double changeRate = 0.0;

            if(i>0){
                String prevDate = sortedDates.get(i-1);

                prevAvg = Math.round(dateAvgMap.get(prevDate));

                if(prevAvg > 0){
                    double rate = ((double) (todayAvg - prevAvg) / prevAvg) * 100;

                    changeRate = Math.round(rate * 100) / 100.0;
                }
            }

            DailyAvgPriceDto dailyAvgPriceDto = DailyAvgPriceDto.builder()
                    .date(todayDate)
                    .todayAvgPrice(todayAvg)
                    .prevAvgPrice(prevAvg)
                    .changeRate(changeRate)
                    .build();

            dailyList.add(dailyAvgPriceDto);

        }
        return dailyList;
    }

    private Object searchJsonApi(URI uri) {
            return restClient
                    .get()
                    .uri(uri)
                    .retrieve()
                    .body(Object.class);
    }

    private void downloadJsonApi(Object response, String fileName) {
        try {

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


    private void addQueryParam(UriComponentsBuilder builder, String name, String value) {
        if (StringUtils.hasText(value)) {
            builder.queryParam(name, value);
        }
    }

    private MarketPriceSearchResult executeSearchAndConvert(UriComponentsBuilder builder) throws Exception {

        List<MarketPriceSearchResponse> allList = new ArrayList<>();

        int pageNo = 1;
        int totalCount = 0;

        while (true) {
            builder.replaceQueryParam("pageNo", pageNo);
            URI uri = builder.build(true).toUri();

            Object apiResponse = searchJsonApi(uri);
            JsonNode root = objectMapper.convertValue(apiResponse, JsonNode.class);

            checkCommonApiError(root);

            if(pageNo == 1){
                totalCount = root.path("response").path("body").path("totalCount").asInt();
            }

            JsonNode itemNode = root.path("response").path("body").path("items").path("item");

            if(itemNode.isEmpty()){
                break;
            }

            List<MarketPriceSearchResponse> list = objectMapper.readValue(
                    itemNode.toString(),
                    new TypeReference<>() {}
            );

            allList.addAll(list);

            if(allList.size() >= totalCount || list.isEmpty()){
                break;
            }

            pageNo++;

        }
        if (allList.isEmpty()) {
            throw new RuntimeException("요청하신 조건에 부합하는 시세 데이터가 존재하지 않습니다.");
        }

        List<DailyAvgPriceDto> dailyList = avgForDate(allList);

        return new MarketPriceSearchResult(totalCount, dailyList, allList);
    }

    private MarketPriceSearchResult sameLabel(UriComponentsBuilder builder, MarketPriceSearchRequest request) throws Exception {
        String grdCd = request.getGrdCd();

        if (grdCd != null && grdCd.contains("-")) {
            // "13-16"을 ["13", "16"]으로 쪼갭니다.
            String[] codes = grdCd.split("-");

            // 13번 데이터 먼저 호출
            builder.queryParam("cond%5Bgrd_cd%3A%3AEQ%5D", codes[0]);
            MarketPriceSearchResult result1 = executeSearchAndConvert(builder);

            // 16번 데이터 호출을 위해 기존 grd_cd 파라미터를 교체해서 다시 호출
            builder.replaceQueryParam("cond%5Bgrd_cd%3A%3AEQ%5D", codes[1]);
            MarketPriceSearchResult result2 = executeSearchAndConvert(builder);

            // 두 결과를 하나로 예쁘게 합치기
            int totalCount = result1.getTotalCount() + result2.getTotalCount();
            List<MarketPriceSearchResponse> combinedList = new ArrayList<>();
            combinedList.addAll(result1.getList());
            combinedList.addAll(result2.getList());

            List<DailyAvgPriceDto> combinedDailyList = avgForDate(combinedList);

            return new MarketPriceSearchResult(totalCount, combinedDailyList, combinedList);
        } else {
            if (StringUtils.hasText(grdCd)) {
                // 하이픈이 없는 일반 등급("04" 등)이나 "전체"일 때는 원래대로 한 번만 호출
                addQueryParam(builder, "cond%5Bgrd_cd%3A%3AEQ%5D", grdCd);
            }
            return executeSearchAndConvert(builder);
        }
    }

    public BuyerMainPriceTrendResponse getBuyerMainMonthTrend(MarketPriceSearchRequest request) throws Exception{

        if(request.getPageNo() == null){
            request.setPageNo(1);
        }

        if(request.getNumOfRows() == null){
            request.setNumOfRows(1000);
        }

        // 등락률용: 공공데이터 recent API
        MarketPriceSearchResponse recentData = searchRecentPrice(request);

        LocalDate latestDate = parseApiDate(recentData.getExmnYmd());
        LocalDate oneMonthAgo = latestDate.minusDays(29);

        request.setExmnYmdLte(latestDate.format(DateTimeFormatter.ofPattern("yyyyMMdd")));
        request.setExmnYmdGte(oneMonthAgo.format(DateTimeFormatter.ofPattern("yyyyMMdd")));

        // 그래프용: 지역이 선택되면 지역별 API, 없으면 전국 일별 API를 사용합니다.
        MarketPriceSearchResult dayResult = StringUtils.hasText(request.getSggCd())
                ? searchPerRegion(request)
                : searchPerDay(request);

        Long currentPrice = parsePrice(recentData.getExmnDdAvgPrc());
        Long oneMonthAgoPrice = parsePrice(recentData.getMm1BfrPrc());

        List<DailyAvgPriceDto> dailyAvgList = dayResult.getDailyAvgList();

        if (!dailyAvgList.isEmpty()) {
            DailyAvgPriceDto firstDay = dailyAvgList.get(0);
            DailyAvgPriceDto lastDay = dailyAvgList.get(dailyAvgList.size() - 1);

            if (StringUtils.hasText(request.getSggCd()) || currentPrice == 0L) {
                currentPrice = lastDay.getTodayAvgPrice();
            }

            if (StringUtils.hasText(request.getSggCd()) || oneMonthAgoPrice == 0L) {
                oneMonthAgoPrice = firstDay.getTodayAvgPrice();
            }
        }

        return new BuyerMainPriceTrendResponse(
                recentData.getItemNm(),
                recentData.getUnit(),
                currentPrice,
                oneMonthAgoPrice,
                defaultChangeRate(recentData.getDd1BfrCmprRafrt(), currentPrice, oneMonthAgoPrice),
                defaultChangeRate(recentData.getWw1BfrCmprRafrt(), currentPrice, oneMonthAgoPrice),
                defaultChangeRate(recentData.getMm1BfrCmprRafrt(), currentPrice, oneMonthAgoPrice),
                defaultChangeRate(recentData.getYy1BfrCmprRafrt(), currentPrice, oneMonthAgoPrice),
                dailyAvgList
        );

    }

}
