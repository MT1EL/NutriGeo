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
import { useColorScheme } from "react-native";

const ALLERGIES: ChipItem[] = [
  { key: "milk", label: "რძე", Icon: Milk },
  { key: "egg", label: "კვერცხი", Icon: Egg },
  { key: "nuts", label: "თხილეული", Icon: Nut },
  { key: "shell", label: "ზღვის პროდ.", Icon: Shell },
  { key: "wheat", label: "გლუტენი", Icon: Wheat },
  { key: "fish", label: "თევზი", Icon: Fish },
];

const RESTRICTIONS: ChipItem[] = [
  { key: "no-alcohol", label: "უალკოჰოლო", Icon: Wine },
  { key: "low-sodium", label: "დაბ. ნატრიუმი", Icon: Apple },
  { key: "low-sugar", label: "დაბ. შაქარი", Icon: Apple },
];

export default function HealthScreen() {
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

  return (
    <SubScreenLayout title="ჯანმრთელობა" subtitle="ალერგია, შეზღუდვები, დიეტა">
      <DietPicker value={diet} onChange={setDiet} />
      <ToggleChipsCard
        title="ალერგია"
        caption="მონიშნე — გავფილტრავთ რეცეპტებს"
        items={ALLERGIES}
        selected={allergies}
        onToggle={toggleAllergy}
        activeColor={theme.error}
      />
      <ToggleChipsCard
        title="შეზღუდვები"
        caption="დამატებითი მოთხოვნები"
        items={RESTRICTIONS}
        selected={restrictions}
        onToggle={toggleRestriction}
        activeColor={theme.brand}
        activeBg={theme.brandSoft}
      />
      <Button onPress={save} disabled={isSaving}>
        {isSaving ? "ინახება..." : "შენახვა"}
      </Button>
    </SubScreenLayout>
  );
}
