package me.soldesk.springbootback.service;

import lombok.RequiredArgsConstructor;
import me.soldesk.springbootback.external.api01.client.Api01Client;
import me.soldesk.springbootback.external.api01.dto.Api01Request;
import me.soldesk.springbootback.external.api01.dto.Api01Response;
import org.springframework.stereotype.Service;
import tools.jackson.databind.JsonNode;

@RequiredArgsConstructor
@Service
public class ApiService {

    private final Api01Client api01client;

    public Api01Response getData(String pageNo, String numOfRows, String returnType) {
        return api01client.getData(pageNo, numOfRows, returnType);
    }

    public Api01Response postData(Api01Request request) {
        return api01client.postData(request);
    }
}
