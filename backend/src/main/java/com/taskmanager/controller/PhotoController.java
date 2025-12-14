package com.taskmanager.controller;

import com.taskmanager.service.PhotoService;
import com.taskmanager.util.TokenExtractor;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("api/tasks/{taskId}/photo")
@RequiredArgsConstructor
public class PhotoController {

    private final PhotoService photoService;
    private final TokenExtractor tokenExtractor;

    @PostMapping
    public ResponseEntity<String> uploadPhoto(
            @PathVariable Long taskId,
            @RequestParam(value = "file", required = false) MultipartFile file,
            HttpServletRequest httpRequest) {

        System.out.println("File received: " + (file != null));
        System.out.println("File name: " + (file != null ? file.getOriginalFilename() : "null"));
        System.out.println("File size: " + (file != null ? file.getSize() : 0));

        if (file == null || file.isEmpty()) {
            String json = String.format(
                    "{\"error\":\"%s\",\"status\":400,\"timestamp\":\"%s\"}",
                    "Файл обязателен",
                    java.time.LocalDateTime.now()
            );

            return ResponseEntity
                    .status(400)
                    .contentType(org.springframework.http.MediaType.APPLICATION_JSON)
                    .body(json);
        }

        Long userId = tokenExtractor.getUserIdFromRequest(httpRequest);
        String photoUrl = photoService.uploadPhoto(taskId, file, userId);
        return ResponseEntity.ok(photoUrl);
    }

    @DeleteMapping
    public ResponseEntity<?> deletePhoto(
            @PathVariable Long taskId,
            HttpServletRequest httpRequest) {
        Long userId = tokenExtractor.getUserIdFromRequest(httpRequest);
        photoService.deletePhoto(taskId, userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<String> getPhotoUrl(@PathVariable Long taskId) {
        String photoUrl = photoService.getPhotoUrl(taskId);
        return ResponseEntity.ok(photoUrl);
    }
}