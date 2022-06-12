package com.guipadovan.ecms.service;

import com.guipadovan.ecms.api.request.AuthRequest;
import com.guipadovan.ecms.api.request.RegisterRequest;
import org.springframework.http.ResponseEntity;

public interface AuthService {

    ResponseEntity<String> register(RegisterRequest registerRequest);

    ResponseEntity<String> login(AuthRequest authRequest);

    ResponseEntity<String> confirmToken(String token);

    ResponseEntity<String> changePassword();

    ResponseEntity<String> forgetPassword();

}
