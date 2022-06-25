package com.guipadovan.ecms.repo;

import com.guipadovan.ecms.domain.blog.Reaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReactionRepository extends JpaRepository<Reaction, Long> {
}