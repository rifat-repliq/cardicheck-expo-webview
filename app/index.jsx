import WebView from "react-native-webview";

export default function EntryPoint() {
  return <WebView source={{ uri: "https://telehealth-staging.vercel.app" }} />;
}
