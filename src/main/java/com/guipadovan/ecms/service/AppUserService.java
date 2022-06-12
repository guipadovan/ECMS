package com.guipadovan.ecms.service;

import com.guipadovan.ecms.domain.AppUser;
import com.guipadovan.ecms.domain.ConfirmationToken;
import com.guipadovan.ecms.domain.Role;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;

public interface AppUserService extends UserDetailsService {

    AppUser saveUser(AppUser user);

    Role saveRole(Role role);

    ConfirmationToken saveConfirmationToken(ConfirmationToken token);

    void addRoleToUser(String username, String role);

    void enableUser(String username);

    void setConfirmedAt(String token);

    AppUser getUser(String username);

    AppUser getUserByEmail(String email);

    Role getRole(String role);

    ConfirmationToken getConfirmationToken(String token);

    // TODO page system
    List<AppUser> getUsers();
}
