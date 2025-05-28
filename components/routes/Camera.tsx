import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { useNavigation } from '@react-navigation/native';
import RNFS from 'react-native-fs';
import { StackNavigationProp } from '@react-navigation/stack';
import { PermissionsAndroid } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

type RNCameraType = RNCamera & {
  takePictureAsync: (options: any) => Promise<{uri: string}>;
};

type EmotionResult = {
  dominant_emotion: string;
  emotion_distribution: {
    happy: number;
    neutral: number;
    sad: number;
    angry: number;
    surprised: number;
  };
};

const CameraPage = () => {
  const [emotion, setEmotion] = useState('Күтудемін...');
  const [isCapturing, setIsCapturing] = useState(false);
  const [timer, setTimer] = useState(7);
  const [serverIp, setServerIp] = useState('172.20.10.2'); // Default IP address
  const cameraRef = useRef<RNCameraType | null>(null);
  const navigation = useNavigation<StackNavigationProp<any>>();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Request storage permissions on Android
    const requestStoragePermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: 'Storage Permission',
              message: 'This app needs access to storage to save images.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            Alert.alert('Error', 'Storage permission denied. Cannot save images.');
          }
        } catch (err) {
          console.warn('Permission error:', err);
        }
      }
    };

    requestStoragePermission();
    // Get device IP address
    getDeviceIpAddress();
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Function to get the device IP address
  const getDeviceIpAddress = async () => {
    try {
      const state = await NetInfo.fetch();
      if (state.type === 'wifi' && state.details && state.details.ipAddress) {
        console.log('Device IP address:', state.details.ipAddress);
        setServerIp(state.details.ipAddress);
      } else {
        console.log('Unable to get IP address or not on WiFi, using default IP');
      }
    } catch (error) {
      console.error('Error getting IP address:', error);
    }
  };

  const startCapture = async () => {
    if (cameraRef.current && !isCapturing) {
      setIsCapturing(true);
      setEmotion('Дайындалуда...');
      setTimer(7);

      // Start a countdown timer
      timerRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 4) {
            if (timerRef.current) {
              clearInterval(timerRef.current);
            }
            captureImage();
            return prev - 1; // Continue countdown for UI
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const captureImage = async () => {
    if (cameraRef.current) {
      try {
        const options = {
          quality: 0.85,
          fixOrientation: true,
          forceUpOrientation: true,
        };

        const data = await cameraRef.current.takePictureAsync(options);
        const imagePath = await saveImage(data.uri);
        setIsCapturing(false);
        await processImage(data.uri, imagePath);
      } catch (error) {
        console.error('Capture error:', error);
        setEmotion('Суретке түсіру сәтсіз аяқталды');
        setIsCapturing(false);
        Alert.alert('Error', 'Failed to capture image.');
      }
    }
  };

  const saveImage = async (imageUri: string): Promise<string> => {
    try {
      const imageName = `emotion_capture_${Date.now()}.jpg`;
      const imgDir = `${RNFS.DocumentDirectoryPath}/model/img`;
      const destPath = `${imgDir}/${imageName}`;

      // Create directory if it doesn't exist
      const dirExists = await RNFS.exists(imgDir);
      if (!dirExists) {
        await RNFS.mkdir(imgDir);
      }

      // Save the image
      await RNFS.copyFile(imageUri, destPath);
      console.log(`Image saved to: ${destPath}`);
      return destPath;
    } catch (error) {
      console.error('Error saving image:', error);
      Alert.alert('Error', 'Failed to save image to model/img.');
      throw error;
    }
  };

  const processImage = async (imageUri: string, imagePath: string): Promise<void> => {
    try {
      setEmotion('Өңделуде...');

      // Create FormData to send the image file
      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        name: 'image.jpg',
        type: 'image/jpeg',
      });

      // Send the image to the Flask server
      const result = await callEmotionAnalysisServer(formData);

      // Update UI and navigate to results
      setEmotion(`Басым Эмоция: ${result.dominant_emotion}`);
      navigation.navigate('ChatPage', { result, imagePath, fromCamera: true });
    } catch (error) {
      console.error('Processing error:', error);
      setEmotion('Суретті өңдеу қатесі');
      Alert.alert('Error', 'Failed to process image.');
    }
  };

  const callEmotionAnalysisServer = async (formData: FormData): Promise<EmotionResult> => {
    try {
      const serverUrl = `http://${serverIp}:5001/analyze`;
      console.log('Using server URL:', serverUrl);
      const response = await fetch(serverUrl, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server error: ${errorText}`);
      }

      // Read response body once and parse it
      const text = await response.text();
      console.log('Response:', text);
      const data = JSON.parse(text);
      console.log('Data:', data);

      // Check if faces array exists and is non-empty
      if (!data.faces || !Array.isArray(data.faces) || data.faces.length === 0) {
        throw new Error('No faces detected in the image');
      }

      // Map the response to EmotionResult
      const face = data.faces[0];
      return {
        dominant_emotion: face.dominant_emotion,
        emotion_distribution: {
          happy: face.emotion.happy,
          neutral: face.emotion.neutral,
          sad: face.emotion.sad,
          angry: face.emotion.angry,
          surprised: face.emotion.surprise,
        },
      };
    } catch (error) {
      console.error('Error calling emotion analysis server:', error);
      Alert.alert('Error', `Failed to analyze emotion: ${error.message}`);
      return {
        dominant_emotion: 'unknown',
        emotion_distribution: {
          happy: 0,
          neutral: 0,
          sad: 0,
          angry: 0,
          surprised: 0,
        },
      };
    }
  };

  return (
    <View style={styles.container}>
      <RNCamera
        ref={cameraRef}
        style={styles.camera}
        type={RNCamera.Constants.Type.front}
        captureAudio={false}
      >
        <View style={styles.emotionContainer}>
          <Text style={styles.emotionText}>{emotion}</Text>
          {isCapturing && (
            <Text style={styles.timerText}>Дайындалуда: {timer} сек</Text>
          )}
        </View>
      </RNCamera>

      <TouchableOpacity
        style={styles.button}
        onPress={isCapturing ? undefined : startCapture}
        disabled={isCapturing}
      >
        <Text style={styles.buttonText}>
          {isCapturing ? 'Түсірілуде...' : 'Суретке түсіру'}
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