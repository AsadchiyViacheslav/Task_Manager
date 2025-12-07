package com.taskmanager.service;

import com.taskmanager.dto.*;
import com.taskmanager.exception.*;
import com.taskmanager.model.*;
import com.taskmanager.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaskService {
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public TaskResponse createTask(CreateTaskRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Пользователь не найден"));

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .deadline(request.getDeadline())
                .priority(request.getPriority() != null ? request.getPriority() : TaskPriority.MEDIUM)
                .status(request.getStatus() != null ? request.getStatus() : TaskStatus.TODO)
                .creator(user)
                .build();

        Task saved = taskRepository.save(task);
        return mapToTaskResponse(saved);
    }

    public TaskResponse updateTask(Long taskId, UpdateTaskRequest request, Long userId) {
        Task task = taskRepository.findByIdAndCreatorId(taskId, userId)
                .orElseThrow(() -> new NotFoundException("Задача не найдена"));

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

        Task updated = taskRepository.save(task);
        return mapToTaskResponse(updated);
    }

    @Transactional
    public void deleteTask(Long taskId, Long userId) {
        Task task = taskRepository.findByIdAndCreatorId(taskId, userId)
                .orElseThrow(() -> new NotFoundException("Задача не найдена"));

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

    private TaskResponse mapToTaskResponse(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .deadline(task.getDeadline())
                .priority(task.getPriority())
                .status(task.getStatus())
                .createdAt(task.getCreatedAt())
                .build();
    }
}
