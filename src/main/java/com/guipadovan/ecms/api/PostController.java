package com.guipadovan.ecms.api;

import com.guipadovan.ecms.api.request.PostRequest;
import com.guipadovan.ecms.domain.AppUser;
import com.guipadovan.ecms.domain.Permission;
import com.guipadovan.ecms.domain.blog.Post;
import com.guipadovan.ecms.domain.blog.PostComment;
import com.guipadovan.ecms.domain.blog.PostReaction;
import com.guipadovan.ecms.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
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
    public ResponseEntity<String> newPost(@AuthenticationPrincipal AppUser appUser, @RequestBody PostRequest postRequest) {

        if (!appUser.hasPermission(Permission.ACCESS_ADD_POST) || appUser.isLocked())
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No permission");

        postService.savePost(new Post(appUser, postRequest.title(), postRequest.subtitle(),
                postRequest.text(), LocalDateTime.now(), postRequest.locked()));

        return ResponseEntity.ok("\"" + postRequest.text() + "\" posted successfully");
    }

    @GetMapping("/posts")
    public ResponseEntity<Page<Post>> getPosts(@RequestParam Optional<String> title, @RequestParam Optional<Integer> page, @RequestParam Optional<Integer> size) {
        return ResponseEntity.ok(postService.getPosts(title.orElse(""), page.orElse(0), size.orElse(10)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Post> getPost(@PathVariable("id") long postId) {
        return ResponseEntity.of(postService.getPost(postId));
    }

    @PutMapping(value = "/{id}/update", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> updatePost(@AuthenticationPrincipal AppUser appUser, @PathVariable("id") long postId, @RequestBody PostRequest postRequest) {

        if (!appUser.hasPermission(Permission.POST_EDIT) || appUser.isLocked())
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No permission");

        postService.updatePost(postId, appUser, postRequest.title(),
                postRequest.subtitle(), postRequest.text(), postRequest.locked());

        return ResponseEntity.ok("\"" + postRequest.text() + "\" updated successfully");
    }

    @PostMapping(value = "/{id}/reaction", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> newReaction(@AuthenticationPrincipal AppUser appUser, @PathVariable("id") long postId, @RequestParam("reaction") long reactionId) {

        if (!appUser.hasPermission(Permission.POST_REACT) || appUser.isLocked())
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No permission");

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

        if (!appUser.hasPermission(Permission.POST_COMMENT) || appUser.isLocked())
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No permission");

        postService.getPost(postId).ifPresentOrElse(post ->
                postService.addPostComment(post.getId(), new PostComment(appUser,
                        comment, LocalDateTime.now())), () -> {
            throw new NullPointerException("Post not found");
        });

        return ResponseEntity.ok().build();
    }

}
