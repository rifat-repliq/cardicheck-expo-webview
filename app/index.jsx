import { useEffect, useRef, useState } from "react";
import { Alert, BackHandler, Text, View } from "react-native";
import { Camera } from "expo-camera";
import WebView from "react-native-webview";

import { STAGING_URL } from "../constants/sources";
import { DISABLE_ZOOMING } from "../constants/injectables";

import Spinner from "../components/shared/Spinner";

export default function EntryPoint() {
  const webViewRef = useRef(null);

  const [isInEntryPage, setIsInEntryPage] = useState(false);

  function handleNavigationStateChange(state) {
    if (!state.canGoBack) {
      setIsInEntryPage(true);
    } else {
      setIsInEntryPage(false);
    }
  }

  useEffect(() => {
    const goBack = () => {
      webViewRef.current.goBack();
      return true;
    };

    const exitApp = () => {
      Alert.alert("Hold on!", "Are you sure want to exit the app?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
        { text: "YES", onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      isInEntryPage ? exitApp : goBack
    );

    return () => backHandler.remove();
  }, [isInEntryPage]);

  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    async function requestPermissions() {
      const { status: cameraStatus } =
        await Camera.requestCameraPermissionsAsync();
      const { status: micStatus } =
        await Camera.requestMicrophonePermissionsAsync();
      setHasPermission(cameraStatus === "granted" && micStatus === "granted");
    }

    requestPermissions();
  }, []);

  if (hasPermission === null) {
    return <Spinner />;
  }

  if (!hasPermission) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Camera and Microphone permission is Required!</Text>
      </View>
    );
  }

  if (hasPermission) {
    return (
      <WebView
        ref={webViewRef}
        source={{ uri: STAGING_URL }}
        onNavigationStateChange={handleNavigationStateChange}
        injectedJavaScript={DISABLE_ZOOMING}
        originWhitelist={["*"]}
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        startInLoadingState={true}
        renderLoading={Spinner}
        onError={(error) => console.error("WebView Error:", error)}
      />
    );
  }
}
