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
}