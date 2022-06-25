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
import java.util.Collections;
import java.util.List;
import java.util.Optional;

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
        return getUser(username).orElseThrow(() -> new UsernameNotFoundException("User with name " + username + " not found"));
    }

    @Override
    public Optional<AppUser> saveUser(AppUser user) {
        getUser(user.getUsername()).ifPresent(appUser -> {
            throw new IllegalStateException("Username already taken");
        });
        getUserByEmail(user.getEmail()).ifPresent(appUser -> {
            throw new IllegalStateException("Email already taken");
        });

        user.setPassword(passwordEncoder.bCryptPasswordEncoder().encode(user.getPassword()));

        if (getRole("admin").isEmpty())
            saveRole(new Role("admin"));

        user.setRoles(Collections.singleton(getRole("admin").get()));

        log.info("Saving new user {} to the database", user.getUsername());
        return Optional.of(appUserRepository.save(user));
    }

    @Override
    public Optional<Role> saveRole(Role role) {
        getRole(role.getName()).ifPresent(role1 -> {
            throw new IllegalStateException("A role with name " + role.getName() + " already exist");
        });

        log.info("Saving new role {} to the database", role.getName());
        return Optional.of(roleRepository.save(role));
    }

    @Override
    public Optional<ConfirmationToken> saveConfirmationToken(ConfirmationToken token) {
        log.info("Saving new token {} to the database", token.getToken());
        return Optional.of(tokenRepository.save(token));
    }

    @Override
    public void addRoleToUser(String username, String roleName) {
        Role role = getRole(roleName).orElseThrow(() -> new IllegalStateException("Role not found"));
        getUser(username).ifPresentOrElse(appUser -> {
            log.info("Adding new role {} to user {}", role.getName(), appUser.getUsername());
            appUser.getRoles().add(role);
        }, () -> {
            throw new IllegalStateException("User not found");
        });
    }

    @Override
    public void enableUser(String username) {
        getUser(username).ifPresentOrElse(appUser -> {
            log.info("Enabling user {} account", username);
            appUser.setEnabled(true);
        }, () -> {
            throw new NullPointerException("User " + username + " not found");
        });
    }

    @Override
    public void setConfirmedAt(String token) {
        log.info("Confirming token {}", token);
        tokenRepository.updateConfirmedAtByToken(token, LocalDateTime.now());
    }

    @Override
    public Optional<AppUser> getUser(String username) {
        log.info("Fetching user {} from database", username);
        return Optional.ofNullable(appUserRepository.findByUsername(username));
    }

    @Override
    public Optional<AppUser> getUserByEmail(String email) {
        log.info("Fetching user with email {} from database", email);
        return Optional.ofNullable(appUserRepository.findByEmail(email));
    }

    @Override
    public Optional<Role> getRole(String role) {
        log.info("Fetching role {} from database", role);
        return Optional.ofNullable(roleRepository.findByName(role));
    }

    @Override
    public Optional<ConfirmationToken> getConfirmationToken(String token) {
        log.info("Fetching token {} from database", token);
        return Optional.ofNullable(tokenRepository.findByToken(token));
    }

    @Override
    public List<AppUser> getUsers() {
        log.info("Fetching all users from database");
        return appUserRepository.findAll();
    }
}
