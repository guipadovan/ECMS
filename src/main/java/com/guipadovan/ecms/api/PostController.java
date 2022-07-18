package com.guipadovan.ecms.api;

import com.guipadovan.ecms.api.request.PostRequest;
import com.guipadovan.ecms.domain.AppUser;
import com.guipadovan.ecms.domain.blog.Post;
import com.guipadovan.ecms.domain.blog.PostComment;
import com.guipadovan.ecms.domain.blog.PostReaction;
import com.guipadovan.ecms.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("api/v1/post")
@CrossOrigin(origins = "http://localhost:3000")
public class PostController {

    private final PostService postService;

    @Autowired
    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping(value = "/new", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> newPost(@AuthenticationPrincipal AppUser appUser, @RequestBody PostRequest postRequest) {

        postService.savePost(new Post(appUser, postRequest.title(), postRequest.subtitle(),
                postRequest.text(), LocalDateTime.now(), postRequest.locked()));

        return ResponseEntity.ok("\"" + postRequest.text() + "\" posted successfully");
    }

    @GetMapping("/all")
    public ResponseEntity<List<Post>> getPosts() {
        return ResponseEntity.of(Optional.of(postService.getPosts()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Post> getPost(@PathVariable("id") long postId) {
        return ResponseEntity.of(postService.getPost(postId));
    }

    @PutMapping(value = "/{id}/update", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> updatePost(@AuthenticationPrincipal AppUser appUser, @PathVariable("id") long postId, @RequestBody PostRequest postRequest) {

        postService.updatePost(postId, appUser, postRequest.title(),
                postRequest.subtitle(), postRequest.text(), postRequest.locked());

        return ResponseEntity.ok("\"" + postRequest.text() + "\" updated successfully");
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
    public ResponseEntity<String> newComment(@AuthenticationPrincipal AppUser appUser, @PathVariable("id") long postId, @RequestParam("comment") String comment) {

        postService.getPost(postId).ifPresentOrElse(post ->
                postService.addPostComment(post.getId(), new PostComment(appUser,
                        comment, LocalDateTime.now())), () -> {
            throw new NullPointerException("Post not found");
        });

        return ResponseEntity.ok().build();
    }

}
