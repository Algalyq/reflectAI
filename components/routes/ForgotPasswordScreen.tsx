import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";
import useAppColor from "../../themed/appColor";

const ForgotPasswordScreen = ({ navigation }: any) => {
  const appColor = useAppColor();
  const [username, setUsername] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");

  const handleResetPassword = async () => {
    if (!username || !newPassword) {
      Alert.alert("Қате", "Пайдаланушы аты мен жаңа құпия сөзді енгізіңіз.");
      return;
    }

    try {
      // Simulate API call to reset password (replace with your actual endpoint)
      const response = await axios.post(
        "http://13.60.223.209/reset-password", // Replace with your actual reset password endpoint
        { username, newPassword }
      );

      Alert.alert(
        "Сәтті",
        "Құпия сөз сәтті жаңартылды. Енді кіре аласыз.",
        [{ text: "ОК", onPress: () => navigation.navigate("LoginScreen") }]
      );
    } catch (error: any) {
      console.log(error);
      Alert.alert(
        "Қате",
        error.response?.data?.message || "Құпия сөзді жаңарту сәтсіз аяқталды."
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