import WebView from "react-native-webview";

export default function index() {
  return <WebView source={{ uri: "https://telehealth-staging.vercel.app" }} />;
}
