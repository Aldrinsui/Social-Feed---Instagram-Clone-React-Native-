import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, IconButton, Avatar } from 'react-native-paper';
import { Image } from 'expo-image';
import { doc, updateDoc, increment, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useSelector } from 'react-redux';

export default function PostCard({ post }) {
  const user = useSelector(state => state.auth.user);
  const isLiked = post.likedBy?.includes(user?.uid);

  const handleLike = async () => {
    const postRef = doc(db, 'posts', post.id);
    if (isLiked) {
      await updateDoc(postRef, {
        likes: increment(-1),
        likedBy: arrayRemove(user.uid),
      });
    } else {
      await updateDoc(postRef, {
        likes: increment(1),
        likedBy: arrayUnion(user.uid),
      });
    }
  };

  return (
    <Card style={styles.card}>
      <Card.Title
        title={post.userEmail}
        left={(props) => <Avatar.Text {...props} size={40} label={post.userEmail?.[0]?.toUpperCase()} />}
      />
      <Image source={{ uri: post.imageUrl }} style={styles.image} contentFit="cover" />
      <Card.Content>
        <View style={styles.actions}>
          <IconButton
            icon={isLiked ? 'heart' : 'heart-outline'}
            iconColor={isLiked ? '#e91e63' : '#000'}
            size={28}
            onPress={handleLike}
          />
          <Text variant="bodyLarge">{post.likes || 0} likes</Text>
        </View>
        <Text variant="bodyMedium">
          <Text style={styles.username}>{post.userEmail?.split('@')[0]} </Text>
          {post.caption}
        </Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginVertical: 8, marginHorizontal: 8 },
  image: { width: '100%', height: 400 },
  actions: { flexDirection: 'row', alignItems: 'center', marginVertical: 8 },
  username: { fontWeight: 'bold' },
});
