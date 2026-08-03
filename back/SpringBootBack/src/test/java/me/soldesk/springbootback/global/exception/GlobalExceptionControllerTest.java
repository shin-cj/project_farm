package me.soldesk.springbootback.global.exception;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class GlobalExceptionControllerTest {

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .standaloneSetup(new ExceptionTestController())
                .setControllerAdvice(new GlobalExceptionController())
                .build();
    }

    @Test
    void responseStatusExceptionKeepsItsOriginalStatus() throws Exception {
        mockMvc.perform(get("/exception-test/not-found"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value("RESOURCE_NOT_FOUND"))
                .andExpect(jsonPath("$.message").value("상품을 찾을 수 없습니다."));
    }

    @Test
    void dataIntegrityViolationReturnsConflictWithoutSqlDetails() throws Exception {
        mockMvc.perform(get("/exception-test/conflict"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.error").value("DATA_CONFLICT"))
                .andExpect(jsonPath("$.message").value("이미 등록된 정보이거나 다른 데이터에서 사용 중인 정보입니다."));
    }

    @Test
    void illegalArgumentReturnsCorrectedBadRequestCode() throws Exception {
        mockMvc.perform(get("/exception-test/invalid"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("INVALID_INPUT_VALUE"));
    }

    @Test
    void unexpectedRuntimeExceptionHidesInternalMessage() throws Exception {
        mockMvc.perform(get("/exception-test/system"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.error").value("SYSTEM_ERROR"))
                .andExpect(jsonPath("$.message").value("서버에서 요청을 처리하는 중 오류가 발생했습니다."));
    }

    @RestController
    private static class ExceptionTestController {

        @GetMapping("/exception-test/not-found")
        void notFound() {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "상품을 찾을 수 없습니다.");
        }

        @GetMapping("/exception-test/conflict")
        void conflict() {
            throw new DataIntegrityViolationException("ORA-00001: SQL 내부 정보");
        }

        @GetMapping("/exception-test/invalid")
        void invalid() {
            throw new IllegalArgumentException("입력값이 올바르지 않습니다.");
        }

        @GetMapping("/exception-test/system")
        void system() {
            throw new NullPointerException("노출하면 안 되는 내부 정보");
        }
    }
}
