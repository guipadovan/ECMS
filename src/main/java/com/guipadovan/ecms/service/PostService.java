package com.guipadovan.ecms.service;

import com.guipadovan.ecms.domain.AppUser;
import com.guipadovan.ecms.domain.blog.Post;
import com.guipadovan.ecms.domain.blog.PostComment;
import com.guipadovan.ecms.domain.blog.PostReaction;
import com.guipadovan.ecms.domain.blog.Reaction;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Optional;

public interface PostService {

    Optional<Post> savePost(Post post);

    Optional<Reaction> saveReaction(Reaction reaction);

    void updatePost(Long id, AppUser updatedBy, String title, String subtitle, String text, boolean locked);

    void deletePost(Long id);

    void switchLockedPost(Long id, AppUser updatedBy);

    void addPostReaction(Long postId, PostReaction postReaction);

    void addPostComment(Long postId, PostComment postComment);

    Optional<Post> getPost(Long id);

    List<Post> getPostsByAuthor(String username);

    Optional<Reaction> getReaction(Long id);

    Optional<Reaction> getReactionByName(String name);

    Page<Post> getPosts(String title, int page, int size);

}
