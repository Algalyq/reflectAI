import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import useAppColor from "../../themed/appColor";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ForgotPasswordScreen = ({ navigation }: any) => {
  const appColor = useAppColor();
  const [username, setUsername] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");

  // Hardcoded valid username (matching the one in LoginScreen)
  const validUsername = "admin";

  const handleResetPassword = async () => {
    if (!username || !newPassword) {
      Alert.alert("Қате", "Пайдаланушы аты мен жаңа құпия сөзді енгізіңіз.");
      return;
    }

    try {
      // Check if username matches our hardcoded valid username
      if (username === validUsername) {
        // Store username in AsyncStorage (no token needed anymore)
        await AsyncStorage.setItem("username", username);
        
        // Show success message and navigate to Home
        Alert.alert(
          "Сәтті",
          "Құпия сөз сәтті жаңартылды. Енді кіре аласыз.",
          [{ text: "ОК", onPress: () => navigation.navigate("Home") }]
        );
      } else {
        // Show error for invalid username
        Alert.alert(
          "Қате",
          "Пайдаланушы аты табылмады"
        );
      }
    } catch (error: any) {
      console.log(error);
      Alert.alert(
        "Қате",
        "Құпия сөзді жаңарту сәтсіз аяқталды."
      );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: appColor.main_bg }]}>
      <Text style={[styles.title, { color: appColor.bold_text }]}>
        Құпия сөзді қалпына келтіру
      </Text>
      <Text style={[styles.subtitle, { color: appColor.text_color }]}>
        Пайдаланушы атыңызды және жаңа құпия сөзді енгізіңіз
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
        placeholder="Жаңа құпия сөз"
        placeholderTextColor={appColor.text_color}
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={[styles.resetButton, { backgroundColor: "#003087" }]}
        onPress={handleResetPassword}
      >
        <Text style={styles.buttonText}>Құпия сөзді жаңарту</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
        <Text style={[styles.backLink, { color: "#007AFF" }]}>
          Кіру экранына қайту
        </Text>
      </TouchableOpacity>
    </View>
  );
};

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
  resetButton: {
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
  backLink: {
    fontSize: 14,
    textAlign: "center",
  },
});

export default ForgotPasswordScreen;