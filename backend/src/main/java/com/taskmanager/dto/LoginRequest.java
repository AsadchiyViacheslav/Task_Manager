package com.taskmanager.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {

    @NotBlank(message = "Требуется электронная почта")
    @Email(message = "Адрес электронной почты должен быть корректным")
    private String email;

    @NotBlank(message = "Пароль обязателен")
    private String password;
}
