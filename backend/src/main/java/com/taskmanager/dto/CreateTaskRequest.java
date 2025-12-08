package com.taskmanager.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.taskmanager.model.TaskPriority;
import com.taskmanager.model.TaskStatus;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.time.LocalDate;

@Data
public class CreateTaskRequest {

    @NotBlank(message = "Требуется название")
    @Size(min = 3, max = 100, message = "Заголовок должен содержать от 3 до 100 символов")
    private String title;

    @Size(max = 1000, message = "Описание не должно быть длинее 1000 символов")
    private String description;

    @NotNull(message = "Срок обязателен")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    @FutureOrPresent(message = "Данная дата уже прошла")
    private LocalDate deadline;

    @NotNull(message = "Приоритет обязателен")
    private TaskPriority priority;

    private TaskStatus status;

    @Min(value = 0, message = "Прогресс не может быть меньше 0")
    @Max(value = 100, message = "Прогресс не может быть больше 100")
    private Integer progress = 0;
}
