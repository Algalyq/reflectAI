import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { RNCamera } from 'react-native-camera';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const CameraPage = () => {
  const [emotion, setEmotion] = useState('Күтудемін...');
  const navigation = useNavigation();
  const [isRecording, setIsRecording] = useState(false);
  const cameraRef = useRef(null);

  const startRecording = async () => {
    if (cameraRef.current && !isRecording) {
      setIsRecording(true);
      setEmotion('Жазылуда...');
      try {
        const video = await cameraRef.current.recordAsync({
          maxDuration: 7, // Record for 7 seconds
          quality: RNCamera.Constants.VideoQuality['720p'],
        });
        setIsRecording(false);
        await processVideo(video.uri);
      } catch (error) {
        console.error('Recording error:', error);
        setEmotion('Жазба сәтсіз аяқталды');
        setIsRecording(false);
      }
    }
  };

  const processVideo = async (videoUri) => {
    setEmotion('Өңделуде...');
    const formData = new FormData();
    formData.append('video', {
      uri: videoUri,
      type: 'video/mp4',
      name: 'video.mp4',
    });

    try {
      const response = await axios.post('http://172.20.6.78:5001/analyze_emotion', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const result = response.data;
      setEmotion(`Басым Эмоция: ${result.dominant_emotion}`);
      navigation.navigate('ChatPage', { result: result, fromCamera: true });
    } catch (error) {
      console.error('API error:', error);
      setEmotion('Бейнені өңдеу қатесі');
    }
  };

  const stopRecording = () => {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
      setIsRecording(false);
    }
  };

  return (
    <View style={styles.container}>
      <RNCamera
        ref={cameraRef}
        style={styles.camera}
        type={RNCamera.Constants.Type.front}
        captureAudio={false}
        androidCameraPermissionOptions={{
          title: 'Камераны пайдалануға рұқсат',
          message: 'Камераңызды пайдалану үшін сіздің рұқсатыңыз қажет',
          buttonPositive: 'Жарайды',
          buttonNegative: 'Бас тарту',
        }}
      />
      <View style={styles.emotionContainer}>
        <Text style={styles.emotionText}>{emotion}</Text>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={isRecording ? stopRecording : startRecording}
      >
        <Text style={styles.buttonText}>
          {isRecording ? 'Жазуды Тоқтату' : 'Жазуды Бастау'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  camera: {
    flex: 0.7,
    width: '100%',
  },
  emotionContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
  },
  emotionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  button: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#007bff',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CameraPage;