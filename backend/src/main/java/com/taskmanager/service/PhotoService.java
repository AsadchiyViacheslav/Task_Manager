package com.taskmanager.service;

import com.taskmanager.exception.*;
import com.taskmanager.model.Photo;
import com.taskmanager.model.Task;
import com.taskmanager.repository.PhotoRepository;
import com.taskmanager.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PhotoService {

    private final PhotoRepository photoRepository;
    private final TaskRepository taskRepository;
    private final FileService fileService;

    public String uploadPhoto(Long taskId, MultipartFile file, Long userId) {
        Task task = taskRepository.findByIdAndCreatorId(taskId, userId)
                .orElseThrow(() -> new NotFoundException("Задача не найдена"));

        String filename = fileService.saveFile(file);

        Optional<Photo> existingPhoto = photoRepository.findByTaskId(taskId);
        if (existingPhoto.isPresent()) {
            fileService.deleteFile(existingPhoto.get().getFilename());
            Photo photo = existingPhoto.get();
            photo.setFilename(filename);
            photo.setFilepath(fileService.getFileUrl(filename));
            photoRepository.save(photo);
        } else {
            Photo photo = Photo.builder()
                    .filename(filename)
                    .filepath(fileService.getFileUrl(filename))
                    .task(task)
                    .build();
            photoRepository.save(photo);
        }

        return fileService.getFileUrl(filename);
    }

    public void deletePhoto(Long taskId, Long userId) {
        Task task = taskRepository.findByIdAndCreatorId(taskId, userId)
                .orElseThrow(() -> new NotFoundException("Задача не найдена"));

        Photo photo = photoRepository.findByTaskId(taskId)
                .orElseThrow(() -> new NotFoundException("Задача не найдена"));

        fileService.deleteFile(photo.getFilename());
        photoRepository.delete(photo);
    }

    public String getPhotoUrl(Long taskId) {
        Photo photo = photoRepository.findByTaskId(taskId)
                .orElseThrow(() -> new NotFoundException("Фото не найдено"));
        return photo.getFilepath();
    }
}