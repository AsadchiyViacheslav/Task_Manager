package com.taskmanager.service;

import com.taskmanager.exception.ApiException;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@Slf4j
public class FileService {

    @Value("${app.upload.path}")
    private String uploadPath;

    @Value("${app.upload.max-file-size}")
    private long maxFileSize;

    @PostConstruct
    public void init() {
        try {
            Path absolutePath = Paths.get(uploadPath)
                    .toAbsolutePath()
                    .normalize();

            uploadPath = absolutePath.toString();

            Files.createDirectories(absolutePath);

            log.info("Upload path initialized: {}", uploadPath);
        } catch (IOException e) {
            throw new RuntimeException("Не удалось инициализировать папку загрузки: " + uploadPath, e);
        }
    }

    public String saveFile(MultipartFile file) {
        try {
            if (file == null || file.isEmpty()) {
                throw new ApiException("Файл пустой");
            }

            if (file.getSize() > maxFileSize) {
                throw new ApiException("Размер файла превышает максимально допустимый размер");
            }

            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path uploadDir = Paths.get(uploadPath);

            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }

            Path filepath = uploadDir.resolve(filename);
            file.transferTo(filepath.toFile());

            return filename;
        } catch (IOException e) {
            log.error("Failed to save file", e);
            throw new ApiException("Не удалось сохранить файл: " + e.getMessage());
        }
    }

    public void deleteFile(String filename) {
        try {
            if (filename == null || filename.isEmpty()) {
                return;
            }

            Path filepath = Paths.get(uploadPath).resolve(filename);
            Files.deleteIfExists(filepath);
        } catch (IOException e) {
            log.error("Failed to delete file: {}", filename, e);
        }
    }

    public String getFileUrl(String filename) {
        if (filename == null || filename.isEmpty()) {
            return null;
        }
        return "/api/files/" + filename;
    }

    public File getFile(String filename) {
        Path filepath = Paths.get(uploadPath).resolve(filename);
        File file = filepath.toFile();

        if (!file.exists()) {
            throw new ApiException("Файл не найден");
        }

        return file;
    }
}