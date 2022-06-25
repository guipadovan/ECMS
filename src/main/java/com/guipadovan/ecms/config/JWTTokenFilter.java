package com.guipadovan.ecms.config;

import com.guipadovan.ecms.domain.AppUser;
import com.guipadovan.ecms.service.AppUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Slf4j
@RequiredArgsConstructor
public class JWTTokenFilter extends OncePerRequestFilter {

    private final JWTTokenHelper tokenHelper;
    private final AppUserService appUserService;

    @Override
    public void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String token = request.getHeader("Authorization");
        if (token != null) {
            String username = tokenHelper.getUsernameFromToken(token);
            boolean error = true;
            if (username != null) {
                AppUser user = appUserService.getUser(username).orElseThrow(() -> new IllegalStateException("User not found"));
                error = false;
                if (tokenHelper.validateToken(token, user)) {
                    Authentication authentication = tokenHelper.getAuthentication(user);
                    if (authentication.isAuthenticated()) {
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                    }
                } else
                    error = true;
            }

            if (error) {
                SecurityContextHolder.clearContext();
                response.setContentType("application/json");
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                try {
                    response.getWriter().println(new JSONObject().put("exception", "expired or invalid JWT token"));
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }
        }
        filterChain.doFilter(request, response);
    }

}
