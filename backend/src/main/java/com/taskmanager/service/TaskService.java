package com.taskmanager.service;


import com.taskmanager.dto.*;
import com.taskmanager.exception.*;
import com.taskmanager.model.*;
import com.taskmanager.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {
    private final TaskRepository taskRepository;
    private final PhotoRepository photoRepository;
    private final UserRepository userRepository;
    private final FileService fileService;

    public TaskResponse createTask(CreateTaskRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Пользователь не найден"));

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .deadline(request.getDeadline())
                .priority(request.getPriority() != null ? request.getPriority() : TaskPriority.MEDIUM)
                .status(request.getStatus() != null ? request.getStatus() : TaskStatus.TODO)
                .progress(request.getProgress() != null ? request.getProgress() : 0)
                .creator(user)
                .build();

        Task saved = taskRepository.save(task);
        return mapToTaskResponse(saved);
    }

    public TaskResponse updateTask(Long taskId, UpdateTaskRequest request, Long userId) {
        Task task = taskRepository.findByIdAndCreatorId(taskId, userId)
                .orElseThrow(() -> new NotFoundException("Задача не найдена"));

        boolean wasCompleted = task.getStatus() == TaskStatus.DONE || task.getProgress() == 100;

        if (request.getTitle() != null) {
            task.setTitle(request.getTitle());
        }

        if (request.getDescription() != null) {
            task.setDescription(request.getDescription());
        }

        if (request.getDeadline() != null) {
            task.setDeadline(request.getDeadline());
        }

        if (request.getPriority() != null) {
            task.setPriority(request.getPriority());
        }

        if (request.getStatus() != null) {
            task.setStatus(request.getStatus());
        }

        if (request.getProgress() != null) {
            task.setProgress(request.getProgress());
        }

        boolean isCompletedNow = task.getStatus() == TaskStatus.DONE || task.getProgress() == 100;

        if (!wasCompleted && isCompletedNow) {
            task.setCompletedAt(LocalDateTime.now());
        }

        if (wasCompleted && !isCompletedNow) {
            task.setCompletedAt(null);
        }

        Task updated = taskRepository.save(task);
        return mapToTaskResponse(updated);
    }

    @Transactional
    public void deleteTask(Long taskId, Long userId) {
        Task task = taskRepository.findByIdAndCreatorId(taskId, userId)
                .orElseThrow(() -> new NotFoundException("Задача не найдена"));

        Photo photo = photoRepository.findByTaskId(taskId).orElse(null);
        if (photo != null) {
            fileService.deleteFile(photo.getFilename());
        }

        taskRepository.deleteByIdAndCreatorId(taskId, userId);
    }

    public TaskResponse getTask(Long taskId, Long userId) {
        Task task = taskRepository.findByIdAndCreatorId(taskId, userId)
                .orElseThrow(() -> new NotFoundException("Задача не найдена"));
        return mapToTaskResponse(task);
    }

    public List<TaskResponse> getAllTasks(Long userId) {
        List<Task> tasks = taskRepository.findByCreatorIdOrderByCreatedAtDesc(userId);
        return tasks.stream()
                .map(this::mapToTaskResponse)
                .collect(Collectors.toList());
    }

    public List<DailyCompletedTasksResponse> getDailyCompletedStats(Long userId) {
        List<Task> completed = getCompletedTasksForLastYear(userId);

        Map<LocalDate, Long> stats = completed.stream()
                .collect(Collectors.groupingBy(
                        t -> t.getCompletedAt().toLocalDate(),
                        Collectors.counting()
                ));

        return stats.entrySet().stream()
                .sorted(Map.Entry.<LocalDate, Long>comparingByKey().reversed())
                .map(e -> new DailyCompletedTasksResponse(e.getKey(), e.getValue()))
                .collect(Collectors.toList());
    }


    public List<Task> getCompletedTasksForLastYear(Long userId) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime oneYearAgo = now.minusYears(1);

        List<Task> tasks = taskRepository.findByCreatorIdAndCreatedAtBetweenOrderByCreatedAtDesc(
                userId,
                oneYearAgo,
                now
        );

        return tasks.stream()
                .filter(t ->
                        t.getStatus() == TaskStatus.DONE ||
                                (t.getProgress() != null && t.getProgress() == 100)
                )
                .collect(Collectors.toList());
    }


    private TaskResponse mapToTaskResponse(Task task) {
        List<SubTaskResponse> subTasks = task.getSubTasks().stream()
                .map(st -> SubTaskResponse.builder()
                        .id(st.getId())
                        .description(st.getDescription())
                        .completed(st.getCompleted())
                        .build())
                .collect(Collectors.toList());

        String photoPath = null;
        if (task.getPhoto() != null) {
            photoPath = fileService.getFileUrl(task.getPhoto().getFilename());
        }

        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .deadline(task.getDeadline())
                .priority(task.getPriority())
                .status(task.getStatus())
                .progress(task.getProgress())
                .createdAt(task.getCreatedAt())
                .photoPath(photoPath)
                .subTasks(subTasks)
                .build();
    }
}