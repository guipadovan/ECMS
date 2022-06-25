package com.guipadovan.ecms.repo;

import com.guipadovan.ecms.domain.blog.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, Long> {
}