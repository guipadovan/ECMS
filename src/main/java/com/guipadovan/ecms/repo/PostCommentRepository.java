package com.guipadovan.ecms.repo;

import com.guipadovan.ecms.domain.blog.PostComment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostCommentRepository extends JpaRepository<PostComment, Long> {
}