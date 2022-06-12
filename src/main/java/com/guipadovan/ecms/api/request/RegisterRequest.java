package com.guipadovan.ecms.api.request;

public record RegisterRequest(String username, String email, String password, String confirmPassword) {
}
