package com.taskmanager.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class DailyCompletedTasksResponse {
    private LocalDate date;
    private Long count;
}
