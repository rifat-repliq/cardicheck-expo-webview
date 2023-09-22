import { useEffect, useRef } from "react";
import { BackHandler, Platform } from "react-native";
import WebView from "react-native-webview";

import { STAGING_URL } from "../constants/sources";
import { DISABLE_ZOOMING } from "../constants/injectables";

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

  return (
    <WebView
      ref={webViewRef}
      source={{ uri: STAGING_URL }}
      injectedJavaScript={DISABLE_ZOOMING}
    />
  );
}
