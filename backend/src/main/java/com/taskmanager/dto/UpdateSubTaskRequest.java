package com.taskmanager.dto;

import lombok.Data;

@Data
public class UpdateSubTaskRequest {
    private String description;
    private Boolean completed;
}