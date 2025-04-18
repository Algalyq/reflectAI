import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { RNCamera } from 'react-native-camera';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CameraPage = () => {
  const [emotion, setEmotion] = useState('Күтудемін...');
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(7);
  const cameraRef = useRef(null);
  const navigation = useNavigation();
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startRecording = async () => {
    if (cameraRef.current && !isRecording) {
      setIsRecording(true);
      setEmotion('Жазылуда...');
      setTimer(7);

      timerRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      try {
        const options = {
          maxDuration: 7,
          quality: RNCamera.Constants.VideoQuality['720p'],
        };

        const video = await cameraRef.current.recordAsync(options);
        stopRecording();
        await processVideo(video.uri);
      } catch (error) {
        console.error('Recording error:', error);
        setEmotion('Жазба сәтсіз аяқталды');
        stopRecording();
      }
    }
  };

  const stopRecording = () => {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
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
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('Token not found');

      const response = await axios.post(
        'http://13.60.223.209/analyze_emotion',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = response.data;
      setEmotion(`Басым Эмоция: ${result.dominant_emotion}`);
      navigation.navigate('ChatPage', { result: result, fromCamera: true });
    } catch (error) {
      console.error('API error:', error);
      setEmotion('Бейнені өңдеу қатесі');
    }
  };

  return (
    <View style={styles.container}>
      <RNCamera
        ref={cameraRef}
        style={styles.camera}
        type={RNCamera.Constants.Type.front}
        captureAudio={true}
      >
        <View style={styles.emotionContainer}>
          <Text style={styles.emotionText}>{emotion}</Text>
          {isRecording && (
            <Text style={styles.timerText}>Жазу: {timer} сек</Text>
          )}
        </View>
      </RNCamera>

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
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
  },
  emotionContainer: {
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 8,
    margin: 20,
    alignItems: 'center',
  },
  emotionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  timerText: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  button: {
    margin: 20,
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
