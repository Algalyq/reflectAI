import { GestureResponderEvent, ViewStyle } from "react-native";

// Define a type for the slice state
export interface IMainState {
    app_mode: TColorMode,
    messages: Array<TMessage>;
    active_drawer_route: string;
    prompt_input: string;
}

export type TColorMode = 'light' | 'dark' | 'system'

export type TMessageSender = 'user' | 'system'

export type TMessage = {
    content: string;
    sender: TMessageSender;
}

export interface IListItemProp {
    icon: any; 
    title: string; 
    label: any, 
    style?: ViewStyle; 
    hasPage?: boolean, 
    subContentStyle?: ViewStyle;
    onPress?: ((event: GestureResponderEvent) => void);
}

// src/types.ts
export interface LoginRequest {
    username: string;
    password: string;
  }
  
  export interface LoginResponse {
    message: string;
    token: string;
  }
  
  export interface AuthResponse {
    message: string;
    status: string;
  }
  
  export interface NavigationProps {
    navigation: {
      navigate: (screen: string, params?: any) => void;
    };
    route: {
      params: {
        token: string;
      };
    };
  }