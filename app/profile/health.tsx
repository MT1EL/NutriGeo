import DietPicker from "@/components/health/DietPicker";
import ToggleChipsCard, {
  type ChipItem,
} from "@/components/health/ToggleChipsCard";
import { SubScreenLayout } from "@/components/layout/SubScreenLayout";
import Button from "@/components/ui/Button";
import { Colors } from "@/constants/theme";
import { useEditHealth } from "@/hooks/use-edit-health";
import {
  Apple,
  Egg,
  Fish,
  Milk,
  Nut,
  Shell,
  Wheat,
  Wine,
} from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { useColorScheme } from "react-native";

export default function HealthScreen() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const {
    diet,
    setDiet,
    allergies,
    toggleAllergy,
    restrictions,
    toggleRestriction,
    isSaving,
    save,
  } = useEditHealth();

  const ALLERGIES: ChipItem[] = [
    { key: "milk", label: t("diet.milk"), Icon: Milk },
    { key: "egg", label: t("diet.egg"), Icon: Egg },
    { key: "nuts", label: t("diet.nuts"), Icon: Nut },
    { key: "shell", label: t("diet.seafood"), Icon: Shell },
    { key: "wheat", label: t("diet.gluten"), Icon: Wheat },
    { key: "fish", label: t("diet.fish"), Icon: Fish },
  ];

  const RESTRICTIONS: ChipItem[] = [
    { key: "no-alcohol", label: t("diet.alcoholFree"), Icon: Wine },
    { key: "low-sodium", label: t("statistics.lowSodium"), Icon: Apple },
    { key: "low-sugar", label: t("statistics.lowSugar"), Icon: Apple },
  ];

  return (
    <SubScreenLayout
      title={t("profile.health")}
      subtitle={t("profile.healthSubtitle")}
    >
      <DietPicker value={diet} onChange={setDiet} />
      <ToggleChipsCard
        title={t("profile.allergy")}
        caption={t("profile.allergyCaption")}
        items={ALLERGIES}
        selected={allergies}
        onToggle={toggleAllergy}
        activeColor={theme.error}
      />
      <ToggleChipsCard
        title={t("profile.restrictions")}
        caption={t("profile.additionalRestrictions")}
        items={RESTRICTIONS}
        selected={restrictions}
        onToggle={toggleRestriction}
        activeColor={theme.brand}
        activeBg={theme.brandSoft}
      />
      <Button onPress={save} disabled={isSaving}>
        {isSaving ? t("common.saving") : t("common.save")}
      </Button>
    </SubScreenLayout>
  );
}
