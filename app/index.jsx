import { useEffect, useRef, useState } from "react";
import { Alert, BackHandler } from "react-native";
import WebView from "react-native-webview";
import Spinner from "../components/shared/Spinner";

import { STAGING_URL } from "../constants/sources";
import { DISABLE_ZOOMING } from "../constants/injectables";

export default function EntryPoint() {
  const webViewRef = useRef(null);
  const [isInRootPage, setIsInRootPage] = useState(false);

  function handleNavigationStateChange(state) {
    if (state.url === STAGING_URL) {
      setIsInRootPage(true);
    } else {
      setIsInRootPage(false);
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
      isInRootPage ? exitApp : goBack
    );

    return () => backHandler.remove();
  }, [isInRootPage]);

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
    />
  );
}
