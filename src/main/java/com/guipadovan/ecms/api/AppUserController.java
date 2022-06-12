package com.guipadovan.ecms.api;

import com.guipadovan.ecms.domain.AppUser;
import com.guipadovan.ecms.service.AppUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RequiredArgsConstructor
@RestController
@RequestMapping("api/v1/user")
@CrossOrigin(origins = "http://localhost:3000")
public class AppUserController {

    private final AppUserService appUserService;

    @GetMapping("/info")
    public ResponseEntity<AppUser> userInfo(@RequestParam("name") String name) {
        AppUser appUser = appUserService.getUser(name);

        if (appUser == null)
            return ResponseEntity.status(404).build();

        // REMOVE SENSITIVE INFORMATION
        appUser.setEmail(null);
        appUser.setPassword(null);
        appUser.setId(null);
    return ResponseEntity.of(Optional.of(appUser));
    }

}
