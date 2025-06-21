package com.samuel.controller;

import com.samuel.modelo.Follows;
import com.samuel.service.FollowsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/follows")
public class FollowsController {
    @Autowired
    private FollowsService followsService;

    @PostMapping("/follow")
    public ResponseEntity<Follows> follow(@RequestParam int followerId, @RequestParam int followingId) {
        Follows follow = followsService.follow(followerId, followingId);
        if (follow == null) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(follow);
    }

    @DeleteMapping("/unfollow")
    public ResponseEntity<Void> unfollow(@RequestParam int followerId, @RequestParam int followingId) {
        followsService.unfollow(followerId, followingId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/followers/{userId}")
    public ResponseEntity<List<Follows>> getFollowers(@PathVariable int userId) {
        return ResponseEntity.ok(followsService.getFollowers(userId));
    }

    @GetMapping("/following/{userId}")
    public ResponseEntity<List<Follows>> getFollowing(@PathVariable int userId) {
        return ResponseEntity.ok(followsService.getFollowing(userId));
    }

    @GetMapping("/is-following")
    public ResponseEntity<Boolean> isFollowing(@RequestParam int followerId, @RequestParam int followingId) {
        return ResponseEntity.ok(followsService.isFollowing(followerId, followingId));
    }
}
