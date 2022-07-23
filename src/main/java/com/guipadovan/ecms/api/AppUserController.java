package com.guipadovan.ecms.api;

import com.guipadovan.ecms.api.response.AppUserResponse;
import com.guipadovan.ecms.domain.AppUser;
import com.guipadovan.ecms.service.AppUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/user")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AppUserController {

    private final AppUserService appUserService;

    @Autowired
    public AppUserController(AppUserService appUserService) {
        this.appUserService = appUserService;
    }

    @GetMapping("/info")
    public ResponseEntity<AppUserResponse> userInfo(@RequestParam("name") String name) {
        AppUser appUser = appUserService.getUser(name).orElseThrow(() -> new UsernameNotFoundException("User " + name + " not found"));

        AppUserResponse response = new AppUserResponse(appUser.getUsername(), appUser.getCreatedAt(),
                appUser.getRoles());

        return ResponseEntity.ok(response);
    }

}
