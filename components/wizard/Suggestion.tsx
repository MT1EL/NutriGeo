import { useWizard } from "@/contexts/WizardContext";
import { calculateMacroTargets } from "@/utils/nutrition";
import { Beef, Droplet, Flame, Wheat } from "lucide-react-native";
import React, { useEffect, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import Input from "../ui/Input";
import WizzardContentLayout from "./layout";

const Suggestion = () => {
  const { data, setField } = useWizard();

  const computed = useMemo(() => {
    if (
      !data.biological_sex ||
      !data.activity_level ||
      !data.goal_type ||
      !data.height_cm ||
      !data.weight_kg ||
      !data.age
    ) {
      return null;
    }
    return calculateMacroTargets({
      biological_sex: data.biological_sex,
      weight_kg: Number(data.weight_kg),
      height_cm: Number(data.height_cm),
      age: Number(data.age),
      activity_level: data.activity_level,
      goal_type: data.goal_type,
    });
  }, [
    data.biological_sex,
    data.activity_level,
    data.goal_type,
    data.height_cm,
    data.weight_kg,
    data.age,
  ]);

  // Seed inputs with computed defaults the first time we have all data.
  useEffect(() => {
    if (!computed) return;
    if (!data.daily_calorie_target)
      setField("daily_calorie_target", String(computed.kcal));
    if (!data.protein_g) setField("protein_g", String(computed.protein_g));
    if (!data.carbs_g) setField("carbs_g", String(computed.carbs_g));
    if (!data.fat_g) setField("fat_g", String(computed.fat_g));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [computed]);

  const fields = [
    {
      key: "daily_calorie_target" as const,
      label: "კალორია",
      Icon: Flame,
    },
    { key: "protein_g" as const, label: "ცილა (გ)", Icon: Beef },
    { key: "carbs_g" as const, label: "ნახშირწყალი (გ)", Icon: Wheat },
    { key: "fat_g" as const, label: "ცხიმი (გ)", Icon: Droplet },
  ];

  return (
    <WizzardContentLayout
      title="შენი დღიური მიზნები"
      subtitle="გამოთვლილია შენი მონაცემების მიხედვით — შეგიძლია შეცვალო"
    >
      <View style={styles.container}>
        {fields.map((f) => (
          <View style={styles.item} key={f.key}>
            <Input
              label={f.label}
              value={data[f.key]}
              onChangeText={(t) => setField(f.key, t)}
              Icon={f.Icon}
              keyboardType="decimal-pad"
            />
          </View>
        ))}
      </View>
    </WizzardContentLayout>
  );
};

export default Suggestion;
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },
  item: {
    flexBasis: "48%",
  },
});
