import Button from "@/components/ui/Button";
import Input from "@/components/ui/inputs/Input";
import ThemedText from "@/components/ui/ThemedText";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Image } from "expo-image";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  illustrationSource: string;
  illustrationSize?: "small" | "medium";
  title: string;
  subtitle: string;
  onPress: () => void;
  label: string;
  inputs: React.ComponentProps<typeof Input>[];
  footerLinkText?: string;
  footerLinkLabel?: string;
  footerLinkAction?: () => void;
};

const AuthLayout = ({
  illustrationSource,
  illustrationSize = "small",
  title,
  subtitle,
  onPress,
  label,
  inputs,
  footerLinkText,
  footerLinkLabel,
  footerLinkAction,
}: Props) => {
  const colorScheme = useColorScheme() || "light";

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: Colors[colorScheme].surface },
      ]}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerContainer}>
            <Text
              style={[styles.logo, { color: Colors[colorScheme].brand }]}
            ></Text>
            <Image
              source={illustrationSource}
              style={
                illustrationSize === "small"
                  ? { width: 150, height: 150, objectFit: "scale-down" }
                  : { width: 270, height: 270 }
              }
            />
          </View>
          <View style={styles.contentContainer}>
            <View style={styles.form}>
              <View>
                <ThemedText style={styles.formTitle}>{title}</ThemedText>
                <ThemedText style={styles.formSubtitle} type="secondary">
                  {subtitle}
                </ThemedText>
              </View>
              <View style={styles.inputsContainer}>
                {inputs.map((input, index) => (
                  <Input key={index} {...input} />
                ))}
              </View>
            </View>
            <View style={styles.footerContainer}>
              <Button onPress={onPress}>{label}</Button>
              {footerLinkText && (
                <View style={styles.footerLinkContainer}>
                  <ThemedText type="secondary">{footerLinkText}</ThemedText>
                  <TouchableOpacity onPress={footerLinkAction}>
                    <ThemedText
                      color={Colors[colorScheme].brand}
                      type="primary"
                    >
                      {footerLinkLabel}
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AuthLayout;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 60,
  },
  headerContainer: {
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  logo: {
    fontSize: 36,
    fontWeight: "bold",
  },
  contentContainer: {
    paddingHorizontal: 20,
    flex: 1,
    justifyContent: "space-between",
  },
  form: {
    gap: 40,
    marginTop: 48,
    paddingBottom: 20,
  },
  formTitle: {
    fontSize: 28,
    fontWeight: "bold",
  },
  formSubtitle: {
    fontSize: 16,
  },
  inputsContainer: {
    gap: 4,
  },
  footerContainer: {
    gap: 12,
  },
  footerLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
  },
});
