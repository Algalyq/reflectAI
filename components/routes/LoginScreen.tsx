import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationProps } from "../../shared/types";
import useAppColor from "../../themed/appColor";

const LoginScreen = React.memo((props: any) => {
  const { navigation } = props;
  const appColor = useAppColor();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // Hardcoded credentials
  const validCredentials = {
    username: "admin",
    password: "password123"
  };

  const handleLogin = async () => {
    try {
      // Check if credentials match hardcoded values
      if (username === validCredentials.username && password === validCredentials.password) {
        // Store username in AsyncStorage (no token needed anymore)
        await AsyncStorage.setItem("username", username);
        
        // Navigate to Home screen on successful login
        navigation.navigate("Home");
      } else {
        // Show error for invalid credentials
        Alert.alert(
          "Кіру сәтсіз аяқталды",
          "Пайдаланушы аты немесе құпия сөз дұрыс емес"
        );
      }
    } catch (error: any) {
      console.log(error);
      Alert.alert(
        "Кіру сәтсіз аяқталды",
        "Бірдеңе дұрыс болмады"
      );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: appColor.main_bg }]}>
      <Text style={[styles.title, { color: appColor.bold_text }]}>
        Қош келдіңіз
      </Text>
      <Text style={[styles.subtitle, { color: appColor.text_color }]}>
        Есептік жазбаңызға кіріңіз
      </Text>

      <TextInput
        style={[
          styles.input,
          {
            borderColor: appColor.line_color,
            backgroundColor: appColor.search_box,
            color: appColor.bold_text,
          },
        ]}
        placeholder="Пайдаланушы аты"
        placeholderTextColor={appColor.text_color}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={[
          styles.input,
          {
            borderColor: appColor.line_color,
            backgroundColor: appColor.search_box,
            color: appColor.bold_text,
          },
        ]}
        placeholder="Құпия сөз"
        placeholderTextColor={appColor.text_color}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={[styles.loginButton, { backgroundColor: "#003087" }]} // Fixed blue for button
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>Кіру</Text>
      </TouchableOpacity>

      {/* Forgot Password Link */}
      <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
        <Text style={[styles.forgotPasswordLink, { color: "#007AFF" }]}>
          Құпия сөзді ұмыттыңыз ба?
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Registration")}>
        <Text style={[styles.registerLink, { color: "#007AFF" }]}>
          Есептік жазбаңыз жоқ па? Тіркеліңіз
        </Text>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
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
  loginButton: {
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#FFFFFF", // White text on button
    fontSize: 18,
    fontWeight: "600",
  },
  forgotPasswordLink: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },
  registerLink: {
    fontSize: 14,
    textAlign: "center",
  },
});

export { LoginScreen };
export default LoginScreen;