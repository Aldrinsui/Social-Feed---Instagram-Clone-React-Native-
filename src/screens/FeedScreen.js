import React, { useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { ActivityIndicator, FAB, Text } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { setPosts, setLoading } from '../store/postsSlice';
import PostCard from '../components/PostCard';

export default function FeedScreen({ navigation }) {
  const dispatch = useDispatch();
  const { posts, loading } = useSelector(state => state.posts);
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    dispatch(setLoading(true));
    const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      dispatch(setPosts(postsData));
      dispatch(setLoading(false));
      setRefreshing(false);
    });

    return () => unsubscribe();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
  }, []);

  const renderPost = useCallback(({ item }) => (
    <PostCard post={item} key={item.id} />
  ), []);

  const getItemKey = useCallback((item) => item.id, []);

  if (loading && posts.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (posts.length === 0 && !loading) {
    return (
      <View style={styles.center}>
        <Text variant="headlineSmall">No posts yet!</Text>
        <Text variant="bodyMedium" style={styles.hint}>Tap + to create your first post</Text>
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => navigation.navigate('CreatePost')}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={getItemKey}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        windowSize={10}
        maxToRenderPerBatch={10}
        initialNumToRender={10}
        removeClippedSubviews={true}
        extraData={posts}
      />
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('CreatePost')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  hint: { marginTop: 8, color: '#666', textAlign: 'center' },
  fab: { position: 'absolute', right: 16, bottom: 16 },
});
