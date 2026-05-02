import { submitOnboarding, type OnboardingInput } from "@/api/onboarding";
import { updateGoals, type GoalsInput } from "@/api/profile";
import StepItem from "@/components/ui/StepItem";
import ThemedText from "@/components/ui/ThemedText";
import ActivityLevel from "@/components/wizard/ActivityLevel";
import DietPreferences from "@/components/wizard/DietPreferences";
import Goal from "@/components/wizard/Goal";
import GoalDetails from "@/components/wizard/GoalDetails";
import PhysicalData from "@/components/wizard/PhysicalData";
import SexPage from "@/components/wizard/SexPage";
import Suggestion from "@/components/wizard/Suggestion";
import { Colors } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { WizardProvider, useWizard, type WizardData } from "@/contexts/WizardContext";
import { router, useFocusEffect } from "expo-router";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import React, { useCallback, useRef, useState } from "react";
import {
  Alert,
  BackHandler,
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SCREEN_WIDTH = Dimensions.get("window").width;

type WizardStep = {
  component: React.ReactElement;
  validate: (data: WizardData) => string | null;
};

const STEPS: WizardStep[] = [
  { component: <SexPage />, validate: validateSex },
  { component: <PhysicalData />, validate: validatePhysical },
  { component: <Goal />, validate: validateGoal },
  { component: <GoalDetails />, validate: validateGoalDetails },
  { component: <ActivityLevel />, validate: validateActivity },
  { component: <DietPreferences />, validate: () => null },
  { component: <Suggestion />, validate: validateSuggestion },
];

function validateSex(d: WizardData) {
  return d.biological_sex ? null : "აირჩიე სქესი";
}
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
function validatePhysical(d: WizardData) {
  const h = Number(d.height_cm);
  const w = Number(d.weight_kg);
  const age = ageFromBirthDate(d.birth_date);
  if (!h || h < 100 || h > 250) return "შეიყვანე სწორი სიმაღლე";
  if (!w || w < 20 || w > 300) return "შეიყვანე სწორი წონა";
  if (age == null || age < 10 || age > 120)
    return "აირჩიე დაბადების თარიღი";
  return null;
}
function validateGoal(d: WizardData) {
  return d.goal_type ? null : "აირჩიე მიზანი";
}
function validateGoalDetails(d: WizardData) {
  if (d.goal_type === "maintain") return null;
  const target = Number(d.target_weight_kg);
  const current = Number(d.weight_kg);
  if (!target) return "შეიყვანე მიზნობრივი წონა";
  if (d.goal_type === "lose" && target >= current)
    return "მიზნობრივი წონა მიმდინარეზე ნაკლები უნდა იყოს";
  if (d.goal_type === "gain" && target <= current)
    return "მიზნობრივი წონა მიმდინარეზე მეტი უნდა იყოს";
  if (!Number(d.weekly_pace_kg)) return "აირჩიე კვირის ტემპი";
  return null;
}
function validateActivity(d: WizardData) {
  return d.activity_level ? null : "აირჩიე აქტიურობის დონე";
}
function validateSuggestion(d: WizardData) {
  if (!Number(d.daily_calorie_target)) return "შეიყვანე კალორიული მიზანი";
  if (!Number(d.protein_g)) return "შეიყვანე ცილა";
  if (!Number(d.carbs_g)) return "შეიყვანე ნახშირწყალი";
  if (!Number(d.fat_g)) return "შეიყვანე ცხიმი";
  return null;
}

function getDeviceTimezone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Tbilisi";
  } catch {
    return "Asia/Tbilisi";
  }
}

function buildOnboardingPayload(data: WizardData, name: string): OnboardingInput {
  const isMaintain = data.goal_type === "maintain";
  return {
    name,
    biological_sex: data.biological_sex!,
    birth_date: data.birth_date,
    height_cm: Number(data.height_cm),
    weight_kg: Number(data.weight_kg),
    activity_level: data.activity_level!,
    goal_type: data.goal_type!,
    ...(isMaintain
      ? {}
      : {
          target_weight_kg: Number(data.target_weight_kg),
          weekly_pace_kg: Number(data.weekly_pace_kg),
        }),
    diet: data.diet,
    allergies: data.allergies,
    restrictions: data.restrictions,
    timezone: getDeviceTimezone(),
    language: "ka",
    units: "metric",
  };
}

function buildGoalsPayload(data: WizardData): GoalsInput {
  const kcal = Number(data.daily_calorie_target);
  const protein_g = Number(data.protein_g);
  const carbs_g = Number(data.carbs_g);
  const fat_g = Number(data.fat_g);

  // Convert grams back to percentages so the backend can store either.
  const proteinKcal = protein_g * 4;
  const carbsKcal = carbs_g * 4;
  const fatKcal = fat_g * 9;
  const totalMacroKcal = proteinKcal + carbsKcal + fatKcal || 1;

  const isMaintain = data.goal_type === "maintain";
  return {
    goal_type: data.goal_type!,
    activity_level: data.activity_level!,
    daily_calorie_target: kcal,
    protein_pct: Math.round((proteinKcal / totalMacroKcal) * 100),
    carbs_pct: Math.round((carbsKcal / totalMacroKcal) * 100),
    fat_pct: Math.round((fatKcal / totalMacroKcal) * 100),
    ...(isMaintain
      ? {}
      : {
          target_weight_kg: Number(data.target_weight_kg),
          weekly_pace_kg: Number(data.weekly_pace_kg),
        }),
  };
}

function WizardScreen() {
  const { data } = useWizard();
  const { refreshUser, user } = useAuth();
  const toast = useToast();
  const flatListRef = useRef<FlatList<WizardStep>>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const goTo = (index: number) => {
    setActiveStep(index);
    flatListRef.current?.scrollToIndex({ index, animated: true });
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await submitOnboarding(buildOnboardingPayload(data, user?.profile?.name ?? ""));
      let goalsSaved = true;
      try {
        await updateGoals(buildGoalsPayload(data));
      } catch {
        goalsSaved = false;
      }
      await refreshUser();
      if (goalsSaved) {
        toast.success("პროფილი წარმატებით შეიქმნა!");
      } else {
        toast.info("პროფილი შეიქმნა — მაკროები შეცვალე პარამეტრებში");
      }
      router.replace("/Success");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "მონაცემების შენახვა ვერ მოხერხდა";
      toast.error(message, "შეცდომა");
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextPage = () => {
    const error = STEPS[activeStep].validate(data);
    if (error) {
      toast.error(error);
      return;
    }
    if (activeStep < STEPS.length - 1) {
      goTo(activeStep + 1);
    } else {
      void handleSubmit();
    }
  };

  const handlePreviousPage = () => {
    if (activeStep > 0) goTo(activeStep - 1);
  };

  const confirmExit = useCallback(() => {
    Alert.alert(
      "გასვლა?",
      "თუ ახლა გახვალ, შენი პროფილის შევსება დაიკარგება.",
      [
        { text: "გაგრძელება", style: "cancel" },
        {
          text: "გასვლა",
          style: "destructive",
          onPress: () => router.back(),
        },
      ],
    );
  }, []);

  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener("hardwareBackPress", () => {
        if (activeStep > 0) {
          handlePreviousPage();
        } else {
          confirmExit();
        }
        return true;
      });
      return () => sub.remove();
    }, [activeStep, confirmExit]),
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ThemedText style={styles.title}>პროფილის შექმნა</ThemedText>

          <FlatList
          data={STEPS}
          renderItem={({ item }) => (
            <View style={{ width: SCREEN_WIDTH - 40 }}>{item.component}</View>
          )}
          horizontal
          pagingEnabled
          scrollEnabled={false}
          ref={flatListRef}
          keyExtractor={(_, index) => index.toString()}
          getItemLayout={(_, index) => ({
            length: SCREEN_WIDTH - 40,
            offset: (SCREEN_WIDTH - 40) * index,
            index,
          })}
        />

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.button, activeStep === 0 && styles.disabledButton]}
            disabled={activeStep === 0 || submitting}
            onPress={handlePreviousPage}
          >
            <ChevronLeft color={Colors.light.background} />
          </TouchableOpacity>

          <View style={styles.stepsContainer}>
            {STEPS.map((_, index) => (
              <StepItem key={index} isActive={activeStep >= index} />
            ))}
          </View>
          <TouchableOpacity
            style={[styles.button, submitting && styles.disabledButton]}
            onPress={handleNextPage}
            disabled={submitting}
          >
            <ChevronRight color={Colors.light.background} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default function Wizard() {
  return (
    <WizardProvider>
      <WizardScreen />
    </WizardProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  kav: {
    flex: 1,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 26,
    fontWeight: "semibold",
    textAlign: "center",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  button: {
    padding: 8,
    backgroundColor: Colors.light.brand,
    borderRadius: 100,
  },
  stepsContainer: {
    flexDirection: "row",
    gap: 4,
  },
  disabledButton: {
    opacity: 0.3,
  },
});
