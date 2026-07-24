package me.soldesk.springbootback;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class SpringBootBackApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpringBootBackApplication.class, args);
    }

}
