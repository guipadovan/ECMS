package com.guipadovan.ecms.repo;

import com.guipadovan.ecms.domain.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface AppUserRepository extends JpaRepository<AppUser, Long> {

    @Query("select a from AppUser a where a.username = ?1")
    Optional<AppUser> findByUsername(String username);

    @Query("select a from AppUser a where a.email = ?1")
    Optional<AppUser> findByEmail(String email);

    @Query("select (count(a) > 0) from AppUser a where a.email = ?1")
    boolean existsByEmail(String email);

    @Query("select (count(a) > 0) from AppUser a where a.username = ?1")
    boolean existsByUsername(String username);

    @Transactional
    @Modifying
    @Query("update AppUser a set a.enabled = ?1 where a.username = ?2")
    void updateEnabledByUsername(boolean enabled, String username);


}