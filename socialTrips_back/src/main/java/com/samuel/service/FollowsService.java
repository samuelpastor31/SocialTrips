package com.samuel.service;

import com.samuel.modelo.Follows;
import com.samuel.modelo.Usuarios;
import com.samuel.repository.FollowsRepository;
import com.samuel.repository.UsuariosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class FollowsService {
    @Autowired
    private FollowsRepository followsRepository;
    @Autowired
    private UsuariosRepository usuariosRepository;

    public Follows follow(int followerId, int followingId) {
        if (followerId == followingId || followsRepository.existsByFollowerIdAndFollowingId(followerId, followingId)) {
            return null;
        }
        Usuarios follower = usuariosRepository.findById(followerId).orElse(null);
        Usuarios following = usuariosRepository.findById(followingId).orElse(null);
        if (follower == null || following == null) return null;
        Follows follow = new Follows(follower, following);
        follow.setCreatedAt(new Date());
        return followsRepository.save(follow);
    }

    @Transactional
    public void unfollow(int followerId, int followingId) {
        try {
            System.out.println("[FOLLOWS] Attempting to unfollow: followerId=" + followerId + ", followingId=" + followingId);
            followsRepository.deleteByFollowerIdAndFollowingId(followerId, followingId);
            System.out.println("[FOLLOWS] Unfollow successful (if existed)");
        } catch (Exception e) {
            System.err.println("[FOLLOWS] Error during unfollow: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    public List<Follows> getFollowers(int userId) {
        return followsRepository.findByFollowingId(userId);
    }

    public List<Follows> getFollowing(int userId) {
        return followsRepository.findByFollowerId(userId);
    }

    public boolean isFollowing(int followerId, int followingId) {
        return followsRepository.existsByFollowerIdAndFollowingId(followerId, followingId);
    }
}
