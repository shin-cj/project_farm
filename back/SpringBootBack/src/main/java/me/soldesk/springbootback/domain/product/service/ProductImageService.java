package me.soldesk.springbootback.domain.product.service;

import me.soldesk.springbootback.domain.product.dto.ProductImageUploadResponse;
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
public class ProductImageService {

    /** 한 이미지의 최대 크기: 5MB */
    private static final long MAX_FILE_SIZE =
            5L * 1024L * 1024L;

    /** 업로드를 허용할 이미지 확장자 */
    private static final Set<String> ALLOWED_EXTENSIONS =
            Set.of("jpg", "jpeg", "png", "webp");

    /** 실제 상품 이미지가 저장될 폴더 */
    private final Path productImageDirectory;

    public ProductImageService(
            @Value(
                    "${app.upload.product-directory:"
                            + "../../uploads/product}"
            )
            String productImageDirectory
    ) {
        this.productImageDirectory =
                Path.of(productImageDirectory)
                        .toAbsolutePath()
                        .normalize();
    }

    public ProductImageUploadResponse uploadImage(
            MultipartFile image
    ) {
        validateImage(image);

        String originalFileName =
                image.getOriginalFilename();

        String extension =
                StringUtils.getFilenameExtension(
                        originalFileName
                );

        String storedFileName =
                UUID.randomUUID()
                        + "."
                        + extension.toLowerCase(Locale.ROOT);

        Path storedFilePath =
                productImageDirectory.resolve(storedFileName);

        try {
            Files.createDirectories(productImageDirectory);

            Files.copy(
                    image.getInputStream(),
                    storedFilePath,
                    StandardCopyOption.REPLACE_EXISTING
            );
        } catch (IOException exception) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "상품 이미지를 저장하지 못했습니다.",
                    exception
            );
        }

        String imageUrl =
                "/uploads/product/" + storedFileName;

        return new ProductImageUploadResponse(imageUrl);
    }

    private void validateImage(MultipartFile image) {

        if (image == null || image.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "업로드할 상품 이미지를 선택해주세요."
            );
        }

        if (image.getSize() > MAX_FILE_SIZE) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "상품 이미지는 5MB 이하만 업로드할 수 있습니다."
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