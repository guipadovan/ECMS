package com.guipadovan.ecms.repo;

import com.guipadovan.ecms.domain.ConfirmationToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

public interface ConfirmationTokenRepository extends JpaRepository<ConfirmationToken, Long> {

    @Query("select c from ConfirmationToken c where c.token = ?1")
    ConfirmationToken findByToken(String token);

    @Transactional
    @Modifying
    @Query("update ConfirmationToken c set c.confirmedAt = ?2 where c.token = ?1")
    void updateConfirmedAtByToken(String token, LocalDateTime confirmedAt);

}