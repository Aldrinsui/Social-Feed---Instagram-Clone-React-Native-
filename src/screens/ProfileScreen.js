import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Avatar, Card } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { logout } from '../store/authSlice';

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const posts = useSelector(state => state.posts.posts);
  const userPosts = posts.filter(p => p.userId === user?.uid);

  const handleLogout = async () => {
    await signOut(auth);
    dispatch(logout());
  };

  const totalLikes = userPosts.reduce((sum, post) => sum + (post.likes || 0), 0);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar.Text size={100} label={user?.email?.[0]?.toUpperCase() || 'U'} />
        <Text variant="headlineSmall" style={styles.email}>{user?.email}</Text>
        
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text variant="headlineMedium">{userPosts.length}</Text>
            <Text variant="bodyMedium">Posts</Text>
          </View>
          <View style={styles.stat}>
            <Text variant="headlineMedium">{totalLikes}</Text>
            <Text variant="bodyMedium">Likes</Text>
          </View>
        </View>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium">Account Info</Text>
          <Text variant="bodyMedium" style={styles.info}>Email: {user?.email}</Text>
          <Text variant="bodyMedium" style={styles.info}>User ID: {user?.uid?.slice(0, 8)}...</Text>
        </Card.Content>
      </Card>
      
      <Button mode="contained" onPress={handleLogout} style={styles.button}>
        Logout
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { alignItems: 'center', padding: 32 },
  email: { marginTop: 16, marginBottom: 8 },
  stats: { flexDirection: 'row', marginTop: 24, gap: 40 },
  stat: { alignItems: 'center' },
  card: { margin: 16 },
  info: { marginTop: 8, color: '#666' },
  button: { margin: 16 },
});
