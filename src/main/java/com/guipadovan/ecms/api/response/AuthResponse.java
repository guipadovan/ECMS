package com.guipadovan.ecms.api.response;

import com.guipadovan.ecms.domain.Role;

import java.util.Collection;

public record AuthResponse(Long id, String username, String email, Collection<Role> roles, boolean locked) {
}
