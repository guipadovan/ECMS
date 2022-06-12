package com.guipadovan.ecms.service;

import com.guipadovan.ecms.config.PasswordEncoder;
import com.guipadovan.ecms.domain.AppUser;
import com.guipadovan.ecms.domain.ConfirmationToken;
import com.guipadovan.ecms.domain.Role;
import com.guipadovan.ecms.repo.AppUserRepository;
import com.guipadovan.ecms.repo.ConfirmationTokenRepository;
import com.guipadovan.ecms.repo.RoleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@RequiredArgsConstructor
@Transactional
@Slf4j
@Service
public class AppUserServiceImpl implements AppUserService {

    private final AppUserRepository appUserRepository;
    private final RoleRepository roleRepository;
    private final ConfirmationTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;

    // used only by spring authentication manager
    @Override
    public AppUser loadUserByUsername(String username) throws UsernameNotFoundException {
        AppUser appUser = getUser(username);
        if (appUser == null)
            throw new UsernameNotFoundException("User with name " + username + " not found");
        return appUser;
    }

    @Override
    public AppUser saveUser(AppUser user) {
        if (getUser(user.getUsername()) != null)
            throw new IllegalStateException("Username already taken");
        else if (getUserByEmail(user.getEmail()) != null)
            throw new IllegalStateException("Email already taken");

        user.setPassword(passwordEncoder.bCryptPasswordEncoder().encode(user.getPassword()));

        if (getRole("admin") == null)
            saveRole(new Role("admin"));

        user.setRoles(Collections.singleton(getRole("admin")));

        log.info("Saving new user {} to the database", user.getUsername());
        return appUserRepository.save(user);
    }

    @Override
    public Role saveRole(Role role) {
        if (getRole(role.getName()) != null)
            throw new IllegalStateException("A role with name " + role.getName() + " already exist");

        log.info("Saving new role {} to the database", role.getName());
        return roleRepository.save(role);
    }

    @Override
    public ConfirmationToken saveConfirmationToken(ConfirmationToken token) {
        log.info("Saving new token {} to the database", token.getToken());
        return tokenRepository.save(token);
    }

    @Override
    public void addRoleToUser(String username, String roleName) {
        AppUser appUser = appUserRepository.findByUsername(username);
        Role role = roleRepository.findByName(roleName);

        if (appUser == null || role == null) {
            throw new NullPointerException((appUser == null ? "User" : "Role") + " can't be null");
        } else if (appUser.getRoles().contains(role))
            throw new IllegalStateException("User already in this role");

        log.info("Adding new role {} to user {}", role.getName(), appUser.getUsername());
        appUser.getRoles().add(role);
    }

    @Override
    public void enableUser(String username) {
        AppUser appUser = getUser(username);
        if (appUser == null)
            throw new NullPointerException("User " + username + " not found");

        log.info("Enabling user {} account", username);
        appUser.setEnabled(true);
    }

    @Override
    public void setConfirmedAt(String token) {
        log.info("Confirming token {}", token);
        tokenRepository.updateConfirmedAtByToken(token, LocalDateTime.now());
    }

    @Override
    public AppUser getUser(String username) {
        log.info("Fetching user {} from database", username);
        return appUserRepository.findByUsername(username);
    }

    @Override
    public AppUser getUserByEmail(String email) {
        log.info("Fetching user with email {} from database", email);
        return appUserRepository.findByEmail(email);
    }

    @Override
    public Role getRole(String role) {
        log.info("Fetching role {} from database", role);
        return roleRepository.findByName(role);
    }

    @Override
    public ConfirmationToken getConfirmationToken(String token) {
        log.info("Fetching token {} from database", token);
        return tokenRepository.findByToken(token);
    }

    @Override
    public List<AppUser> getUsers() {
        log.info("Fetching all users from database");
        return appUserRepository.findAll();
    }
}
