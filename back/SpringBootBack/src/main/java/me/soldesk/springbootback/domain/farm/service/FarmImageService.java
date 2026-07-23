package me.soldesk.springbootback.domain.farm.service;

import me.soldesk.springbootback.domain.farm.dto.FarmImageUploadResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;

@Service
public class FarmImageService {

    private static final Logger log =
            LoggerFactory.getLogger(FarmImageService.class);

    private static final String FARM_IMAGE_URL_PREFIX =
            "/uploads/farm/";

    /** 한 이미지의 최대 크기는 5MB입니다. */
    private static final long MAX_FILE_SIZE =
            5L * 1024L * 1024L;

    /** 업로드할 수 있는 이미지 확장자입니다. */
    private static final Set<String> ALLOWED_EXTENSIONS =
            Set.of("jpg", "jpeg", "png", "webp");

    /** 실제 농장 이미지가 저장될 폴더입니다. */
    private final Path farmImageDirectory;

    public FarmImageService(
            @Value(
                    "${app.upload.farm-directory:"
                            + "../../uploads/farm}"
            )
            String farmImageDirectory
    ) {
        this.farmImageDirectory =
                Path.of(farmImageDirectory)
                        .toAbsolutePath()
                        .normalize();
    }

    public FarmImageUploadResponse uploadImage(
            MultipartFile image
    ) {
        validateImage(image);

        String extension =
                StringUtils.getFilenameExtension(
                        image.getOriginalFilename()
                );

        String storedFileName =
                UUID.randomUUID()
                        + "."
                        + extension.toLowerCase(Locale.ROOT);

        Path storedFilePath =
                farmImageDirectory.resolve(storedFileName);

        try {
            Files.createDirectories(farmImageDirectory);

            Files.copy(
                    image.getInputStream(),
                    storedFilePath,
                    StandardCopyOption.REPLACE_EXISTING
            );
        } catch (IOException exception) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "농장 이미지를 저장하지 못했습니다.",
                    exception
            );
        }

        String imageUrl =
                FARM_IMAGE_URL_PREFIX + storedFileName;

        return new FarmImageUploadResponse(imageUrl);
    }

    /** 우리 서버에 저장된 농장 이미지만 삭제합니다. 외부 이미지 주소는 건드리지 않습니다. */
    public void deleteStoredImage(String imageUrl) {
        if (imageUrl == null
                || !imageUrl.startsWith(FARM_IMAGE_URL_PREFIX)) {
            return;
        }

        String storedFileName =
                imageUrl.substring(FARM_IMAGE_URL_PREFIX.length());

        if (storedFileName.isBlank()) {
            return;
        }

        try {
            Path storedFilePath = farmImageDirectory
                    .resolve(storedFileName)
                    .normalize();

            if (!storedFilePath.startsWith(farmImageDirectory)) {
                log.warn("농장 이미지 폴더 밖의 파일 삭제 요청을 무시합니다: {}", imageUrl);
                return;
            }

            Files.deleteIfExists(storedFilePath);
        } catch (IOException | RuntimeException exception) {
            log.warn("사용하지 않는 농장 이미지를 삭제하지 못했습니다: {}", imageUrl, exception);
        }
    }

    private void validateImage(MultipartFile image) {
        if (image == null || image.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "업로드할 농장 이미지를 선택해주세요."
            );
        }

        if (image.getSize() > MAX_FILE_SIZE) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "농장 이미지는 5MB 이하만 업로드할 수 있습니다."
            );
        }

        String contentType = image.getContentType();

        if (contentType == null
                || !contentType.startsWith("image/")) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "이미지 파일만 업로드할 수 있습니다."
            );
        }

        String extension =
                StringUtils.getFilenameExtension(
                        image.getOriginalFilename()
                );

        if (extension == null
                || !ALLOWED_EXTENSIONS.contains(
                extension.toLowerCase(Locale.ROOT)
        )) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "JPG, JPEG, PNG, WEBP 이미지만 업로드할 수 있습니다."
            );
        }
    }
}
