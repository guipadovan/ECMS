package com.guipadovan.ecms.repo;

import com.guipadovan.ecms.domain.blog.Reaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface ReactionRepository extends JpaRepository<Reaction, Long> {

    @Query("select r from Reaction r where r.name = ?1")
    Optional<Reaction> findByName(String name);

}