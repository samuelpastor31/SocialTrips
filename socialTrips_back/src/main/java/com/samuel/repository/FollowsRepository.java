package com.samuel.repository;

import com.samuel.modelo.Follows;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FollowsRepository extends JpaRepository<Follows, Integer> {
    List<Follows> findByFollowerId(int followerId);
    List<Follows> findByFollowingId(int followingId);
    boolean existsByFollowerIdAndFollowingId(int followerId, int followingId);
    void deleteByFollowerIdAndFollowingId(int followerId, int followingId);
}
