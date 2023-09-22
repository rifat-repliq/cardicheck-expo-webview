import { useEffect, useRef } from "react";
import { BackHandler, Platform } from "react-native";
import WebView from "react-native-webview";

export default function EntryPoint() {
  const webViewRef = useRef(null);

  const onAndroidBackPress = () => {
    if (webViewRef.current) {
      webViewRef.current.goBack();
      return true; // prevent default behavior (exit app)
    }
    return false;
  };

  useEffect(() => {
    if (Platform.OS === "android") {
      BackHandler.addEventListener("hardwareBackPress", onAndroidBackPress);
      return () => {
        BackHandler.removeEventListener(
          "hardwareBackPress",
          onAndroidBackPress
        );
      };
    }
  }, []);

  const DISABLE_ZOOMING_JS = `const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta); `;

  return (
    <WebView
      ref={webViewRef}
      source={{ uri: "https://telehealth-staging.vercel.app" }}
      injectedJavaScript={DISABLE_ZOOMING_JS}
    />
  );
}
