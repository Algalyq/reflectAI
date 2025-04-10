import React, { useEffect, useState } from "react";
import { View, useColorScheme, Modal, StyleSheet, Alert } from "react-native";
import { Text } from "react-native-paper";
import useAppColor from "../../themed/appColor";
import CustomView from "../../themed/CustomView";
import Icons from "../../assets/icons";
import { useNavigation } from "@react-navigation/native";
import { ListContainer, ListItem } from "../../shared/reusables";
import { Button, Menu, Divider, PaperProvider } from "react-native-paper";
import { useAppDispatch, useAppSelector } from "../../shared/hooks";
import { setAppColorMode } from "../../shared/rdx-slice";
import storage from "../../shared/storage";
import { APP_COLOR_MODE_KEY } from "../../assets/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SettingsRoute = React.memo((props: any) => {
  const appColor = useAppColor();
  const navigation = useNavigation();
  const [menuIsVisible, setMenuIsVisible] = useState<boolean>(false);
  const [languageModalVisible, setLanguageModalVisible] = useState<boolean>(false);
  const [subscriptionModalVisible, setSubscriptionModalVisible] = useState<boolean>(false);
  const [dataManagementModalVisible, setDataManagementModalVisible] = useState<boolean>(false);
  const colorScheme = useColorScheme() || "light";
  const dispatch = useAppDispatch();
  const current_app_color = useAppSelector((state) => state.main.app_mode);

  // Assume we have a username from storage or state

  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    AsyncStorage.getItem('username').then(value => {
      if (value) setUsername(value);
    });
  }, []);
  const handleSetColorMode = React.useCallback((mode?: any) => {
    const color_mode = mode ?? colorScheme;
    dispatch(setAppColorMode(color_mode));
    storage.save({ key: APP_COLOR_MODE_KEY, data: color_mode });
  }, []);

  React.useLayoutEffect(() => {
    props.navigation.setOptions({
      headerRight: (props: any) => (
        <View
          onTouchEnd={() => navigation.goBack()}
          style={{
            backgroundColor: appColor.line_color,
            borderRadius: 50,
            marginRight: 25,
            width: 30,
            height: 30,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icons.TimesIcon style={{ width: 25, height: 25 }} />
        </View>
      ),
    });
  }, [appColor]);

  const handleLanguagePress = () => {
    setLanguageModalVisible(true);
  };

  const handleSubscriptionPress = () => {
    setSubscriptionModalVisible(true);
  };

  const handleDataManagementPress = () => {
    setDataManagementModalVisible(true); // Show modal instead of navigating
  };

  const handleDataAccessAgree = () => {
    // Handle user agreement (e.g., save to storage, call API, etc.)
    Alert.alert("Сәтті", "Сіз деректерге қол жеткізуге келісім бердіңіз.", [
      { text: "ОК", onPress: () => setDataManagementModalVisible(false) },
    ]);
    // You can add logic here, like updating state, calling an API, or storing consent in storage
  };

  return (
    <CustomView style={{ backgroundColor: appColor.page_modal_bg, paddingBottom: 60 }}>
      {/* Modal for Language */}
      <Modal
        visible={languageModalVisible}
        transparent={true}
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: appColor.main_bg }]}>
            <Text style={[styles.modalText, { color: appColor.text_color }]}>
              Қазіргі уақытта тек қазақ тілі қол жетімді. Жақын арада ағылшын тілі жаңартулармен қосылады.
            </Text>
            <Button
              mode="contained"
              onPress={() => setLanguageModalVisible(false)}
              style={styles.modalButton}
              labelStyle={{ color: appColor.text_color }}
              buttonColor={appColor.line_color}
            >
              Жабу
            </Button>
          </View>
        </View>
      </Modal>

      {/* Modal for Subscription */}
      <Modal
        visible={subscriptionModalVisible}
        transparent={true}
        onRequestClose={() => setSubscriptionModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: appColor.main_bg }]}>
            <Text style={[styles.modalText, { color: appColor.text_color }]}>
              Жазылым бойынша жаңартулар әлі жоқ. Жақын арада жаңа жоспарлар қосылады.
            </Text>
            <Button
              mode="contained"
              onPress={() => setSubscriptionModalVisible(false)}
              style={styles.modalButton}
              labelStyle={{ color: appColor.text_color }}
              buttonColor={appColor.line_color}
            >
              Жабу
            </Button>
          </View>
        </View>
      </Modal>

      {/* Modal for Data Management */}
      <Modal
        visible={dataManagementModalVisible}
        transparent={true}
        onRequestClose={() => setDataManagementModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: appColor.main_bg }]}>
            <Text style={[styles.modalText, { color: appColor.text_color }]}>
              Сіз сервердегі деректерге қол жеткізуге рұқсат беруіңізді сұраймыз. Бұл деректер қосымшаның тиімді жұмыс істеуі үшін қажет. Рұқсат бересіз бе?
            </Text>
            <View style={styles.modalButtons}>
              <Button
                mode="contained"
                onPress={handleDataAccessAgree}
                style={[styles.modalButton, { marginRight: 10 }]}
                labelStyle={{ color: appColor.text_color }}
                buttonColor={appColor.line_color}
              >
                Келісу
              </Button>
              <Button
                mode="outlined"
                onPress={() => setDataManagementModalVisible(false)}
                style={styles.modalButton}
                labelStyle={{ color: appColor.text_color }}
                textColor={appColor.text_color}
              >
                Жабу
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      <View style={{ paddingHorizontal: 15, marginBottom: 20 }}>
        <Text style={{ textTransform: "uppercase", color: appColor.text_color, padding: 10 }}>
          Есептік жазба
        </Text>
        <ListContainer>
          <ListItem
            icon={<Icons.EmailIcon style={{ width: 25, height: 25 }} />}
            title="Пайдаланушы аты"
            label={username}
          />
          <ListItem
            icon={<Icons.PlusSquareIcon style={{ width: 25, height: 25 }} />}
            onPress={handleSubscriptionPress}
            title="Жазылым"
            label="Тегін жоспар"
          />
          <ListItem
            subContentStyle={{ borderBottomWidth: 0, borderBottomColor: "transparent" }}
            icon={<Icons.DatabaseIcon style={{ width: 25, height: 25 }} />}
            hasPage={true}
            onPress={handleDataManagementPress}
            title="Деректерді басқару"
            label=""
          />
        </ListContainer>
      </View>

      <View style={{ paddingHorizontal: 15, marginBottom: 20 }}>
        <Text style={{ textTransform: "uppercase", color: appColor.text_color, padding: 10 }}>
          Қосымша
        </Text>
        <ListContainer>
          <ListItem
            icon={<Icons.GlobeIcon style={{ width: 25, height: 25 }} />}
            onPress={handleLanguagePress}
            title="Қосымша тілі"
            label="Ағылшын"
          />
          <ListItem
            onPress={() => null}
            subContentStyle={{ borderBottomWidth: 0, borderBottomColor: "transparent" }}
            icon={<Icons.ColorIcon style={{ width: 25, height: 25 }} />}
            title="Түс схемасы"
            label={
              <Menu
                visible={menuIsVisible}
                elevation={3}
                contentStyle={{
                  backgroundColor: appColor.main_bg,
                  elevation: 0,
                  shadowColor: "transparent",
                  borderRadius: 10,
                  width: 200,
                }}
                onDismiss={() => setMenuIsVisible(false)}
                anchor={
                  <View onTouchEnd={() => setMenuIsVisible(true)}>
                    <Text
                      style={{
                        fontSize: 18,
                        color: appColor.text_color,
                        textTransform: "capitalize",
                      }}
                    >
                      {current_app_color === "system"
                        ? "Жүйе"
                        : current_app_color === "dark"
                        ? "Қараңғы"
                        : "Жарық"}
                    </Text>
                  </View>
                }
              >
                <Menu.Item
                  onPress={() => handleSetColorMode("system")}
                  titleStyle={{
                    fontSize: 18,
                    color: current_app_color == "system" ? "yellowgreen" : appColor.bold_text,
                  }}
                  title="Жүйе"
                />
                <Divider />
                <Menu.Item
                  onPress={() => handleSetColorMode("dark")}
                  titleStyle={{
                    fontSize: 18,
                    color: current_app_color == "dark" ? "yellowgreen" : appColor.bold_text,
                  }}
                  title="Қараңғы"
                />
                <Divider />
                <Menu.Item
                  onPress={() => handleSetColorMode("light")}
                  titleStyle={{
                    fontSize: 18,
                    color: current_app_color == "light" ? "yellowgreen" : appColor.bold_text,
                  }}
                  title="Жарық"
                />
              </Menu>
            }
          />
        </ListContainer>
      </View>

      <View style={{ paddingHorizontal: 15, marginBottom: 20 }}>
        <Text style={{ textTransform: "uppercase", color: appColor.text_color, padding: 10 }}>
          Сөйлеу
        </Text>
        <ListContainer>
          <ListItem
            subContentStyle={{ borderBottomWidth: 0, borderBottomColor: "transparent" }}
            icon={<Icons.GlobeIcon style={{ width: 25, height: 25 }} />}
            title="Негізгі тіл"
            label="Авто-анықтау"
          />
        </ListContainer>
      </View>

      <View style={{ paddingHorizontal: 15, marginBottom: 20 }}>
        <Text style={{ textTransform: "uppercase", color: appColor.text_color, padding: 10 }}>
          Туралы
        </Text>
        <ListContainer>
          <ListItem
            icon={<Icons.HelpIcon style={{ width: 25, height: 25 }} />}
            onPress={() => props.navigation.navigate("FAQ")}
            title="Көмек орталығы"
            label=""
          />
          <ListItem
            icon={<Icons.PadlockIcon style={{ width: 25, height: 25 }} />}
            onPress={() => props.navigation.navigate("PrivacyPolicy")}
            title="Құпиялылық саясаты"
            label=""
          />
        </ListContainer>
      </View>

      <View style={{ paddingHorizontal: 15, marginBottom: 20 }}>
        <ListContainer>
          <ListItem
            subContentStyle={{ borderBottomWidth: 0, borderBottomColor: "transparent" }}
            icon={<Icons.LogoutIcon style={{ width: 20, height: 20 }} />}
            title="Шығу"
            label=""
          />
        </ListContainer>
      </View>
    </CustomView>
  );
});

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  modalButton: {
    flex: 1,
    borderRadius: 5,
  },
});

export default SettingsRoute;