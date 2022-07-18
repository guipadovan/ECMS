package com.guipadovan.ecms.repo;

import com.guipadovan.ecms.domain.blog.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

    @Query("select p from Post p where p.author.id = ?1 order by p.postedAt")
    List<Post> findByAuthorIdOrderByPostedAtAsc(Long id);

}