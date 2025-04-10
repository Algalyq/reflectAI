import React, { useState } from "react";
import { View, ScrollView, StyleSheet, Animated } from "react-native";
import { Text, List, Divider, Surface, Appbar } from "react-native-paper"; // Added Appbar for header
import useAppColor from "../../themed/appColor";
import CustomView from "../../themed/CustomView";
import Icons from "../../assets/icons";
import { useNavigation } from "@react-navigation/native"; // Import navigation hook

const FAQ = () => {
  const appColor = useAppColor();
  const [expandedIds, setExpandedIds] = useState<number[]>([]);
  const navigation = useNavigation(); // Get navigation object

  const faqData = [
    {
      id: 1,
      question: "Мен парольді қалай өзгерте аламын?",
      answer: "Сіз 'Есептік жазба' бөлімінде 'Деректерді басқару' опциясы арқылы парольді өзгерте аласыз.",
    },
    {
      id: 2,
      question: "Қосымшада қанша тіл қол жетімді?",
      answer: "Қазіргі уақытта қосымша ағылшын және қазақ тілдерінде қол жетімді.",
    },
    {
      id: 3,
      question: "Мен жазылымды қалай жаңарта аламын?",
      answer: "'Жазылым' бөліміне өтіп, қол жетімді жоспарлардан таңдау жасау арқылы жазылымды жаңарта аласыз.",
    },
    {
      id: 4,
      question: "Қосымшада техникалық проблема болса, не істеу керек?",
      answer: "Егер сізде техникалық проблема болса, 'Көмек орталығы' бөліміне хабарласыңыз немесе қолдау қызметіне жазыңыз.",
    },
  ];

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <CustomView style={{ backgroundColor: appColor.page_modal_bg, flex: 1 }}>
      {/* Header with Back Button */}
      <Appbar.Header style={{ backgroundColor: appColor.main_bg }}>
        <Icons.TimesIcon
          onPress={() => navigation.goBack()}
          style={{ width: 24, height: 24, color: appColor.text_color }}
        />
        <Appbar.Content title="Жиі қойылатын сұрақтар" titleStyle={{ color: appColor.bold_text }} />
      </Appbar.Header>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {faqData.map((item) => {
          const isExpanded = expandedIds.includes(item.id);
          const rotation = isExpanded ? "0deg" : "180deg"; // Rotate 180 degrees when collapsed (down), 0deg when expanded (up)

          return (
            <Surface key={item.id} style={[styles.faqItem, { backgroundColor: appColor.main_bg }]}>
              <List.Item
                title={item.question}
                titleStyle={[styles.question, { color: appColor.text_color }]}
                onPress={() => toggleExpand(item.id)}
                right={() => (
                  <View style={styles.iconContainer}>
                    <Icons.ArrowUpIcon
                      style={[
                        styles.icon,
                        { transform: [{ rotate: rotation }], color: appColor.text_color }
                      ]}
                    />
                  </View>
                )}
              />
              {isExpanded && (
                <View style={styles.answerContainer}>
                  <Text style={[styles.answer, { color: appColor.text_color }]}>
                    {item.answer}
                  </Text>
                  <Divider style={styles.divider} />
                </View>
              )}
            </Surface>
          );
        })}

        <Text style={[styles.contact, { color: appColor.text_color }]}>
          Қосымша сұрақтарыңыз болса, 'Көмек орталығы' бөліміне хабарласыңыз.
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  faqItem: {
    borderRadius: 12,
    marginBottom: 15,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  question: {
    fontSize: 16,
    fontWeight: "600",
    paddingVertical: 12,
  },
  answerContainer: {
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  answer: {
    fontSize: 14,
    lineHeight: 20,
  },
  divider: {
    marginTop: 10,
    backgroundColor: "#E0E0E0",
    height: 1,
  },
  contact: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 20,
    paddingVertical: 10,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 10,
  },
  icon: {
    width: 24,
    height: 24,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
});

export default FAQ;