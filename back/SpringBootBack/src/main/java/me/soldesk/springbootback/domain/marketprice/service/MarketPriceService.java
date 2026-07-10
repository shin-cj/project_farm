package me.soldesk.springbootback.domain.marketprice.service;

import lombok.RequiredArgsConstructor;
import me.soldesk.springbootback.domain.marketprice.dto.MarketPriceSearchRequest;
import me.soldesk.springbootback.domain.marketprice.repository.MarketPriceRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.io.File;
import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MarketPriceService {

    private final MarketPriceRepository marketPriceRepository;
    private final RestTemplate restTemplate;

    public void fetchPrices{

        String url = "https://apis.data.go.kr/B552845/priceSequel/info?serviceKey=${API01_KEY}&pageNo=1&numOfRows=1000&cond%5Bexmn_ymd%3A%3AEQ%5D=20260630&returnType=JSON";
        String filePath = "../api/api_priceSequel.json";

        ResponseEntity<Object> response = restTemplate.getForObject(url, Object.class);

        try {
            // 2. 파일 객체 생성 및 폴더 확인
            File file = new File(filePath);
            file.getParentFile().mkdirs(); // 상위 디렉토리가 없다면 생성

            // 3. JSON 데이터를 파일로 직렬화하여 저장
            MarketPriceRepository.writeValue(file, response.getBody());
            System.out.println("JSON 파일 저장 성공: " + file.getAbsolutePath());

        } catch (IOException e) {
            e.printStackTrace();
        }
    }


}
