package com.guipadovan.ecms.service;

import com.guipadovan.ecms.domain.AppUser;
import com.guipadovan.ecms.domain.blog.Post;
import com.guipadovan.ecms.domain.blog.PostComment;
import com.guipadovan.ecms.domain.blog.PostReaction;
import com.guipadovan.ecms.domain.blog.Reaction;
import com.guipadovan.ecms.repo.PostRepository;
import com.guipadovan.ecms.repo.ReactionRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Transactional
@Slf4j
@Service
public class PostServiceImpl implements PostService {

    private final AppUserService appUserService;
    private final PostRepository postRepository;
    private final ReactionRepository reactionRepository;

    @Autowired
    public PostServiceImpl(AppUserService appUserService, PostRepository postRepository, ReactionRepository reactionRepository) {
        this.appUserService = appUserService;
        this.postRepository = postRepository;
        this.reactionRepository = reactionRepository;
    }

    @Override
    public Optional<Post> savePost(Post post) {

        if (post.getAuthor() == null)
            throw new IllegalStateException("Author can't be null");
        else if (post.getTitle() == null)
            throw new IllegalStateException("Post title can't be null");
        else if (post.getText() == null)
            throw new IllegalStateException("Post body can't be null");

        // TODO check if has permission

        log.info("Saving new post {} by {} to the database", post.getTitle(), post.getAuthor().getUsername());
        return Optional.of(postRepository.save(post));
    }

    @Override
    public Optional<Reaction> saveReaction(Reaction reaction) {

        if (reaction.getName() == null)
            throw new IllegalStateException("Reaction name can't be null");

        // TODO check if has permission

        log.info("Saving new reaction {} to the database", reaction.getName());
        return Optional.of(reactionRepository.save(reaction));
    }

    @Override
    public void addPostReaction(Long postId, PostReaction postReaction) {
        Post post = getPost(postId).orElseThrow(() -> new NullPointerException("Post not found"));

        post.getReactions().stream()
                .filter(pR -> pR.getAppUser() == postReaction.getAppUser())
                .findFirst().ifPresent(pR -> post.getReactions().remove(pR));

        log.info("Adding user {} {} reaction to {}", postReaction.getAppUser().getUsername(),
                postReaction.getReaction().getName(), post.getTitle());
        post.getReactions().add(postReaction);
    }

    @Override
    public void addPostComment(Long postId, PostComment postComment) {
        Post post = getPost(postId).orElseThrow(() -> new NullPointerException("Post not found"));

        post.getComments().stream()
                .filter(pC -> pC.getPostedAt().isBefore(pC.getPostedAt().plusMinutes(1)) && pC.getAuthor() == postComment.getAuthor())
                .findFirst().ifPresent(pR -> {
                    throw new IllegalStateException("You must wait a minute to comment again");
                });

        log.info("Adding user {} comment to {}", postComment.getAuthor().getUsername(), post.getTitle());
        post.getComments().add(postComment);
    }

    @Override
    public Optional<Post> getPost(Long id) {
        return postRepository.findById(id);
    }

    @Override
    public List<Post> getPostsByAuthor(String username) {
        AppUser appUser = appUserService.getUser(username).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return postRepository.findByAuthorIdOrderByPostedAtAsc(appUser.getId());
    }

    @Override
    public Optional<Reaction> getReaction(Long id) {
        return reactionRepository.findById(id);
    }

    @Override
    public Optional<Reaction> getReactionByName(String name) {
        return reactionRepository.findByName(name);
    }

    @Override
    public List<Post> getPosts() {
        return postRepository.findAll();
    }
}
