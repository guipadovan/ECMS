package com.guipadovan.ecms;

import com.guipadovan.ecms.domain.AppUser;
import com.guipadovan.ecms.service.AppUserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class EcmsApplicationRunner implements CommandLineRunner {

    private final AppUserService appUserService;

    public EcmsApplicationRunner(AppUserService appUserService) {
        this.appUserService = appUserService;
    }

    // test user
    @Override
    public void run(String... args) throws Exception {
        AppUser appUser = appUserService.saveUser(new AppUser("Guii", "asd123@gmail.com", "asd123", LocalDateTime.now())).orElseThrow();
        appUserService.enableUser(appUser.getUsername());
    }
}
