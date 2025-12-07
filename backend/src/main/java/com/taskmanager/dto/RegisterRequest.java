package com.taskmanager.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "Имя пользователя обязательно")
    @Size(min = 3, max = 50, message = "Длина имени пользователя должна составлять от 3 до 50")
    private String username;

    @NotBlank(message = "Требуется электронная почта")
    @Email(message = "Адрес электронной почты должен быть корректным")
    private String email;

    @NotBlank(message = "Пароль обязателен")
    @Size(min = 8, max = 50, message = "Длина пароля должна быть от 8 до 50")
    @Pattern(
            regexp = "^(?=.*[a-z])(?=.*[A-Z]).*$",
            message = "Пароль должен содержать как минимум одну заглавную и одну строчную букву"
    )
    private String password;

    @NotBlank(message = "Требуется подтверждение пароля")
    private String passwordConfirm;
}
