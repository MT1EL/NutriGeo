import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { FormikProps } from "formik";
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

import { WizardData } from "@/contexts/WizardContext";
import Input from "../ui/inputs/Input";
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

const PhysicalData = ({ formik }: { formik: FormikProps<WizardData> }) => {
  const { t } = useTranslation();
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
    if (formik.values.birth_date) {
      const d = new Date(formik.values.birth_date);
      if (!Number.isNaN(d.getTime())) return d;
    }
    return new Date(
      today.getFullYear() - 25,
      today.getMonth(),
      today.getDate(),
    );
  }, [formik.values.birth_date]);

  const age = ageFromBirthDate(formik.values.birth_date);

  const onChange = (event: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === "android") {
      setPickerOpen(false);
      if (event.type === "set" && selected) {
        const value = selected.toISOString().slice(0, 10);
        formik.setFieldValue("birth_date", value);
      }
      return;
    }

    if (selected) {
      const value = selected.toISOString().slice(0, 10);
      formik.setFieldValue("birth_date", value);
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
          name="height_cm"
          Icon={Ruler}
          placeholder={t("common.for_example") + " 175"}
          label={t("wizard.physical.heightCm")}
          keyboardType="numeric"
          value={formik.values.height_cm}
          onChangeText={(text) => {
            formik.setFieldValue("height_cm", text);
          }}
          setFieldTouched={formik.setFieldTouched}
          errorText={
            formik.touched.height_cm && formik.errors.height_cm
              ? formik.errors.height_cm
              : undefined
          }
        />

        <Input
          name="weight_kg"
          Icon={Weight}
          placeholder={t("common.for_example") + " 66.5"}
          label={t("wizard.physical.weightKg")}
          keyboardType="decimal-pad"
          value={formik.values.weight_kg}
          onChangeText={(text) => {
            formik.setFieldValue("weight_kg", text);
          }}
          setFieldTouched={formik.setFieldTouched}
          errorText={formik.errors.weight_kg}
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
                borderColor:
                  formik.touched.birth_date && formik.errors.birth_date
                    ? theme.error
                    : theme.border,
              },
            ]}
          >
            <Calendar
              color={
                formik.touched.birth_date && formik.errors.birth_date
                  ? theme.error
                  : theme.textSecondary
              }
            />

            <ThemedText
              style={styles.pickerValue}
              color={
                formik.values.birth_date ? theme.text : theme.textSecondary
              }
            >
              {formik.values.birth_date
                ? formatBirthDate(formik.values.birth_date)
                : "DD.MM.YYYY"}
            </ThemedText>
          </TouchableOpacity>

          {age != null && (
            <ThemedText type="secondary" style={styles.ageHint}>
              {t("wizard.physical.ageLabel")} {age}
            </ThemedText>
          )}
          {formik.touched.birth_date && formik.errors.birth_date && (
            <ThemedText type="error" style={styles.ageHint}>
              {formik.errors.birth_date}
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
    minWidth: "100%",
  },
});
