package me.soldesk.springbootback;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {
        "external.api01.api-key=test-api-key",
        "pexels.api-key=test-api-key",
        "openai.api-key=test-api-key"
})
class SpringBootBackApplicationTests {

    @Test
    void contextLoads() {
    }

}
