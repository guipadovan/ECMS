package com.guipadovan.ecms.service;

import com.guipadovan.ecms.domain.blog.Comment;
import com.guipadovan.ecms.domain.blog.Post;
import com.guipadovan.ecms.domain.blog.Reaction;

public interface PostService {

    Post savePost(Post post);

    Comment saveComment(Post post, Comment comment);

    Reaction saveReaction(Reaction reaction);



}
