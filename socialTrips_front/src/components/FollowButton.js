import React, { useState, useEffect } from 'react';
import { Button } from 'react-native-paper';
import axios from 'axios';
import { getApiUrl } from '../utils/api';

const FollowButton = ({ currentUserId, targetUserId, onFollowChange }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkFollowing = async () => {
      try {
        console.log('Checking if user', currentUserId, 'is following', targetUserId);
        const res = await axios.get(getApiUrl(`follows/is-following`), {
          params: { followerId: currentUserId, followingId: targetUserId },
        });
        console.log('Check following response:', res.data);
        setIsFollowing(res.data);
      } catch (err) {
        console.log('Error checking following status:', err);
        setIsFollowing(false);
      }
    };
    if (currentUserId && targetUserId && currentUserId !== targetUserId) {
      console.log('Triggering checkFollowing for', currentUserId, targetUserId);
      checkFollowing();
    }
  }, [currentUserId, targetUserId]);

  const handleFollow = async () => {
    setLoading(true);
    try {
      console.log('Attempting to follow:', { followerId: currentUserId, followingId: targetUserId });
      const res = await axios.post(getApiUrl('follows/follow'), null, {
        params: { followerId: currentUserId, followingId: targetUserId },
      });
      console.log('Follow response:', res.data);
      setIsFollowing(true);
      onFollowChange && onFollowChange(true);
    } catch (err) {
      console.log('Error following user:', err);
      alert('There was a problem trying to follow this user.');
    }
    setLoading(false);
  };

  const handleUnfollow = async () => {
    setLoading(true);
    try {
      console.log('Attempting to unfollow:', { followerId: currentUserId, followingId: targetUserId });
      const res = await axios.delete(getApiUrl('follows/unfollow'), {
        params: { followerId: currentUserId, followingId: targetUserId },
      });
      console.log('Unfollow response:', res.data);
      setIsFollowing(false);
      onFollowChange && onFollowChange(false);
    } catch (err) {
      console.log('Error unfollowing user:', err);
      alert('There was a problem trying to unfollow this user.');
    }
    setLoading(false);
  };

  if (!currentUserId || currentUserId === targetUserId) return null;

  return isFollowing ? (
    <Button mode="outlined" onPress={handleUnfollow} loading={loading} disabled={loading}>
      Unfollow
    </Button>
  ) : (
    <Button mode="contained" onPress={handleFollow} loading={loading} disabled={loading}>
      Follow
    </Button>
  );
};

export default FollowButton;
