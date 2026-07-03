package me.soldesk.springbootback.controller;

import lombok.RequiredArgsConstructor;
import me.soldesk.springbootback.external.api01.dto.Api01Request;
import me.soldesk.springbootback.external.api01.dto.Api01Response;
import me.soldesk.springbootback.service.ApiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.JsonNode;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api01")
public class ApiController {

    private final ApiService apiService;

    @GetMapping
    public ResponseEntity<Api01Response> getData(
            @RequestParam(defaultValue = "1") String PageNo,
            @RequestParam(defaultValue = "10") String NumOfRows,
            @RequestParam(defaultValue = "JSON") String ReturnType
    ) {
        return ResponseEntity.ok(
                apiService.getData(PageNo, NumOfRows, ReturnType)
        );
    }

    @PostMapping
    public ResponseEntity<Api01Response> postData(
            @RequestBody Api01Request request
    ) {
        return ResponseEntity.ok(
                apiService.postData(request)
        );
    }
}
