import React, { useEffect, useCallback, useState, useRef } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
  Keyboard,
  Animated,
} from 'react-native';
import CustomView from '../../themed/CustomView';
import Icons from '../../assets/icons';
import useAppColor from '../../themed/appColor';
import { TextInput } from 'react-native-gesture-handler';
import { MessageBox } from '../../shared/reusables';
import { useAppDispatch, useAppSelector } from '../../shared/hooks';
import { setActiveDrawerRoute, updateMessages, updatePromptInput } from '../../shared/rdx-slice';
import { TMessage } from '../../shared/types';
import { make_request } from '../../assets/constants';
import { launchImageLibrary } from 'react-native-image-picker';
import { pick, types } from 'react-native-document-picker';
import { useIsFocused } from '@react-navigation/native';

const ChatPage = React.memo(({ navigation, route }) => {
  const appColor = useAppColor();
  const prompt = useAppSelector((state) => state.main.prompt_input);
  const [main_icons_hidden, set_main_icons_hidden] = useState(false);
  const [showExpandBtn, setShowExpandBtn] = useState(false);
  const conversation = useAppSelector((state) => state.main.messages);
  const app_color_mode = useAppSelector((state) => state.main.app_mode);
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const system_color_mode = useColorScheme() || 'light';
  const dispatch = useAppDispatch();
  const isFocused = useIsFocused();
  const [isTyping, setIsTyping] = useState(false);
  const mountedRef = useRef(true); 

  const screenHeight = Dimensions.get('window').height;
  const offset = screenHeight * 0.11;

  const emotion_list = {
    sad: 'қайғы',
    happy: 'көңілді',
    angry: 'ашулы',
    disgust: 'жирену',
    fear: 'қорқыныш',
    surprised: 'таңғалу',
    neutral: 'бейтарап',
  };

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (route.params?.fromCamera && route.params?.result) {
      const { result } = route.params;
      const dominantEmotion = result.dominant_emotion;
      const emotionInKazakh = emotion_list[dominantEmotion] || dominantEmotion;

      const newPrompt = `I just recorded a video and the dominant emotion detected was ${dominantEmotion}. Here's the breakdown: ${JSON.stringify(result.emotion_distribution)}. Give me advice on how to deal with this? Please write in Kazakh language`;
      const promptForUser = `Мен жаңа ғана видео жаздым, және басым эмоция ${emotionInKazakh} болып анықталды. Осыған қалай қарау керектігі туралы кеңес беріңізші?`;

      const userMessageKK = { content: promptForUser, sender: 'user' };
      dispatch(updateMessages(userMessageKK));
      handlePromptChatGPT(newPrompt);

      navigation.setParams({ fromCamera: null, result: null });
    }
  }, [route.params, navigation, dispatch, handlePromptChatGPT]);

  const handleLaunchImageLibrary = useCallback(async () => {
    try {
      const response = await launchImageLibrary({ mediaType: 'mixed', selectionLimit: 0 });
      if (response.assets) {
        response.assets.forEach(async (asset) => {
          try {
            const res = await fetch(asset.uri);
            const data = await res.blob();
            console.log('file data', data);
          } catch (err) {
            console.error('An error occurred while getting the file', err);
          }
        });
      }
    } catch (error) {
      console.error('Error launching image library:', error);
    }
  }, []);

  const handlePickDocument = useCallback(async () => {
    try {
      const res = await pick({
        allowMultiSelection: true,
        type: [types.pdf, types.docx],
      });
      console.log(res);
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        console.error('Error picking document:', err);
      }
    }
  }, []);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardOffset(offset);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardOffset(0);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [offset]);

  const handleSubmitPrompt = useCallback(() => {
    if (prompt.length === 0) return;
    const message = { content: prompt, sender: 'user' };
    dispatch(updateMessages(message));
    handlePromptChatGPT(prompt);
    dispatch(updatePromptInput(''));
  }, [prompt, dispatch, handlePromptChatGPT]);

  const handlePromptChatGPT = useCallback(
    async (prompt) => {
      if (!mountedRef.current) return;
      setIsTyping(true);
      try {
        const response = await make_request(prompt);
        if (!mountedRef.current) return;
        if (!response) {
          console.log('An error occurred, please try again');
          return;
        }
        const message = { content: response, sender: 'system' };
        dispatch(updateMessages(message));
      } catch (error) {
        console.error('ChatGPT request failed:', error);
      } finally {
        if (mountedRef.current) setIsTyping(false);
      }
    },
    [dispatch]
  );

  const handleInputLayout = useCallback((event) => {
    const { height } = event.nativeEvent.layout;
    setShowExpandBtn(height > 75);
  }, []);

  useEffect(() => {
    if (isFocused) {
      dispatch(setActiveDrawerRoute('chatpage'));
    }
  }, [isFocused, dispatch]);
  const TypingIndicator = () => {
    const [dotOpacity] = useState(new Animated.Value(0));
    const animationRef = useRef<Animated.CompositeAnimation | null>(null);

    useEffect(() => {
      animationRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(dotOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(dotOpacity, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      );
      animationRef.current.start();

      return () => {
        if (animationRef.current) {
          animationRef.current.stop(); // Stop animation on unmount
        }
      };
    }, [dotOpacity]);

    return (
      <View style={styles.typingContainer}>
        <Animated.Text style={[styles.typingDot, { opacity: dotOpacity }]}>.</Animated.Text>
        <Animated.Text style={[styles.typingDot, { opacity: dotOpacity, marginLeft: 5 }]}>.</Animated.Text>
        <Animated.Text style={[styles.typingDot, { opacity: dotOpacity, marginLeft: 5 }]}>.</Animated.Text>
      </View>
    );
  };

  return ( <SafeAreaView style={{ flex: 1, backgroundColor: appColor.main_bg }}>
  <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={{ flex: 1 }}
    keyboardVerticalOffset={Platform.OS === 'ios' ? offset : 0}
  >
    <ScrollView
      contentContainerStyle={{ justifyContent: 'space-between', flexGrow: 1 }}
      keyboardShouldPersistTaps="always"
    >
      <View style={{ flex: 1 }}>
        {conversation.length > 0 || isTyping ? (
          <CustomView style={{ paddingHorizontal: 20 }}>
            {conversation.map((message, index) => (
              <MessageBox key={index} message={message.content} sender={message.sender} />
            ))}
            {isTyping && (
              <View style={{ alignSelf: 'flex-start', marginTop: 10 }}>
                <TypingIndicator />
              </View>
            )}
          </CustomView>
        ) : (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <View
              style={{
                borderRadius: 50,
                padding: 10,
                backgroundColor: appColor.inverseBlackWhite,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            />
          </View>
        )}
      </View>
    </ScrollView>

    <View style={[styles.text_box_container, { backgroundColor: appColor.main_bg }]}>
      <View style={{ flexDirection: 'row', flexShrink: 1, marginRight: 20, alignItems: 'center' }}>
        {main_icons_hidden ? (
          <>
           </>
        ) : (
          <>
            <Icons.CameraIcon
              onPress={() => navigation.navigate('Camera')}
              style={{ width: 35, height: 35 }}
            />
          </>
        )}
      </View>
      <View style={{ flex: 1, position: 'relative', justifyContent: 'flex-end' }}>
        <TextInput
          multiline
          style={[
            styles.text_input,
            { borderWidth: 1, borderColor: appColor.line_color, color: appColor.inverseWhiteBlack },
          ]}
          placeholder="Жазу"
          value={prompt}
          placeholderTextColor={appColor.line_color}
          onLayout={handleInputLayout}
          onChangeText={(text) => {
            dispatch(updatePromptInput(text));
            set_main_icons_hidden(text.length > 0);
          }}
        />
      </View>
      <View style={{ flexShrink: 1, marginLeft: 20 }}>
            {main_icons_hidden ? (
              <Icons.ArrowUpIcon onPress={handleSubmitPrompt} style={{ width: 25, height: 25 }} />
            ) : (
              <></>
            )}
      </View>
      {/* {showExpandBtn && (
        <Icons.ExpandIcon
          onPress={handleOpenExpandInput}
          style={{ width: 25, height: 25, position: 'absolute', top: 5, right: 20 }}
        />
      )} */}
    </View>
  </KeyboardAvoidingView>
</SafeAreaView>
);
});

const styles = StyleSheet.create({
text_input: {
minHeight: 40,
borderRadius: 20,
width: '100%',
paddingHorizontal: 14,
fontSize: 20,
maxHeight: 220,
paddingVertical: 10,
},
text_box_container: {
width: '100%',
flexDirection: 'row',
alignItems: 'center',
justifyContent: 'space-between',
paddingHorizontal: 20,
paddingVertical: 10,
elevation: 2,
zIndex: 1,
},
typingContainer: {
flexDirection: 'row',
alignItems: 'center',
backgroundColor: '#e0e0e0',
padding: 10,
borderRadius: 15,
},
typingDot: {
fontSize: 20,
color: '#333',
},
});

export default ChatPage;