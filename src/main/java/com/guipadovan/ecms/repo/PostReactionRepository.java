package com.guipadovan.ecms.repo;

import com.guipadovan.ecms.domain.blog.PostReaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostReactionRepository extends JpaRepository<PostReaction, Long> {
}