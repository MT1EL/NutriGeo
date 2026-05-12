import Button from "@/components/ui/Button";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Type } from "@/constants/theme";
import { router } from "expo-router";
import { Salad } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function Index() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];
  const { bottom } = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <SafeAreaView
      edges={["top"]}
      style={[styles.container, { backgroundColor: theme.brand }]}
    >
      <View style={styles.titleContainer}>
        <ThemedText style={styles.appName} color={theme.textOnBrand}>
          {t("welcome.app_name")}{" "}
        </ThemedText>
        <ThemedText
          style={{ fontSize: 18, textAlign: "center" }}
          color={theme.textOnBrand}
        >
          {t("welcome.app_tagline")}
        </ThemedText>
      </View>

      <View
        style={{
          width: 250,
          height: 250,
          backgroundColor: "rgba(255, 255, 255, 0.12)",
          borderRadius: 250,
          margin: "auto",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Salad size={100} color={theme.card} />
      </View>

      <View
        style={[
          styles.actionsContainer,
          { backgroundColor: theme.card, paddingBottom: bottom + 20 },
        ]}
      >
        <View
          style={{ gap: 16, marginBottom: 16, maxWidth: 300, margin: "auto" }}
        >
          <ThemedText style={styles.title}>{t("welcome.title")}</ThemedText>
          <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
            {t("welcome.subtitle")}
          </ThemedText>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            onPress={() => {
              router.push("/Register");
            }}
            variant="primary"
          >
            {t("welcome.create_account")}
          </Button>
          <Button
            onPress={() => {
              router.push("/Login");
            }}
            variant="outline"
          >
            {t("welcome.login")}
          </Button>
        </View>
        {/* 
        <View style={styles.row}>
          <View style={{ flex: 1, height: 1, backgroundColor: theme.border }} />
          <ThemedText style={{ color: theme.textSecondary }}>
            {t("welcome.or_sign_in_with")}
          </ThemedText>
          <View style={{ flex: 1, height: 1, backgroundColor: theme.border }} />
        </View> */}

        {/* <View style={styles.row}>
          <Button
            onPress={() => {
              toast.success(t("welcome.google_message"));
            }}
            variant="outline"
            style={{ flex: 1 }}
          >
            <View style={styles.row}>
              <GoogleLogo size={20} />
              <ThemedText>{t("welcome.continue_with_google")}</ThemedText>
            </View>
          </Button>
          <Button
            onPress={() => {
              toast.success(t("welcome.apple_message"));
            }}
            variant="outline"
            style={{ flex: 1 }}
          >
            <View style={styles.row}>
              <AppleLogo size={20} />
              <ThemedText>{t("welcome.continue_with_apple")}</ThemedText>
            </View>
          </Button>
        </View> */}
        <View style={[styles.row, { alignItems: "center" }]}>
          <ThemedText color={theme.textSecondary}>
            {t("legal.agree")}
          </ThemedText>
          <TouchableOpacity onPress={() => router.push("/terms")}>
            <ThemedText color={theme.brand}>
              {t("legal.terms&conditions")}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  titleContainer: {
    marginTop: 20,
  },
  appName: {
    fontSize: Type.xxxl,
    fontWeight: "800",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  actionsContainer: {
    padding: 20,
    gap: 16,
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
  },
  title: { fontSize: Type.xxl, fontWeight: 500, textAlign: "center" },
  subtitle: {
    fontSize: Type.sm,
    textAlign: "center",
  },
  buttonContainer: {
    gap: 14,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    justifyContent: "center",
  },
});
