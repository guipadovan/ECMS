package com.guipadovan.ecms.api;

import com.guipadovan.ecms.api.request.CommentRequest;
import com.guipadovan.ecms.api.request.PostRequest;
import com.guipadovan.ecms.domain.AppUser;
import com.guipadovan.ecms.domain.blog.Post;
import com.guipadovan.ecms.domain.blog.PostComment;
import com.guipadovan.ecms.domain.blog.PostReaction;
import com.guipadovan.ecms.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("api/v1/post")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class PostController {

    private final PostService postService;

    @Autowired
    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping(value = "/new", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> newPost(@AuthenticationPrincipal AppUser appUser, @RequestBody PostRequest postRequest) {

        Optional<Post> post = postService.savePost(new Post(appUser, postRequest.title(), postRequest.subtitle(),
                postRequest.text(), LocalDateTime.now(), postRequest.locked()));

        return ResponseEntity.of(post);
    }

    @GetMapping("/posts")
    public ResponseEntity<Page<Post>> getPosts(@RequestParam Optional<String> title, @RequestParam Optional<Integer> page, @RequestParam Optional<Integer> size) {
        return ResponseEntity.ok(postService.getPosts(title.orElse(""), page.orElse(0), size.orElse(10)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Post> getPost(@PathVariable("id") long postId) {
        return ResponseEntity.of(postService.getPost(postId));
    }

    @PutMapping("/{id}/switch-lock")
    public ResponseEntity<String> switchPostLock(@AuthenticationPrincipal AppUser appUser, @PathVariable("id") long postId) {

        postService.switchLockedPost(postId, appUser);

        return ResponseEntity.ok("Post lock switched successfully");
    }

    @DeleteMapping("/{id}/delete")
    public ResponseEntity<String> deletePost(@PathVariable("id") long postId) {

        postService.deletePost(postId);

        return ResponseEntity.ok("Post deleted successfully");
    }


    @PutMapping(value = "/{id}/update", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> updatePost(@AuthenticationPrincipal AppUser appUser, @PathVariable("id") long postId, @RequestBody PostRequest postRequest) {

        postService.updatePost(postId, appUser, postRequest.title(),
                postRequest.subtitle(), postRequest.text(), postRequest.locked());

        return ResponseEntity.ok("Post \"" + postRequest.text() + "\" updated successfully");
    }

    @PostMapping(value = "/{id}/reaction", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> newReaction(@AuthenticationPrincipal AppUser appUser, @PathVariable("id") long postId, @RequestParam("reaction") long reactionId) {

        postService.getPost(postId).ifPresentOrElse(post ->
                postService.addPostReaction(post.getId(), new PostReaction(appUser,
                        postService.getReaction(reactionId).orElseThrow(() ->
                                new NullPointerException("Reaction not found")))), () -> {
            throw new NullPointerException("Post not found");
        });

        return ResponseEntity.ok().build();
    }

    @PostMapping(value = "/{id}/comment", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> newComment(@AuthenticationPrincipal AppUser appUser, @PathVariable("id") long postId, @RequestBody CommentRequest commentRequest) {

        if (commentRequest.comment().replaceAll(" ", "").equalsIgnoreCase(""))
            throw new IllegalStateException("Comment cannot be empty");

        postService.getPost(postId).ifPresentOrElse(
                post -> {
                    if (post.isLocked())
                        throw new IllegalStateException("Post \"" + post.getTitle() + "\" is locked");

                    postService.addPostComment(post.getId(), new PostComment(appUser,
                            commentRequest.comment(), LocalDateTime.now()));
                },
                () -> {
                    throw new NullPointerException("Post not found");
                });

        return ResponseEntity.ok().build();
    }

}
