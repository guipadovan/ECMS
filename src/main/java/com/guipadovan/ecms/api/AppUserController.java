package com.guipadovan.ecms.api;

import com.guipadovan.ecms.api.response.AppUserResponse;
import com.guipadovan.ecms.domain.AppUser;
import com.guipadovan.ecms.service.AppUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RequiredArgsConstructor
@RestController
@RequestMapping("api/v1/user")
@CrossOrigin(origins = "http://localhost:3000")
public class AppUserController {

    private final AppUserService appUserService;

    @GetMapping("/info")
    public ResponseEntity<AppUserResponse> userInfo(@RequestParam("name") String name) {
        AppUser appUser = appUserService.getUser(name).orElseThrow(() -> new UsernameNotFoundException("User " + name + " not found"));

        AppUserResponse response = new AppUserResponse(appUser.getUsername(), appUser.getCreatedAt(),
                appUser.getRoles());

        return ResponseEntity.of(Optional.of(response));
    }

}
