package me.soldesk.springbootback;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.EnableAsync;

@EnableScheduling
@EnableAsync
@SpringBootApplication
@ComponentScan(basePackages = "me.soldesk.springbootback")
@EnableJpaRepositories(basePackages = "me.soldesk.springbootback")
public class SpringBootBackApplication {
    public static void main(String[] args) {
        SpringApplication.run(SpringBootBackApplication.class, args);
    }
}
