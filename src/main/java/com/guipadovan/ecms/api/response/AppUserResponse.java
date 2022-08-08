package com.guipadovan.ecms.api.response;

import com.guipadovan.ecms.domain.Role;

import java.time.LocalDateTime;

public record AppUserResponse(String username, LocalDateTime createdAt, Role roles) {
}
