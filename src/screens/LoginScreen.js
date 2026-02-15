import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, Snackbar } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { setUser } from '../store/authSlice';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  const handleAuth = async () => {
    try {
      let userCredential;
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }
      dispatch(setUser({ uid: userCredential.user.uid, email: userCredential.user.email }));
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Text variant="headlineLarge" style={styles.title}>📸 SocialFeed</Text>
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          secureTextEntry
          style={styles.input}
        />
        <Button mode="contained" onPress={handleAuth} style={styles.button}>
          {isSignUp ? 'Sign Up' : 'Login'}
        </Button>
        <Button onPress={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? 'Already have account? Login' : 'Need account? Sign Up'}
        </Button>
      </View>
      <Snackbar visible={!!error} onDismiss={() => setError('')} duration={3000}>
        {error}
      </Snackbar>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { textAlign: 'center', marginBottom: 40, fontWeight: 'bold' },
  input: { marginBottom: 16 },
  button: { marginVertical: 16 },
});
