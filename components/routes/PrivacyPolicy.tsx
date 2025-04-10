import React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Text, Appbar } from "react-native-paper";
import useAppColor from "../../themed/appColor";
import CustomView from "../../themed/CustomView";
import Icons from "../../assets/icons";
import { useNavigation } from "@react-navigation/native"; // For back navigation

const PrivacyPolicy = () => {
  const appColor = useAppColor();
  const navigation = useNavigation(); // Get navigation object for back button

  return (
    <CustomView style={{ backgroundColor: appColor.page_modal_bg, flex: 1 }}>
      {/* Header with Back Button */}
      <Appbar.Header style={{ backgroundColor: appColor.main_bg }}>
        <Icons.TimesIcon
          onPress={() => navigation.goBack()}
          style={{ width: 24, height: 24, color: appColor.text_color }}
        />
        <Appbar.Content title="Құпиялылық саясаты" titleStyle={{ color: appColor.bold_text }} />
      </Appbar.Header>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Introduction */}
        <Text style={[styles.sectionTitle, { color: appColor.bold_text }]}>
          Құпиялылық саясаты
        </Text>
        <Text style={[styles.paragraph, { color: appColor.text_color }]}>
          Біздің қосымшамызда сіздің құпиялылығыңыз бен деректеріңіздің қауіпсіздігі ең маңызды. Бұл саясатта біз қандай деректерді жинаймыз, оларды қалай пайдаланамыз және қорғаймыз туралы айтылады.
        </Text>

        {/* Sections */}
        <Text style={[styles.subTitle, { color: appColor.bold_text }]}>
          1. Жиналатын деректер
        </Text>
        <Text style={[styles.paragraph, { color: appColor.text_color }]}>
          - Электрондық пошта
          {'\n'}- Қолданушы аты
          {'\n'}- Қосымша ішіндегі әрекеттер
        </Text>

        <Text style={[styles.subTitle, { color: appColor.bold_text }]}>
          2. Деректерді пайдалану
        </Text>
        <Text style={[styles.paragraph, { color: appColor.text_color }]}>
          Жиналған деректер қосымшаның тиімді жұмыс істеуі және сізге жақсырақ қызмет көрсету үшін қолданылады.
        </Text>

        <Text style={[styles.subTitle, { color: appColor.bold_text }]}>
          3. Деректерді қорғау
        </Text>
        <Text style={[styles.paragraph, { color: appColor.text_color }]}>
          Барлық жеке деректер сенімді шифрланған серверлерде сақталады және тек авторизацияланған персонал ғана қол жеткізе алады.
        </Text>

        {/* Contact Info */}
        <Text style={[styles.contact, { color: appColor.text_color }]}>
          Егер сізде қосымшаның құпиялылық саясаты бойынша қосымша сұрақтарыңыз болса, "Көмек орталығы" бөліміне хабарласыңыз.
        </Text>
      </ScrollView>
    </CustomView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    flex: 1,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 15,
  },
  contact: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 20,
    paddingVertical: 10,
  },
});

export default PrivacyPolicy; 