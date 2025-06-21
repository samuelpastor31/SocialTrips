package com.samuel.modelo;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "follows")
public class Follows implements java.io.Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    private int id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "follower_id", nullable = false)
    private Usuarios follower;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "following_id", nullable = false)
    private Usuarios following;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at", nullable = false)
    private Date createdAt = new Date();

    public Follows() {}

    public Follows(Usuarios follower, Usuarios following) {
        this.follower = follower;
        this.following = following;
        this.createdAt = new Date();
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public Usuarios getFollower() { return follower; }
    public void setFollower(Usuarios follower) { this.follower = follower; }

    public Usuarios getFollowing() { return following; }
    public void setFollowing(Usuarios following) { this.following = following; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }
}
