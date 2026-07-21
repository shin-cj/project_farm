package me.soldesk.springbootback.domain.qna.controller;

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

    // 1. QnA 등록 API
    @PostMapping("/create")
    public ResponseEntity<String> createQna(@RequestBody QnaRequest request) {
        qnaService.createQna(request);
        return ResponseEntity.ok("문의가 등록되었습니다.");
    }

    // 2. 상품별 QnA 목록 조회 API: GET /api/qna/{productId}
    @GetMapping("/{productId}")
    public ResponseEntity<List<QnaResponse>> getQnaList(@PathVariable Long productId) {
        return ResponseEntity.ok(qnaService.getQnasByProduct(productId));
    }

    // 💡 3. 전체 QnA 목록 조회 API (여기에 추가되었습니다!)
    @GetMapping("/all")
    public ResponseEntity<List<QnaResponse>> getAllQnaList() {
        return ResponseEntity.ok(qnaService.getAllQnas());
    }

    // 4. QnA 상세 조회 API: GET /api/qna/detail/{qnaId}
    @GetMapping("/detail/{qnaId}")
    public ResponseEntity<QnaResponse> getQnaDetail(@PathVariable Long qnaId) {
        return ResponseEntity.ok(qnaService.getQnaDetail(qnaId));
    }

    // 5. QnA 수정 API: PUT /api/qna/{qnaId}
    @PutMapping("/{qnaId}")
    public ResponseEntity<String> updateQna(@PathVariable Long qnaId, @RequestBody QnaRequest request) {
        qnaService.updateQna(qnaId, request);
        return ResponseEntity.ok("수정 완료");
    }

    // 6. 관리자 답변 등록/수정 API: PUT /api/qna/{qnaId}/answer
    @PutMapping("/{qnaId}/answer")
    public ResponseEntity<String> updateAnswer(@PathVariable Long qnaId, @RequestBody QnaAnswerRequest request) {
        qnaService.updateAnswer(qnaId, request);
        return ResponseEntity.ok("답변 등록 완료");
    }

    // 7. QnA 삭제 API: DELETE /api/qna/{qnaId}
    @DeleteMapping("/{qnaId}")
    public ResponseEntity<String> deleteQna(@PathVariable Long qnaId) {
        qnaService.deleteQna(qnaId);
        return ResponseEntity.ok("삭제 완료");
    }
}