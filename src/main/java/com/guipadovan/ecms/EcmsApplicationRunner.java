package com.guipadovan.ecms;

import com.guipadovan.ecms.domain.AppUser;
import com.guipadovan.ecms.domain.Permission;
import com.guipadovan.ecms.domain.Role;
import com.guipadovan.ecms.service.AppUserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class EcmsApplicationRunner implements CommandLineRunner {

    private final AppUserService appUserService;
    @Value("${config.master-user.username}")
    private String masterUserUsername;
    @Value("${config.master-user.email}")
    private String masterUserEmail;
    @Value("${config.master-user.password}")
    private String masterUserPassword;
    @Value("${config.master-role}")
    private String masterRole;
    @Value("${config.default-role}")
    private String defaultRole;

    public EcmsApplicationRunner(AppUserService appUserService) {
        this.appUserService = appUserService;
    }

    @Override
    public void run(String... args) throws Exception {
        if (appUserService.getRole(masterRole).isEmpty())
            appUserService.saveRole(new Role(masterRole, List.of(Permission.values())));
        if (appUserService.getRole(defaultRole).isEmpty())
            appUserService.saveRole(new Role(defaultRole, List.of(Permission.COMMENT, Permission.REACT)));
        if (appUserService.getUser(masterUserUsername).isEmpty()) {
            AppUser appUser = appUserService.saveUser(new AppUser(masterUserUsername, masterUserEmail, masterUserPassword, LocalDateTime.now())).orElseThrow();
            appUserService.enableUser(appUser.getUsername());
            appUserService.addRoleToUser(appUser.getUsername(), masterRole);
        }
    }
}
