package com.guipadovan.ecms.service;

import com.guipadovan.ecms.domain.AppUser;
import com.guipadovan.ecms.domain.ConfirmationToken;
import com.guipadovan.ecms.domain.Role;
import com.guipadovan.ecms.domain.blog.Post;
import org.springframework.data.domain.Page;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;
import java.util.Optional;

public interface AppUserService extends UserDetailsService {

    Optional<AppUser> saveUser(AppUser user);

    Optional<Role> saveRole(Role role);

    Optional<ConfirmationToken> saveConfirmationToken(ConfirmationToken token);

    void addRoleToUser(String username, String role);

    void enableUser(String username);

    void setConfirmedAt(String token);

    Optional<AppUser> getUser(String username);

    Optional<AppUser> getUserById(Long id);

    Optional<AppUser> getUserByEmail(String email);

    Optional<Role> getRole(String role);

    Optional<ConfirmationToken> getConfirmationToken(String token);

    Page<AppUser> getUsers(String name, int page, int size);
}
