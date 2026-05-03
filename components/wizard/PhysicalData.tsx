import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { useWizard } from "@/contexts/WizardContext";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Calendar, Ruler, Weight } from "lucide-react-native";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import Input from "../ui/Input";
import ThemedText from "../ui/ThemedText";
import WizzardContentLayout from "./layout";

const MIN_AGE = 10;
const MAX_AGE = 120;

function ageFromBirthDate(iso: string): number | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - d.getFullYear();
  const m = today.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age -= 1;
  return age;
}

function formatBirthDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}.${mm}.${d.getFullYear()}`;
}

const PhysicalData = () => {
  const { t } = useTranslation();
  const { data, setField } = useWizard();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const [pickerOpen, setPickerOpen] = useState(false);

  const today = new Date();
  const maxDate = new Date(
    today.getFullYear() - MIN_AGE,
    today.getMonth(),
    today.getDate(),
  );
  const minDate = new Date(
    today.getFullYear() - MAX_AGE,
    today.getMonth(),
    today.getDate(),
  );
  const initialDate = useMemo(() => {
    if (data.birth_date) {
      const d = new Date(data.birth_date);
      if (!Number.isNaN(d.getTime())) return d;
    }
    // Default cursor: 25 years ago
    return new Date(
      today.getFullYear() - 25,
      today.getMonth(),
      today.getDate(),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.birth_date]);

  const age = ageFromBirthDate(data.birth_date);

  const onChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === "android") {
      setPickerOpen(false);
      if (event.type === "set" && selected) {
        setField("birth_date", selected.toISOString().slice(0, 10));
      }
      return;
    }
    if (selected) {
      setField("birth_date", selected.toISOString().slice(0, 10));
    }
  };

  return (
    <WizzardContentLayout
      title={t("wizard.physical.title")}
      subtitle={t("wizard.physical.subtitle")}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <Input
          Icon={Ruler}
          placeholder={"175"}
          label={t("wizard.physical.heightCm")}
          keyboardType="numeric"
          value={data.height_cm}
          onChangeText={(text) => setField("height_cm", text)}
        />
        <Input
          Icon={Weight}
          placeholder={"66.5"}
          label={t("wizard.physical.weightKg")}
          keyboardType="decimal-pad"
          value={data.weight_kg}
          onChangeText={(text) => setField("weight_kg", text)}
        />

        <View style={{ gap: Spacing.xs }}>
          <ThemedText style={styles.fieldLabel} type="secondary">
            {t("wizard.physical.birthDate")}
          </ThemedText>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setPickerOpen(true)}
            style={[
              styles.pickerTrigger,
              {
                backgroundColor: theme.background,
                borderColor: theme.border,
              },
            ]}
          >
            <Calendar color={theme.textSecondary} />
            <ThemedText
              style={styles.pickerValue}
              color={data.birth_date ? theme.text : theme.textSecondary}
            >
              {data.birth_date
                ? formatBirthDate(data.birth_date)
                : "DD.MM.YYYY"}
            </ThemedText>
          </TouchableOpacity>
          {age != null && (
            <ThemedText type="secondary" style={styles.ageHint}>
              {t("wizard.physical.ageLabel")} {age}
            </ThemedText>
          )}
        </View>
      </KeyboardAvoidingView>

      {Platform.OS === "android" && pickerOpen && (
        <DateTimePicker
          value={initialDate}
          mode="date"
          display="default"
          maximumDate={maxDate}
          minimumDate={minDate}
          onChange={onChange}
        />
      )}

      {Platform.OS === "ios" && (
        <Modal
          visible={pickerOpen}
          transparent
          animationType="fade"
          onRequestClose={() => setPickerOpen(false)}
        >
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setPickerOpen(false)}
          >
            <Pressable
              style={[styles.modalSheet, { backgroundColor: theme.card }]}
              onPress={(e) => e.stopPropagation()}
            >
              <DateTimePicker
                value={initialDate}
                mode="date"
                display="spinner"
                maximumDate={maxDate}
                minimumDate={minDate}
                onChange={onChange}
                themeVariant={colorScheme}
                textColor={theme.text}
                style={styles.iosPicker}
              />
              <TouchableOpacity
                onPress={() => setPickerOpen(false)}
                style={[styles.modalDone, { backgroundColor: theme.brand }]}
                activeOpacity={0.85}
              >
                <ThemedText
                  style={styles.modalDoneText}
                  color={theme.textOnBrand}
                >
                  {t("common.done")}
                </ThemedText>
              </TouchableOpacity>
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </WizzardContentLayout>
  );
};

export default PhysicalData;

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
  fieldLabel: {
    fontSize: Type.sm,
    marginLeft: Spacing.xs,
  },
  pickerTrigger: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    height: 56,
    gap: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
  },
  pickerValue: {
    flex: 1,
    fontSize: Type.base,
  },
  ageHint: {
    fontSize: Type.xs,
    marginLeft: Spacing.xs,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    paddingTop: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    gap: Spacing.md,
  },
  modalDone: {
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    borderRadius: Radius.pill,
  },
  modalDoneText: {
    fontSize: Type.base,
    fontWeight: "700",
  },
  iosPicker: {
    alignSelf: "stretch",
    width: "100%",
  },
});
