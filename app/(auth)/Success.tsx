import Button from "@/components/ui/Button";
import ThemedText from "@/components/ui/ThemedText";
import { Colors } from "@/constants/theme";
import { ImageBackground } from "expo-image";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
function SuccessScreen() {
  return (
    <ImageBackground
      source={require("@/assets/illustrations/welcome.png")}
      contentFit="cover"
      contentPosition={"center"}
      style={{ flex: 1 }}
    >
      <View style={styles.overlay} />
      <SafeAreaView style={styles.container}>
        <View />
        <View style={styles.content}>
          <ThemedText style={styles.title} color={Colors.light.background}>
            გილოცავთ!
          </ThemedText>
          <ThemedText style={styles.subTitle} color={Colors.light.background}>
            {`თქვენი პროფილი წარმატებით შეიქმნა!\n ახლა მზად ხარ დაიწყო შენი ჯანსაღი მოგზაურობა`}
          </ThemedText>
        </View>
        <Button
          backgroundColor={Colors.light.background}
          color={Colors.light.text}
          onPress={() => router.replace("/(tabs)")}
        >
          დაწყება
        </Button>
      </SafeAreaView>
    </ImageBackground>
  );
}

export default SuccessScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  overlay: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  title: {
    fontSize: 32,
  },
  subTitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
});
