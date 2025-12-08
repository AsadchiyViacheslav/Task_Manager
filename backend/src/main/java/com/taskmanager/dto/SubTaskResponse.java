package com.taskmanager.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class SubTaskResponse {
    private Long id;
    private String description;
    private Boolean completed;
}