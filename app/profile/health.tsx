import BaseCard from "@/components/cards/BaseCard";
import { SubScreenLayout } from "@/components/layout/SubScreenLayout";
import Button from "@/components/ui/Button";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import {
  Apple,
  Beef,
  Check,
  Egg,
  Fish,
  Leaf,
  Milk,
  Nut,
  Shell,
  Sprout,
  Wheat,
  Wine,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

type Diet = "none" | "vegan" | "vegetarian" | "keto" | "mediterranean";

const DIETS: { key: Diet; label: string; Icon: typeof Apple; color: string }[] = [
  { key: "none", label: "ჩვეულებრივი", Icon: Apple, color: "#64748B" },
  { key: "vegetarian", label: "ვეგეტარიანული", Icon: Sprout, color: "#34A867" },
  { key: "vegan", label: "ვეგანური", Icon: Leaf, color: "#16A34A" },
  { key: "keto", label: "კეტო", Icon: Beef, color: "#7C5CFF" },
  { key: "mediterranean", label: "ხმელთაშუა", Icon: Fish, color: "#3FA9F5" },
];

const ALLERGIES = [
  { key: "milk", label: "რძე", Icon: Milk },
  { key: "egg", label: "კვერცხი", Icon: Egg },
  { key: "nuts", label: "თხილეული", Icon: Nut },
  { key: "shell", label: "ზღვის პროდ.", Icon: Shell },
  { key: "wheat", label: "გლუტენი", Icon: Wheat },
  { key: "fish", label: "თევზი", Icon: Fish },
];

const RESTRICTIONS = [
  { key: "no-alcohol", label: "უალკოჰოლო", Icon: Wine },
  { key: "low-sodium", label: "დაბ. ნატრიუმი", Icon: Apple },
  { key: "low-sugar", label: "დაბ. შაქარი", Icon: Apple },
];

export default function HealthScreen() {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const [diet, setDiet] = useState<Diet>("none");
  const [allergies, setAllergies] = useState<Set<string>>(new Set(["nuts"]));
  const [restrictions, setRestrictions] = useState<Set<string>>(new Set());

  const toggle = (set: Set<string>, key: string) => {
    const next = new Set(set);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    return next;
  };

  return (
    <SubScreenLayout
      title="ჯანმრთელობა"
      subtitle="ალერგია, შეზღუდვები, დიეტა"
    >
      <BaseCard>
        <View style={{ gap: Spacing.xs + 2 }}>
          <ThemedText style={styles.cardTitle}>დიეტური სტილი</ThemedText>
          <ThemedText type="secondary" style={styles.cardCaption}>
            გავლენას მოახდენს რეცეპტების რეკომენდაციაზე
          </ThemedText>
        </View>
        <View style={styles.dietList}>
          {DIETS.map(({ key, label, Icon, color }) => {
            const isActive = diet === key;
            return (
              <TouchableOpacity
                key={key}
                onPress={() => setDiet(key)}
                activeOpacity={0.85}
                style={[
                  styles.dietRow,
                  {
                    borderColor: isActive ? color : theme.border,
                    backgroundColor: isActive
                      ? color + "12"
                      : theme.card,
                  },
                ]}
              >
                <View
                  style={[styles.dietIcon, { backgroundColor: color + "22" }]}
                >
                  <Icon color={color} size={18} />
                </View>
                <ThemedText style={styles.dietLabel}>{label}</ThemedText>
                {isActive && (
                  <View
                    style={[styles.checkBubble, { backgroundColor: color }]}
                  >
                    <Check color="#FFFFFF" size={14} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </BaseCard>

      <BaseCard>
        <View style={{ gap: Spacing.xs + 2 }}>
          <ThemedText style={styles.cardTitle}>ალერგია</ThemedText>
          <ThemedText type="secondary" style={styles.cardCaption}>
            მონიშნე — გავფილტრავთ რეცეპტებს
          </ThemedText>
        </View>
        <View style={styles.chipsWrap}>
          {ALLERGIES.map(({ key, label, Icon }) => {
            const isActive = allergies.has(key);
            return (
              <TouchableOpacity
                key={key}
                activeOpacity={0.85}
                onPress={() => setAllergies((s) => toggle(s, key))}
                style={[
                  styles.chip,
                  {
                    backgroundColor: isActive
                      ? theme.error + "12"
                      : theme.card,
                    borderColor: isActive ? theme.error : theme.border,
                  },
                ]}
              >
                <Icon
                  color={isActive ? theme.error : theme.textSecondary}
                  size={14}
                />
                <ThemedText
                  style={styles.chipLabel}
                  color={isActive ? theme.error : theme.text}
                >
                  {label}
                </ThemedText>
              </TouchableOpacity>
            );
          })}
        </View>
      </BaseCard>

      <BaseCard>
        <View style={{ gap: Spacing.xs + 2 }}>
          <ThemedText style={styles.cardTitle}>შეზღუდვები</ThemedText>
          <ThemedText type="secondary" style={styles.cardCaption}>
            დამატებითი მოთხოვნები
          </ThemedText>
        </View>
        <View style={styles.chipsWrap}>
          {RESTRICTIONS.map(({ key, label, Icon }) => {
            const isActive = restrictions.has(key);
            return (
              <TouchableOpacity
                key={key}
                activeOpacity={0.85}
                onPress={() => setRestrictions((s) => toggle(s, key))}
                style={[
                  styles.chip,
                  {
                    backgroundColor: isActive
                      ? theme.brandSoft
                      : theme.card,
                    borderColor: isActive ? theme.brand : theme.border,
                  },
                ]}
              >
                <Icon
                  color={isActive ? theme.brand : theme.textSecondary}
                  size={14}
                />
                <ThemedText
                  style={styles.chipLabel}
                  color={isActive ? theme.brand : theme.text}
                >
                  {label}
                </ThemedText>
              </TouchableOpacity>
            );
          })}
        </View>
      </BaseCard>

      <Button onPress={() => null}>შენახვა</Button>
    </SubScreenLayout>
  );
}

const styles = StyleSheet.create({
  cardTitle: {
    fontSize: Type.lg,
    fontWeight: "700",
  },
  cardCaption: {
    fontSize: Type.xs,
  },
  dietList: {
    gap: Spacing.sm,
  },
  dietRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1.5,
  },
  dietIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  dietLabel: {
    flex: 1,
    fontSize: Type.base,
    fontWeight: "600",
  },
  checkBubble: {
    width: 22,
    height: 22,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
    borderWidth: 1.5,
  },
  chipLabel: {
    fontSize: Type.sm,
    fontWeight: "600",
  },
});
