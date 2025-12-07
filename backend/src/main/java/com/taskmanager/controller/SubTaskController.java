package com.taskmanager.controller;

import com.taskmanager.dto.*;
import com.taskmanager.service.SubTaskService;
import com.taskmanager.util.TokenExtractor;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("api/tasks/{taskId}/subtasks")
@RequiredArgsConstructor
public class SubTaskController {

    private final SubTaskService subTaskService;
    private final TokenExtractor tokenExtractor;

    @PostMapping
    public ResponseEntity<SubTaskResponse> createSubTask(
            @PathVariable Long taskId,
            @RequestBody CreateSubTaskRequest request,
            HttpServletRequest httpRequest) {
        Long userId = tokenExtractor.getUserIdFromRequest(httpRequest);
        SubTaskResponse response = subTaskService.createSubTask(taskId, request, userId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{subTaskId}")
    public ResponseEntity<SubTaskResponse> updateSubTask(
            @PathVariable Long taskId,
            @PathVariable Long subTaskId,
            @RequestBody UpdateSubTaskRequest request,
            HttpServletRequest httpRequest) {
        Long userId = tokenExtractor.getUserIdFromRequest(httpRequest);
        SubTaskResponse response = subTaskService.updateSubTask(taskId, subTaskId, request, userId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{subTaskId}")
    public ResponseEntity<?> deleteSubTask(
            @PathVariable Long taskId,
            @PathVariable Long subTaskId,
            HttpServletRequest httpRequest) {
        Long userId = tokenExtractor.getUserIdFromRequest(httpRequest);
        subTaskService.deleteSubTask(taskId, subTaskId, userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{subTaskId}")
    public ResponseEntity<SubTaskResponse> getSubTask(
            @PathVariable Long taskId,
            @PathVariable Long subTaskId,
            HttpServletRequest httpRequest) {
        Long userId = tokenExtractor.getUserIdFromRequest(httpRequest);
        SubTaskResponse response = subTaskService.getSubTask(taskId, subTaskId, userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<SubTaskResponse>> getSubTasks(
            @PathVariable Long taskId,
            HttpServletRequest httpRequest) {
        Long userId = tokenExtractor.getUserIdFromRequest(httpRequest);
        List<SubTaskResponse> response = subTaskService.getSubTasksByTask(taskId, userId);
        return ResponseEntity.ok(response);
    }
}