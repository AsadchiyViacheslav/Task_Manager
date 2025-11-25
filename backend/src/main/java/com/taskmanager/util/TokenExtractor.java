package com.taskmanager.util;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class TokenExtractor {

    public Long getUserIdFromRequest(HttpServletRequest request) {

        var auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null) {
            throw new RuntimeException("Вы не авторизованны");
        }
        if (auth.getPrincipal() == null) {
            throw new RuntimeException("Вы не авторизованны");
        }
        return (Long) auth.getPrincipal();
    }
}