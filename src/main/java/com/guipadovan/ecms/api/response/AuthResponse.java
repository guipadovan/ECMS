package com.guipadovan.ecms.api.response;

import com.guipadovan.ecms.domain.Role;

import java.time.LocalDateTime;
import java.util.Collection;

public record AuthResponse(Long id, String username, String email, Collection<Role> roles, LocalDateTime createdAt,
                           boolean locked) {
}
