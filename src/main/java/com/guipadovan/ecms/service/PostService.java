package com.guipadovan.ecms.service;

import com.guipadovan.ecms.domain.blog.Post;
import com.guipadovan.ecms.domain.blog.PostComment;
import com.guipadovan.ecms.domain.blog.PostReaction;
import com.guipadovan.ecms.domain.blog.Reaction;

import java.util.List;
import java.util.Optional;

public interface PostService {

    Optional<Post> savePost(Post post);

    Optional<Reaction> saveReaction(Reaction reaction);

    void addPostReaction(Long postId, PostReaction postReaction);

    void addPostComment(Long postId, PostComment postComment);

    Optional<Post> getPost(Long id);

    List<Post> getPostsByAuthor(String username);

    Optional<Reaction> getReaction(Long id);

    Optional<Reaction> getReactionByName(String name);

    List<Post> getPosts();

}
