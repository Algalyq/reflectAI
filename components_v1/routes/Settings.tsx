import React from "react";
import { View, useColorScheme } from "react-native";
import { Text } from "react-native-paper";
import useAppColor from "../../themed/appColor";
import CustomView from "../../themed/CustomView";
import Icons from "../../assets/icons";
import { useNavigation } from "@react-navigation/native";
import { ListContainer, ListItem } from "../../shared/reusables";
import { Button, Menu, Divider, PaperProvider } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from "../../shared/hooks";
import { setAppColorMode } from "../../shared/rdx-slice";
import storage from "../../shared/storage";
import { APP_COLOR_MODE_KEY } from "../../assets/constants";

const SettingsRoute = React.memo((props: any) => {
    const appColor = useAppColor();
    const navigation = useNavigation();
    const [menuIsVisible, setMenuIsVisible] = React.useState<boolean>(false);
    const colorScheme = useColorScheme() || 'light';
    const dispatch = useAppDispatch();
    const current_app_color = useAppSelector(state => state.main.app_mode);

    const handleSetColorMode = React.useCallback((mode?: any) => {
        const color_mode = mode ?? colorScheme;
        dispatch(setAppColorMode(color_mode));
        storage.save({key: APP_COLOR_MODE_KEY, data: color_mode});
    }, []);

    React.useLayoutEffect(() => {
        props.navigation.setOptions({
            headerRight(props: any) {
                return <View onTouchEnd={() => navigation.goBack()} style={{backgroundColor: appColor.line_color, borderRadius: 50, marginRight: 25, width: 30, height: 30, alignItems: 'center', justifyContent: 'center'}}>
                        <Icons.TimesIcon style={{width: 25, height: 25}} />
                      </View>;
            },
        });
    }, [appColor]);

    return (
        <CustomView style={{backgroundColor: appColor.page_modal_bg, paddingBottom: 60}}>
                        
            <View style={{paddingHorizontal: 15, marginBottom: 20}}>
                <Text style={{textTransform: 'uppercase', color: appColor.text_color, padding: 10}}>Есептік жазба</Text>
                <ListContainer>
                    <ListItem icon={<Icons.EmailIcon style={{width: 25, height: 25}} />} title="Пошта" label="testtest2024@gmail.com" />
                    <ListItem icon={<Icons.PlusSquareIcon style={{width: 25, height: 25}} />} title="Жазылым" label="Тегін жоспар" />
                    <ListItem subContentStyle={{borderBottomWidth: 0, borderBottomColor: 'transparent'}} icon={<Icons.DatabaseIcon style={{width: 25, height: 25}} />} hasPage={true} title="Деректерді басқару" label="" />
                </ListContainer>
            </View>

            <View style={{paddingHorizontal: 15, marginBottom: 20}}>
                <Text style={{textTransform: 'uppercase', color: appColor.text_color, padding: 10}}>Қосымша</Text>
                <ListContainer>
                    <ListItem icon={<Icons.GlobeIcon style={{width: 25, height: 25}} />} title="Қосымша тілі" label="Ағылшын" />
                    <ListItem onPress={() => null} subContentStyle={{borderBottomWidth: 0, borderBottomColor: 'transparent'}} icon={<Icons.ColorIcon style={{width: 25, height: 25}} />} 
                        title="Түс схемасы" 
                        label={
                            <Menu
                                visible={menuIsVisible}
                                elevation={3}
                                contentStyle={{backgroundColor: appColor.main_bg, elevation: 0, shadowColor: 'transparent', borderRadius: 10, width: 200}}
                                onDismiss={() => setMenuIsVisible(false)}
                                anchor={<View onTouchEnd={() => setMenuIsVisible(true)}><Text style={{fontSize: 18, color: appColor.text_color, textTransform: 'capitalize'}}>
                                    {current_app_color === "system" ? "Жүйе" : current_app_color === "dark" ? "Қараңғы" : "Жарық"}
                                    </Text></View>}
                            >
                                <Menu.Item onPress={() => handleSetColorMode("system")} titleStyle={{fontSize: 18, color: current_app_color == "system" ? "yellowgreen" : appColor.bold_text}} title="Жүйе" />
                                <Divider />
                                <Menu.Item onPress={() => handleSetColorMode('dark')} titleStyle={{fontSize: 18, color: current_app_color == "dark" ? "yellowgreen" : appColor.bold_text}} title="Қараңғы" />
                                <Divider />
                                <Menu.Item onPress={() => handleSetColorMode('light')} titleStyle={{fontSize: 18, color: current_app_color == "light" ? "yellowgreen" : appColor.bold_text}} title="Жарық" />
                            </Menu>
                        } />
                </ListContainer>
            </View>
            
            <View style={{paddingHorizontal: 15, marginBottom: 20}}>
                <Text style={{textTransform: 'uppercase', color: appColor.text_color, padding: 10}}>Сөйлеу</Text>
                <ListContainer>
                    <ListItem subContentStyle={{borderBottomWidth: 0, borderBottomColor: 'transparent'}} icon={<Icons.GlobeIcon style={{width: 25, height: 25}} />} title="Негізгі тіл" label="Авто-анықтау" />
                </ListContainer>
            </View>

            <View style={{paddingHorizontal: 15, marginBottom: 20}}>
                <Text style={{textTransform: 'uppercase', color: appColor.text_color, padding: 10}}>Туралы</Text>
                <ListContainer>
                    <ListItem icon={<Icons.HelpIcon style={{width: 25, height: 25}} />} title="Көмек орталығы" label="" />
                    <ListItem icon={<Icons.PadlockIcon style={{width: 25, height: 25}} />} title="Құпиялылық саясаты" label="" />
                </ListContainer>
            </View>

            <View style={{paddingHorizontal: 15, marginBottom: 20}}>
                <ListContainer>
                    <ListItem subContentStyle={{borderBottomWidth: 0, borderBottomColor: 'transparent'}} icon={<Icons.LogoutIcon style={{width: 20, height: 20}} />} title="Шығу" label="" />
                </ListContainer>
            </View>
        </CustomView>
    );
});

export default SettingsRoute;