import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { TextInput, Button, Text, Chip } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { addPost } from '../store/postsSlice';
import { Image } from 'expo-image';

const SAMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=800',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800',
  'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=800',
  'https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=800',
];

export default function CreatePostScreen({ navigation }) {
  const [caption, setCaption] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [posting, setPosting] = useState(false);
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();

  const handlePost = async () => {
    if (!imageUrl.trim() || !caption.trim()) {
      Alert.alert('Error', 'Please add both image URL and caption');
      return;
    }

    setPosting(true);
    try {
      const newPost = {
        caption,
        imageUrl: imageUrl.trim(),
        userId: user.uid,
        userEmail: user.email,
        likes: 0,
        likedBy: [],
        comments: [],
        timestamp: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'posts'), newPost);
      dispatch(addPost({ id: docRef.id, ...newPost }));
      
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setPosting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text variant="titleMedium" style={styles.label}>Image URL:</Text>
      <TextInput
        value={imageUrl}
        onChangeText={setImageUrl}
        mode="outlined"
        placeholder="Paste image URL here"
        style={styles.input}
        autoCapitalize="none"
      />

      <Text variant="bodySmall" style={styles.hint}>Or choose a sample image:</Text>
      <View style={styles.samplesContainer}>
        {SAMPLE_IMAGES.map((url, index) => (
          <Chip
            key={index}
            selected={imageUrl === url}
            onPress={() => setImageUrl(url)}
            style={styles.chip}
          >
            Image {index + 1}
          </Chip>
        ))}
      </View>

      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.preview} contentFit="cover" />
      ) : null}

      <Text variant="titleMedium" style={styles.label}>Caption:</Text>
      <TextInput
        value={caption}
        onChangeText={setCaption}
        mode="outlined"
        multiline
        numberOfLines={4}
        placeholder="Write a caption..."
        style={styles.input}
      />

      <Button 
        mode="contained" 
        onPress={handlePost}
        loading={posting}
        disabled={posting || !imageUrl || !caption}
        style={styles.button}
      >
        Post
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  label: { marginTop: 16, marginBottom: 8, fontWeight: 'bold' },
  input: { marginBottom: 8 },
  hint: { color: '#666', marginVertical: 8 },
  samplesContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
  chip: { margin: 4 },
  preview: { width: '100%', height: 300, marginVertical: 16, borderRadius: 8 },
  button: { marginVertical: 16 },
});
