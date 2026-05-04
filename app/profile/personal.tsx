import { SubScreenLayout } from "@/components/layout/SubScreenLayout";
import SexSelector from "@/components/personal/SexSelector";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/inputs/Input";
import { PersonalFormSkeleton } from "@/components/ui/Skeletons";
import ThemedText from "@/components/ui/ThemedText";
import { Spacing, Type } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { usePersonalForm } from "@/hooks/use-personal-form";
import { Calendar, Ruler, User, Weight } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

export default function PersonalScreen() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { form, isLoading, isSaving } = usePersonalForm();

  if (isLoading) {
    return (
      <SubScreenLayout
        title={t("profile.personalScreen.title")}
        subtitle={t("profile.personalScreen.subtitle")}
      >
        <PersonalFormSkeleton />
      </SubScreenLayout>
    );
  }

  return (
    <SubScreenLayout
      title={t("profile.personalScreen.title")}
      subtitle={t("profile.personalScreen.subtitle")}
    >
      <SexSelector
        value={form.values.biological_sex}
        onChange={(next) => form.setFieldValue("biological_sex", next)}
      />

      <View style={{ gap: Spacing.md }}>
        <ThemedText style={styles.groupTitle} type="secondary">
          {t("profile.personalScreen.basics")}
        </ThemedText>
        <View>
          <Input
            Icon={User}
            label={t("profile.personalScreen.name")}
            value={form.values.name}
            onChangeText={(text) => form.setFieldValue("name", text)}
          />
          <Input
            Icon={Calendar}
            label={t("profile.personalScreen.age")}
            value={form.values.age}
            onChangeText={(text) => form.setFieldValue("age", text)}
            keyboardType="number-pad"
          />
        </View>
        <View style={styles.twoCol}>
          <View style={{ flex: 1 }}>
            <Input
              Icon={Ruler}
              label={t("profile.personalScreen.heightCm")}
              value={form.values.height_cm}
              onChangeText={(text) => form.setFieldValue("height_cm", text)}
              keyboardType="number-pad"
            />
          </View>
          <View style={{ flex: 1 }}>
            <Input
              Icon={Weight}
              label={t("profile.personalScreen.weightKg")}
              value={form.values.weight_kg}
              onChangeText={(text) => form.setFieldValue("weight_kg", text)}
              keyboardType="decimal-pad"
            />
          </View>
        </View>
      </View>

      <View style={{ gap: Spacing.md }}>
        <ThemedText style={styles.groupTitle} type="secondary">
          {t("profile.personalScreen.contact")}
        </ThemedText>
        <Input
          Icon={User}
          label={t("profile.personalScreen.email")}
          defaultValue={user?.email}
          keyboardType="email-address"
          disabled
        />
      </View>

      <Button
        onPress={() => form.handleSubmit()}
        disabled={isSaving || !form.dirty}
      >
        {isSaving
          ? t("profile.personalScreen.saving")
          : t("profile.personalScreen.save")}
      </Button>
    </SubScreenLayout>
  );
}

const styles = StyleSheet.create({
  groupTitle: {
    fontSize: Type.xs,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginLeft: Spacing.xs,
    opacity: 0.7,
  },
  twoCol: {
    flexDirection: "row",
    gap: Spacing.md,
  },
});
