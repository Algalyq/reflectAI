import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View, useColorScheme, Alert } from "react-native";
import { DrawerItem, createDrawerNavigator } from '@react-navigation/drawer';
import ChatPage from "../sub-routes/ChatPage";
import Icons from "../../assets/icons";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import ExplorePage from "../sub-routes/ExplorePage";
import useAppColor from "../../themed/appColor";
import { useAppDispatch, useAppSelector } from "../../shared/hooks";
import { clearMessages } from "../../shared/rdx-slice";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Drawer = createDrawerNavigator();

const Home  = React.memo((props: any) => {
    const appColor = useAppColor()
    const conversation = useAppSelector(state => state.main.messages);
    const dispatch = useAppDispatch()
    const app_color_mode = useAppSelector(state => state.main.app_mode);
    const system_color_mode = useColorScheme() || 'light';
    const current_page = useAppSelector(state => state.main.active_drawer_route)

    const [username, setUsername] = useState<string>('');

    useEffect(() => {
      AsyncStorage.getItem('username').then(value => {
        if (value) setUsername(value);
      });
    }, []);

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
                {/*onTouchEnd={() => props.navigation.navigate('Жөндеу')}  */} 
                  <View style={{flexDirection: 'row', paddingHorizontal: 15, justifyContent:'space-between', alignItems: 'center'}}>
                        <View style={{flexDirection: 'row', 
                                    alignItems: 'center',
                                    paddingVertical: 15}}>
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
            <Drawer.Screen name="ChatPage" options={{
                headerStyle: {
                    backgroundColor: appColor.main_bg
                },
                headerTitle(props) {
                    return <View>
                                {
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <Text style={{color: appColor.bold_text, fontSize: 18, fontWeight: '600'}}>ReflectAI</Text>
                                    </View>
                                }
                            </View>
                },
                headerRight: () => {
                    return <View style={{marginRight: 20, opacity: conversation.length == 0 ? .4 : 1}}>
                                <Icons.EditPenIcon onPress={() => dispatch(clearMessages())} style={{width: 22, height: 22}} />
                            </View>
                }
            }} component={ChatPage} />
            <Drawer.Screen name="ExplorePage" 
                options={{
                    headerStyle: {
                        backgroundColor: appColor.main_bg
                    },
                    headerTitleStyle: {
                        color: appColor.bold_text
                    },
                    headerTitle: 'Explore',
                    headerRight(props) {
                        return <View style={{marginRight: 15}}>
                            <Icons.SearchIcon style={{width: 30, height: 30}} />
                        </View>
                    },
                }}
             component={ExplorePage} />
        </Drawer.Navigator>
    )
})

const styles = StyleSheet.create({
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
    }
})

export default Home