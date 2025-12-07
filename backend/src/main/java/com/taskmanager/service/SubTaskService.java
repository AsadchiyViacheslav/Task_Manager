package com.taskmanager.service;

import com.taskmanager.dto.*;
import com.taskmanager.exception.*;
import com.taskmanager.model.SubTask;
import com.taskmanager.model.Task;
import com.taskmanager.repository.SubTaskRepository;
import com.taskmanager.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubTaskService {

    private final SubTaskRepository subTaskRepository;
    private final TaskRepository taskRepository;

    public SubTaskResponse createSubTask(Long taskId, CreateSubTaskRequest request, Long userId) {

        Task task = taskRepository.findByIdAndCreatorId(taskId, userId)
                .orElseThrow(() -> new NotFoundException("Задача не найдена"));

        SubTask subTask = SubTask.builder()
                .description(request.getDescription())
                .completed(false)
                .task(task)
                .build();

        SubTask saved = subTaskRepository.save(subTask);
        return mapToSubTaskResponse(saved);
    }

    public SubTaskResponse updateSubTask(Long taskId, Long subTaskId, UpdateSubTaskRequest request, Long userId) {
        Task task = taskRepository.findByIdAndCreatorId(taskId, userId)
                .orElseThrow(() -> new NotFoundException("Задача не найдена"));

        SubTask subTask = subTaskRepository.findByIdAndTaskCreatorId(subTaskId, userId)
                .orElseThrow(() -> new NotFoundException("Подзадача не найдена"));

        if (request.getDescription() != null) {
            subTask.setDescription(request.getDescription());
        }

        if (request.getCompleted() != null) {
            subTask.setCompleted(request.getCompleted());
        }

        SubTask updated = subTaskRepository.save(subTask);
        return mapToSubTaskResponse(updated);
    }

    public void deleteSubTask(Long taskId, Long subTaskId, Long userId) {
        Task task = taskRepository.findByIdAndCreatorId(taskId, userId)
                .orElseThrow(() -> new NotFoundException("Задача не найдена"));

        SubTask subTask = subTaskRepository.findByIdAndTaskCreatorId(subTaskId, userId)
                .orElseThrow(() -> new NotFoundException("Подзадача не найдена"));

        subTaskRepository.delete(subTask);
    }

    private SubTaskResponse mapToSubTaskResponse(SubTask subTask) {
        return SubTaskResponse.builder()
                .id(subTask.getId())
                .description(subTask.getDescription())
                .completed(subTask.getCompleted())
                .build();
    }
}