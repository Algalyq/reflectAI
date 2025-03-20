// src/components/routes/RegisterScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import useAppColor from '../../themed/appColor';

// Define the navigation stack param list (consistent with your app)
type RootStackParamList = {
  Register: undefined;
  Login: undefined;
  Home: undefined;
  Settings: undefined;
  Camera: undefined;
  InputRoute: undefined;
};

// Define props for navigation
type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

interface Props {
  navigation: RegisterScreenNavigationProp;
}

// API response type for registration
interface RegisterResponse {
  message: string;
  token: string;
}

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const appColor = useAppColor();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleRegister = async () => {
    try {
      const response = await axios.post<RegisterResponse>(
        'http://172.20.6.78:5002/register', // Replace with your IP if testing on a device
        {
          username,
          password,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      const { token } = response.data;
      navigation.navigate('Home');
      // Optionally, store the token and go to Home: navigation.replace('Home');
    } catch (error: any) {
      Alert.alert('Тіркеу сәтсіз аяқталды', error.response?.data?.message || 'Бірдеңе дұрыс болмады');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: appColor.main_bg }]}>
      <Text style={[styles.title, { color: appColor.bold_text }]}>
        Тіркелу
      </Text>
      <Text style={[styles.subtitle, { color: appColor.text_color }]}>
        Бастау үшін тіркеліңіз
      </Text>

      <TextInput
        style={[styles.input, { 
          borderColor: appColor.line_color,
          backgroundColor: appColor.search_box,
          color: appColor.bold_text,
        }]}
        placeholder="Пайдаланушы аты"
        placeholderTextColor={appColor.text_color}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={[styles.input, { 
          borderColor: appColor.line_color,
          backgroundColor: appColor.search_box,
          color: appColor.bold_text,
        }]}
        placeholder="Құпия сөз"
        placeholderTextColor={appColor.text_color}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={[styles.registerButton, { backgroundColor: '#003087' }]} // Deep blue
        onPress={handleRegister}
      >
        <Text style={styles.buttonText}>Тіркелу</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={[styles.loginLink, { color: '#007AFF' }]}>
          Есептік жазбаңыз бар ма? Кіріңіз
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  registerButton: {
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFFFFF', // White text on button
    fontSize: 18,
    fontWeight: '600',
  },
  loginLink: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default RegisterScreen;