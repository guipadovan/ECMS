package com.guipadovan.ecms.service;

import com.guipadovan.ecms.config.PasswordEncoder;
import com.guipadovan.ecms.domain.AppUser;
import com.guipadovan.ecms.domain.ConfirmationToken;
import com.guipadovan.ecms.domain.Role;
import com.guipadovan.ecms.repo.AppUserRepository;
import com.guipadovan.ecms.repo.ConfirmationTokenRepository;
import com.guipadovan.ecms.repo.RoleRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Transactional
@Slf4j
@Service
public class AppUserServiceImpl implements AppUserService {

    private final AppUserRepository appUserRepository;
    private final RoleRepository roleRepository;
    private final ConfirmationTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AppUserServiceImpl(AppUserRepository appUserRepository, RoleRepository roleRepository, ConfirmationTokenRepository tokenRepository, PasswordEncoder passwordEncoder) {
        this.appUserRepository = appUserRepository;
        this.roleRepository = roleRepository;
        this.tokenRepository = tokenRepository;
        this.passwordEncoder = passwordEncoder;
    }

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
    public void deleteUser(String username) {
        getUser(username).ifPresentOrElse(appUser -> {
            log.info("Deleting {}'s account", username);
            appUserRepository.delete(appUser);
        }, () -> {
            throw new NullPointerException("User " + username + " not found");
        });
    }

    @Override
    public void banUser(String username) {
        getUser(username).ifPresentOrElse(appUser -> {
            if (appUser.isLocked())
                throw new IllegalStateException("User " + username + " is already banned");

            log.info("Banning {}'s account", username);
            appUser.setLocked(true);
        }, () -> {
            throw new NullPointerException("User " + username + " not found");
        });
    }

    @Override
    public void unbanUser(String username) {
        getUser(username).ifPresentOrElse(appUser -> {
            if (!appUser.isLocked())
                throw new IllegalStateException("User " + username + " is not banned");

            log.info("Unbanning {}'s account", username);
            appUser.setLocked(false);
        }, () -> {
            throw new NullPointerException("User " + username + " not found");
        });
    }

    @Override
    public void setUserRole(String username, String roleName) {
        Role role = getRole(roleName).orElseThrow(() -> new NullPointerException("Role not found"));
        getUser(username).ifPresentOrElse(appUser -> {
            log.info("Setting new role {} to user {}", role.getName(), appUser.getUsername());
            appUser.setRole(role);
        }, () -> {
            throw new NullPointerException("User " + username + " not found");
        });
    }

    @Override
    public void disableUser(String username) {
        getUser(username).ifPresentOrElse(appUser -> {
            if (!appUser.isEnabled())
                throw new IllegalStateException("User " + username + " is not enabled");

            log.info("Disabling {}'s account", username);
            appUser.setEnabled(false);
        }, () -> {
            throw new NullPointerException("User " + username + " not found");
        });
    }

    @Override
    public void enableUser(String username) {
        getUser(username).ifPresentOrElse(appUser -> {
            if (appUser.isEnabled())
                throw new IllegalStateException("User " + username + " is already enabled");

            log.info("Enabling {}'s account", username);
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
        return appUserRepository.findByUsername(username);
    }

    @Override
    public Optional<AppUser> getUserById(Long id) {
        log.info("Fetching user with id {} from database", id);
        return appUserRepository.findById(id);
    }

    @Override
    public Optional<AppUser> getUserByEmail(String email) {
        log.info("Fetching user with email {} from database", email);
        return appUserRepository.findByEmail(email);
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
    public Page<AppUser> getUsers(String name, int page, int size) {
        log.info("Fetching users for page {} of size {} from database", page, size);
        return appUserRepository.findByUsernameContaining(name, PageRequest.of(page, size));
    }
}
