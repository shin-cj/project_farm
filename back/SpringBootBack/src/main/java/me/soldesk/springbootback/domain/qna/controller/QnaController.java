package me.soldesk.springbootback.domain.qna.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import me.soldesk.springbootback.domain.qna.dto.QnaAnswerRequest;
import me.soldesk.springbootback.domain.qna.dto.QnaRequest;
import me.soldesk.springbootback.domain.qna.dto.QnaResponse;
import me.soldesk.springbootback.domain.qna.service.QnaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/qna")
@RequiredArgsConstructor
public class QnaController {

    private final QnaService qnaService;

    // 0. 기본 /api/qna 경로로 GET 요청이 올 때 (Method Not Allowed 방지용)
    @GetMapping
    public ResponseEntity<List<QnaResponse>> getAllQnaListAlt(
            @RequestParam(required = false) Long viewerId) {
        return ResponseEntity.ok(qnaService.getAllQnas(viewerId));
    }

    // 1. QnA 등록 API (POST /api/qna)
    @PostMapping
    public ResponseEntity<String> createQna(@Valid @RequestBody QnaRequest request) {
        qnaService.createQna(request);
        return ResponseEntity.ok("문의가 등록되었습니다.");
    }

    // 2. 상품별 QnA 목록 조회 API: GET /api/qna/{productId}
    @GetMapping("/{productId}")
    public ResponseEntity<List<QnaResponse>> getQnaList(
            @PathVariable Long productId,
            @RequestParam(required = false) Long viewerId) {
        return ResponseEntity.ok(qnaService.getQnasByProduct(productId, viewerId));
    }

    // 3. 전체 QnA 목록 조회 API: GET /api/qna/all
    @GetMapping("/all")
    public ResponseEntity<List<QnaResponse>> getAllQnaList(
            @RequestParam(required = false) Long viewerId) {
        return ResponseEntity.ok(qnaService.getAllQnas(viewerId));
    }

    // 4. QnA 상세 조회 API: GET /api/qna/detail/{qnaId}
    @GetMapping("/detail/{qnaId}")
    public ResponseEntity<QnaResponse> getQnaDetail(
            @PathVariable Long qnaId,
            @RequestParam(required = false) Long viewerId) {
        return ResponseEntity.ok(qnaService.getQnaDetail(qnaId, viewerId));
    }

    // 5. QnA 수정 API: PUT /api/qna/{qnaId}
    @PutMapping("/{qnaId}")
    public ResponseEntity<String> updateQna(@PathVariable Long qnaId, @Valid @RequestBody QnaRequest request) {
        qnaService.updateQna(qnaId, request);
        return ResponseEntity.ok("수정 완료");
    }

    // 6. 관리자 답변 등록/수정 API: PUT /api/qna/{qnaId}/answer
    @PutMapping("/{qnaId}/answer")
    public ResponseEntity<String> updateAnswer(@PathVariable Long qnaId, @Valid @RequestBody QnaAnswerRequest request) {
        qnaService.updateAnswer(qnaId, request);
        return ResponseEntity.ok("답변 등록 완료");
    }

    // 7. QnA 삭제 API: DELETE /api/qna/{qnaId}
    @DeleteMapping("/{qnaId}")
    public ResponseEntity<String> deleteQna(@PathVariable Long qnaId,
                                            @RequestParam Long buyerId) {
        qnaService.deleteQna(qnaId, buyerId);
        return ResponseEntity.ok("삭제 완료");
    }
}
