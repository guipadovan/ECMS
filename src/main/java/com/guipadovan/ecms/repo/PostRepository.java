package com.guipadovan.ecms.repo;

import com.guipadovan.ecms.domain.blog.Post;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long> {
}