package me.soldesk.springbootback.global.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;

import java.nio.file.Path;

//CORS 충돌 방지 전역 설정
@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final Path uploadRootDirectory;

    public WebConfig(
            @Value("${app.upload.root-directory:../../uploads}")
            String uploadRootDirectory
    ) {
        this.uploadRootDirectory =
                Path.of(uploadRootDirectory)
                        .toAbsolutePath()
                        .normalize();
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // 모든 API 경로에 대해
                .allowedOrigins("http://localhost:5173") // 프론트엔드 주소 허용
                .allowedMethods("GET", "POST", "PUT", "PATCH","DELETE", "OPTIONS") // 모든 메서드 허용
                .allowedHeaders("*") // 모든 헤더 허용
                .allowCredentials(true); // 쿠키나 인증 정보 포함 허용
    }

    @Override
    public void addResourceHandlers(
            ResourceHandlerRegistry registry
    ) {
        registry
                .addResourceHandler("/uploads/**")
                .addResourceLocations(
                        uploadRootDirectory.toUri().toString()
                );
    }
}