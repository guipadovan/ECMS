package com.guipadovan.ecms.repo;

import com.guipadovan.ecms.domain.blog.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.List;

public interface PostRepository extends PagingAndSortingRepository<Post, Long> {

    @Query("select p from Post p where p.author.id = ?1 order by p.postedAt")
    List<Post> findByAuthorIdOrderByPostedAtAsc(Long id);

    @Query("select p from Post p where p.title like concat('%', ?1, '%')")
    Page<Post> findByTitleContaining(String title, Pageable pageable);

}