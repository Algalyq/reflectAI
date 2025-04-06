import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  SafeAreaView,
  TouchableOpacity, TextInput,useColorScheme,Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createDrawerNavigator, DrawerItem } from '@react-navigation/drawer';
import { DrawerActions, useNavigation } from '@react-navigation/native'; // Import useNavigation
import useAppColor from '../../themed/appColor';
import Icons from '../../assets/icons'; // Assuming this exists in your project

import { useAppDispatch, useAppSelector } from "../../shared/hooks";
import { clearMessages } from "../../shared/rdx-slice";

const Drawer = createDrawerNavigator();

// Main Advice Content Component
const AdviceContent: React.FC = () => {
  const appColor = useAppColor();
  return (
<SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Эмоциялық Саулық</Text>
          <Text style={styles.headerSubtitle}>
            Сезімдеріңізді реттеудің жеңіл жолдары
          </Text>
        </View>

        <View style={styles.content}>
          {/* Advice Item 1 */}
          <View style={styles.adviceItem}>
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>🌬️</Text>
            </View>
            <View style={styles.adviceContent}>
              <Text style={styles.adviceTitle}>Терең Тыныс Алу</Text>
              <Text style={styles.adviceText}>
                5 минут бойы:
                - 4 секунд дем алыңыз
                - 4 секунд ұстаңыз
                - 4 секунд дем шығарыңыз
              </Text>
            </View>
          </View>

          {/* Advice Item 2 */}
          <View style={styles.adviceItem}>
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>👀</Text>
            </View>
            <View style={styles.adviceContent}>
              <Text style={styles.adviceTitle}>Зейінді Сәт</Text>
              <Text style={styles.adviceText}>
                Байқаңыз:
                - 5 нәрсе көріңіз
                - 4 нәрсе сезіңіз
                - 3 нәрсе естіңіз
              </Text>
            </View>
          </View>

          {/* Advice Item 3 */}
          <View style={styles.adviceItem}>
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>🏃</Text>
            </View>
            <View style={styles.adviceContent}>
              <Text style={styles.adviceTitle}>Қозғалыс</Text>
              <Text style={styles.adviceText}>
                Жеңіл әрекет:
                - Серуендеңіз
                - Созылыңыз
                - Билеңіз
              </Text>
            </View>
          </View>

          {/* Advice Item 4 */}
          <View style={styles.adviceItem}>
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>✍️</Text>
            </View>
            <View style={styles.adviceContent}>
              <Text style={styles.adviceTitle}>Эмоцияны Білдіру</Text>
              <Text style={styles.adviceText}>
                Өз ойыңызды:
                - Жазыңыз
                - Айтыңыз
                - Салыңыз
              </Text>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              "Өз сезімдеріңізді қабылдаңыз – бұл сіздің күшіңіз."
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Drawer Navigator for EmotionAdviceScreen
const EmotionAdviceScreen  = React.memo((props: any) => {
  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    AsyncStorage.getItem('username').then(value => {
      if (value) setUsername(value);
    });
  }, []);
  const appColor = useAppColor();
  const navigation = useNavigation(); // Use the navigation hook

  const app_color_mode = useAppSelector(state => state.main.app_mode);
  const system_color_mode = useColorScheme() || 'light';

  const current_page = useAppSelector(state => state.main.active_drawer_route)
  const dispatch = useAppDispatch()

  return (
            <Drawer.Navigator drawerContent={(drawerProps) => {
                console.log("drawerProps", Object.keys(drawerProps.descriptors));
                
                return <SafeAreaView style={{flex: 1}}>
                    
                        <View style={{flexDirection: 'row', marginBottom: 10, position: 'relative', alignItems: 'center', justifyContent: 'center'}}>
                            <TextInput 
                                style={[styles.search_box, {backgroundColor: appColor.search_box, color: appColor.text_color}]}
                                placeholder="Іздеу" 
                            />
                            <View style={{position: 'absolute', left: 20, opacity: .5}}>
                                <Icons.SearchIcon style={{width: 25, height: 25}} />
                            </View>
                        </View>
                        <ScrollView style={{flex: 1}}>
                            <DrawerItem focused={current_page == "chatpage"} activeTintColor={appColor.bold_text} inactiveTintColor={appColor.bold_text}  activeBackgroundColor={appColor.highlight_bg} 
                                icon={() =>
                                 <View style={{padding: 8, borderRadius: 30, backgroundColor: appColor.inverseBlackWhite,justifyContent: 'center',alignItems: 'center'}}>
                                                <Icons.ReflectAIIcon mode={(app_color_mode == "system" ? system_color_mode : app_color_mode) == "dark" ? "light" : "dark"} style={{width: 20, height: 20}} />
                                                </View>} 
                                onPress={() => drawerProps.navigation.navigate('ChatPage')} label={"Reflect AI"} />
                            <DrawerItem focused={current_page == "EmotionAdvice"} activeTintColor={appColor.bold_text} inactiveTintColor={appColor.bold_text} activeBackgroundColor={appColor.highlight_bg} icon={() => <View style={{padding: 8,}}><Icons.MenuCircleIcon style={{width: 20, height: 20}} /></View>} onPress={() => drawerProps.navigation.navigate('EmotionAdvice')} label={"Кеңес"} />
                        
                            <DrawerItem 
                            focused={current_page == "Camera"} 
                            activeTintColor={appColor.bold_text} 
                            inactiveTintColor={appColor.bold_text} 
                            activeBackgroundColor={appColor.highlight_bg}
                            icon={() => (
                              <View>
                                <Icons.CameraIcon
                                  style={{ width: 35, height: 35 }}
                                />
                              </View>
                            )} 
                            onPress={() => drawerProps.navigation.navigate('Camera')}
                            label={"Эмоция анықтау"} 
                          />
                        </ScrollView>
                        {/* onTouchEnd={() => props.navigation.navigate('Жөндеу')}  */}<View style={{flexDirection: 'row', paddingHorizontal: 15, justifyContent:'space-between', alignItems: 'center'}}>
                            <View style={styles.user_info}>
                                <View style={{width: 40, height: 40, backgroundColor: 'orange', borderRadius: 9, alignItems: 'center', justifyContent: 'center'}}>
                                    <Text style={{color: 'white', fontWeight: '600', fontSize: 20}}>{username?.[0] || 'P'}</Text>
                                    
                                </View>
                                <View style={{marginLeft: 15}}><Text style={{fontWeight: '600', fontSize: 17, color: appColor.bold_text}}>{username || 'Guest'}</Text></View>
                            </View>
                            <View style={{opacity: .5, flexDirection: 'row', alignItems: 'center'}}>
                            <TouchableOpacity onPress={() => props.navigation.navigate('Жөндеу')}>
                             <Icons.DotsIcon style={{width: 25, height: 25}} />
                             </TouchableOpacity>
                        <TouchableOpacity 
                        onPress={async () => {
                            Alert.alert(
                                'Шығу',
                                'Сіз шынымен шыққыңыз келе ме?',
                                [
                                    {
                                        text: 'Жоқ',
                                        style: 'cancel',
                                    },
                                    {
                                        text: 'Иә',
                                        onPress: async () => {
                                            try {
                                                await AsyncStorage.clear();
                                                // Clear messages from Redux store
                                                dispatch(clearMessages());
                                                // Reset navigation to Login
                                                props.navigation.reset({
                                                    index: 0,
                                                    routes: [{ name: 'Login' }]
                                                });
                                            } catch (error) {
                                                console.error('Error during logout:', error);
                                            }
                                        },
                                    },
                                ],
                                { cancelable: true }
                            );
                        }}
                        style={styles.logoutButton}
                    >
                       
                            <Icons.LogoutIcon style={{width: 25, height: 25}} />
                            </TouchableOpacity>
                        </View>
                        </View>
                    </SafeAreaView>
            }} screenOptions={{
                drawerStyle: {
                    width: '80%',
                    backgroundColor: appColor.main_bg
                },
                headerShadowVisible: false,
                headerLeft: (headerProps) => <TouchableOpacity style={{marginLeft: 15}} onPress={() => props.navigation.dispatch(DrawerActions.openDrawer())}><Icons.MenuIcon {...headerProps} style={{width: 35, height: 35}} /></TouchableOpacity> 
            }}>
                <Drawer.Screen name="Кеңес бөлімі" component={AdviceContent} />
            </Drawer.Navigator>
  );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
      },
      scrollView: {
        flex: 1,
      },
      header: {
        paddingVertical: 30,
        paddingHorizontal: 20,
        backgroundColor: '#F8F9FA',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
      },
      headerTitle: {
        fontSize: 32,
        fontWeight: '700',
        color: '#2C3E50',
        marginBottom: 10,
      },
      headerSubtitle: {
        fontSize: 16,
        color: '#7F8C8D',
        fontWeight: '400',
      },
      content: {
        padding: 20,
      },
      adviceItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: '#FFFFFF',
        padding: 15,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
      },
      iconCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#ECF0F1',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
      },
      iconText: {
        fontSize: 24,
      },
      adviceContent: {
        flex: 1,
      },
      adviceTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#34495E',
        marginBottom: 5,
      },
      adviceText: {
        fontSize: 14,
        color: '#5D6D7E',
        lineHeight: 20,
      },
      footer: {
        paddingVertical: 20,
        alignItems: 'center',
      },
      footerText: {
        fontSize: 14,
        color: '#95A5A6',
        fontStyle: 'italic',
        textAlign: 'center',
      },
      logoutButton: {
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#FF3B30',
    },
      search_box: {
        width: '90%', 
        borderRadius: 9, 
        height: 40, 
        padding: 10,
        fontSize: 20,
        paddingLeft: 35,
    },
    user_info: {
flexDirection: 'row', 
alignItems: 'center',
paddingVertical: 15,
    },
});

export default EmotionAdviceScreen;