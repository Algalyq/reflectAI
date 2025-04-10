import React from 'react';
import {
  StatusBar,
  useColorScheme,
} from 'react-native';
import { 
  CardStyleInterpolators, 
  createStackNavigator 
} from '@react-navigation/stack';
import Home from './components/routes/Home';
import SettingsRoute from './components/routes/Settings';
import useAppColor from './themed/appColor';
import CameraPage from './components/routes/Camera';
import storage from './shared/storage';
import { APP_COLOR_MODE_KEY } from './assets/constants';
import { useAppDispatch, useAppSelector } from './shared/hooks';
import { setAppColorMode } from './shared/rdx-slice';
import InputRoute from './components/routes/InputRoute';
import LoginScreen from './components/routes/LoginScreen';
import Registration from './components/routes/RegisterScreen';
import EmotionAdviceScreen from './components/routes/EmotionAdviceScreen';
import PrivacyPolicy from './components/routes/PrivacyPolicy';
import FAQ from './components/routes/FAQ';
import ForgotPasswordScreen from './components/routes/ForgotPasswordScreen';


type RootStackParamList = {
  Login: undefined;
  Registration: undefined;
  Home: undefined;
  'Жөндеу': undefined;
  Camera: undefined;
  InputRoute: undefined;
  EmotionAdvice: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const appColor = useAppColor();
  const dispatch = useAppDispatch();
  const app_color_mode = useAppSelector(state => state.main.app_mode);
  const system_color_mode = useColorScheme() || 'light';

  console.log('Rendering App...');
  const handleSetColorMode = React.useCallback(() => {
    storage.load({key: APP_COLOR_MODE_KEY})
      .then((data: any) => {
        console.log("Loaded color mode:", data);
        dispatch(setAppColorMode(data));
      })
      .catch((err: any) => {
        console.log("Using system color mode");
        dispatch(setAppColorMode("system"));
      });
  }, [dispatch]);

  React.useLayoutEffect(() => {
    handleSetColorMode();
  }, [handleSetColorMode]);

  const statusBarStyle = (app_color_mode === "system" ? system_color_mode : app_color_mode) === 'light' 
    ? 'dark-content' 
    : 'light-content';

  return (
    <>
      <StatusBar barStyle={statusBarStyle} />
      
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: appColor.page_modal_bg,
          },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{
            headerShown: false,
            presentation: 'modal'
          }}
        />
<Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
<Stack.Screen 
          name="PrivacyPolicy" 
          component={PrivacyPolicy} 
          options={{
            headerShown: false,
            presentation: 'modal'
          }}
        />
        
        <Stack.Screen 
          name="FAQ" 
          component={FAQ} 
          options={{
            headerShown: false,
            presentation: 'modal'
          }}
        />

        <Stack.Screen 
          name="Registration" 
          component={Registration} 
          options={{
            headerShown: false,
            presentation: 'modal'
          }}
        />

        <Stack.Screen 
          name="Home" 
          component={Home} 
          options={{
            headerShown: false
          }} 
        />

        <Stack.Screen 
          name="Жөндеу" 
          component={SettingsRoute} 
          options={{
            presentation: 'modal',
            headerLeft: () => null,
            title: 'Settings',
          }} 
        />

        <Stack.Screen 
          name="Camera" 
          component={CameraPage} 
          options={{
            presentation: 'card',
            cardStyle: {
              height: "50%"
            },
            headerShown: false,
            gestureDirection: "vertical",
            cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS
          }} 
        />

        <Stack.Screen 
          name="InputRoute" 
          component={InputRoute} 
          options={{
            headerShown: false,
            presentation: 'modal'
          }}
        />

        <Stack.Screen 
          name="EmotionAdvice" 
          component={EmotionAdviceScreen} 
          options={{
            headerShown: false,
            presentation: 'modal'
          }}
        />
      </Stack.Navigator>
    </>
  );
}

export default App;