package com.taskmanager.security;

import jakarta.servlet.*;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import java.io.IOException;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@Component
@RequiredArgsConstructor
public class JwtFilter extends GenericFilter {

    private static final Logger log = LoggerFactory.getLogger(JwtFilter.class);

    private final JwtUtil jwtUtil;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;

        try {
            String token = extractTokenFromCookies(httpRequest);

            if (token != null) {
                boolean valid = jwtUtil.validateToken(token);
                log.info("JwtFilter: validation = {}", valid);

                if (valid) {
                    Long userId = jwtUtil.getUserIdFromToken(token);
                    log.info("JwtFilter: userId extracted = {}", userId);

                    UsernamePasswordAuthenticationToken auth =
                            new UsernamePasswordAuthenticationToken(userId, null, List.of());

                    SecurityContextHolder.getContext().setAuthentication(auth);
                    log.info("JwtFilter: Authentication set");
                }
            } else {
                log.warn("JwtFilter: No accessToken cookie");
            }

            chain.doFilter(request, response);
            log.info("JwtFilter: END");

        } catch (Exception e) {
            log.error("JwtFilter: ERROR", e);
            throw e;
        }
    }


    private String extractTokenFromCookies(HttpServletRequest request) {
        if (request.getCookies() == null) return null;

        for (Cookie cookie : request.getCookies()) {
            if ("accessToken".equals(cookie.getName())) {
                return cookie.getValue();
            }
        }
        return null;
    }
}
