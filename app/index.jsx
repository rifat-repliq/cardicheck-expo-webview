import { useEffect, useRef, useState } from "react";
import { Alert, BackHandler, View, Text, Modal, Image } from "react-native";
import WebView from "react-native-webview";
import Spinner from "../components/shared/Spinner";

import { STAGING_URL } from "../constants/sources";
import { DISABLE_ZOOMING } from "../constants/injectables";
import NetInfo from '@react-native-community/netinfo';

export default function EntryPoint() {
  const webViewRef = useRef(null);

  const [isInEntryPage, setIsInEntryPage] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    // Subscribe to network state changes
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    if (!isConnected) {
      setIsModalVisible(true)
    }

    if (isConnected) {
      setIsModalVisible(false)
    }

    // Cleanup the subscription when the component unmounts
    return () => unsubscribe();
  }, [isConnected]);

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

  return (
    <View style={{ flex: 1 }}>
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
      {/* Modal to display when there's no internet connection */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={{ flex: 1, justifyContent: 'flex-center' }}>
          <View style={{ padding: 40, borderRadius: 10, backgroundColor: 'white' }}>
            {/* <Image style={{ width: 200, height: 200, flex: 1, justifyContent: 'flex-center' }} source={require("../assets/no-wifi.png")} /> */}
            <Text style={{ color: 'red', textAlign: 'center' }}>Please check your internet connection</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}
