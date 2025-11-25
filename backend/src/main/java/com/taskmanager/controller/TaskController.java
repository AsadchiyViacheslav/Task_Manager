package com.taskmanager.controller;

import com.taskmanager.dto.*;
import com.taskmanager.service.TaskService;
import com.taskmanager.util.TokenExtractor;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;
    private final TokenExtractor tokenExtractor;
    private static final Logger log = LoggerFactory.getLogger(TaskController.class);

    @PostMapping
    public ResponseEntity<TaskResponse> createTask(
            @Valid @RequestBody CreateTaskRequest request,
            HttpServletRequest httpRequest) {
        Long userId = tokenExtractor.getUserIdFromRequest(httpRequest);
        log.info("Create task attempt: {}, userId={}", request.getTitle(), userId);
        TaskResponse response = taskService.createTask(request, userId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{taskId}")
    public ResponseEntity<TaskResponse> updateTask(
            @PathVariable Long taskId,
            @Valid @RequestBody UpdateTaskRequest request,
            HttpServletRequest httpRequest) {
        Long userId = tokenExtractor.getUserIdFromRequest(httpRequest);
        log.info("Update task attempt: taskId={}, userId={}", taskId, userId);
        TaskResponse response = taskService.updateTask(taskId, request, userId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<?> deleteTask(
            @PathVariable Long taskId,
            HttpServletRequest httpRequest) {
        Long userId = tokenExtractor.getUserIdFromRequest(httpRequest);
        log.info("Delete task attempt: taskId={}, userId={}", taskId, userId);
        taskService.deleteTask(taskId, userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{taskId}")
    public ResponseEntity<TaskResponse> getTask(
            @PathVariable Long taskId,
            HttpServletRequest httpRequest) {
        Long userId = tokenExtractor.getUserIdFromRequest(httpRequest);
        log.info("Get task attempt: taskId={}, userId={}", taskId, userId);
        TaskResponse response = taskService.getTask(taskId, userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<TaskResponse>> getAllTasks(HttpServletRequest httpRequest) {
        Long userId = tokenExtractor.getUserIdFromRequest(httpRequest);
        log.info("Get all tasks attempt: userId={}", userId);
        List<TaskResponse> response = taskService.getAllTasks(userId);
        return ResponseEntity.ok(response);
    }
}
