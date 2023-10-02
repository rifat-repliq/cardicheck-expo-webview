import { View, Text, Image, Modal } from "react-native";

export default function NoInternetModal({ visible }) {
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#115E5944",
        }}
      >
        <View
          style={{
            padding: 40,
            borderRadius: 10,
            backgroundColor: "white",
            alignItems: "center",
          }}
        >
          <Image
            style={{
              width: 200,
              height: 200,
            }}
            source={require("../../assets/no-wifi.png")}
          />
          <Text
            style={{
              color: "red",
              textAlign: "center",
              fontSize: 20,
            }}
          >
            Please check your internet connection
          </Text>
        </View>
      </View>
    </Modal>
  );
}
