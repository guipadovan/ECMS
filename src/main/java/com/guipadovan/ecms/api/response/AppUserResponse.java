package com.guipadovan.ecms.api.response;

import com.guipadovan.ecms.domain.Role;

import java.time.LocalDateTime;
import java.util.Collection;

public record AppUserResponse(String username, LocalDateTime createdAt, Collection<Role> roles) {
}
