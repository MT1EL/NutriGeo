import BaseCard from "@/components/cards/BaseCard";
import { SubScreenLayout } from "@/components/layout/SubScreenLayout";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import {
  Beef,
  Droplet,
  Flame,
  Target,
  TrendingDown,
  Weight,
  Wheat,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

type Pace = "slow" | "moderate" | "fast";

const PACE_OPTIONS: {
  key: Pace;
  label: string;
  desc: string;
  weeklyKg: number;
}[] = [
  { key: "slow", label: "ნელი", desc: "0.25 კგ/კვ", weeklyKg: 0.25 },
  { key: "moderate", label: "საშუალო", desc: "0.5 კგ/კვ", weeklyKg: 0.5 },
  { key: "fast", label: "სწრაფი", desc: "0.75 კგ/კვ", weeklyKg: 0.75 },
];

export default function GoalsScreen() {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const [pace, setPace] = useState<Pace>("moderate");

  const macros = [
    {
      label: "ცილა",
      pct: 30,
      grams: 150,
      color: theme.macroProtein,
      Icon: Beef,
    },
    {
      label: "ნახშირწყალი",
      pct: 45,
      grams: 225,
      color: theme.macroCarbs,
      Icon: Wheat,
    },
    {
      label: "ცხიმი",
      pct: 25,
      grams: 56,
      color: theme.macroFat,
      Icon: Droplet,
    },
  ];

  return (
    <SubScreenLayout
      title="მიზნები"
      subtitle="წონა, კალორია, მაკრო"
    >
      <BaseCard>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <View style={[styles.cardIcon, { backgroundColor: "#E6F6EA" }]}>
              <TrendingDown color="#34A867" size={18} />
            </View>
            <View style={{ gap: 2 }}>
              <ThemedText style={styles.cardTitle}>წონის მიზანი</ThemedText>
              <ThemedText type="secondary" style={styles.cardCaption}>
                მიმდინარე ტემპით 6 კვირა
              </ThemedText>
            </View>
          </View>
        </View>
        <View style={styles.twoCol}>
          <View style={{ flex: 1 }}>
            <Input
              Icon={Weight}
              label="მიმდინარე"
              defaultValue="80.4"
              keyboardType="decimal-pad"
            />
          </View>
          <View style={{ flex: 1 }}>
            <Input
              Icon={Target}
              label="მიზანი"
              defaultValue="75.0"
              keyboardType="decimal-pad"
            />
          </View>
        </View>
        <View style={{ gap: Spacing.sm }}>
          <ThemedText style={styles.subLabel} type="secondary">
            კვირეული ტემპი
          </ThemedText>
          <View style={styles.paceRow}>
            {PACE_OPTIONS.map((opt) => {
              const isActive = opt.key === pace;
              return (
                <TouchableOpacity
                  key={opt.key}
                  onPress={() => setPace(opt.key)}
                  activeOpacity={0.85}
                  style={[
                    styles.paceCard,
                    {
                      borderColor: isActive ? theme.brand : theme.border,
                      backgroundColor: isActive
                        ? theme.brandSoft
                        : theme.card,
                    },
                  ]}
                >
                  <ThemedText
                    style={styles.paceLabel}
                    color={isActive ? theme.brand : theme.text}
                  >
                    {opt.label}
                  </ThemedText>
                  <ThemedText style={styles.paceDesc} type="secondary">
                    {opt.desc}
                  </ThemedText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </BaseCard>

      <BaseCard>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <View style={[styles.cardIcon, { backgroundColor: "#FEEDE2" }]}>
              <Flame color="#FF7A45" size={18} />
            </View>
            <View style={{ gap: 2 }}>
              <ThemedText style={styles.cardTitle}>კალორიის მიზანი</ThemedText>
              <ThemedText type="secondary" style={styles.cardCaption}>
                გათვლილი შენი მონაცემებით
              </ThemedText>
            </View>
          </View>
        </View>
        <Input
          Icon={Flame}
          label="დღიური მიზანი (კალ)"
          defaultValue="2000"
          keyboardType="number-pad"
        />
        <View style={styles.calBreakdown}>
          {[
            { label: "BMR", value: "1750" },
            { label: "აქტიურობა", value: "+550" },
            { label: "დეფიციტი", value: "−300" },
          ].map((item) => (
            <View key={item.label} style={styles.calBreakdownItem}>
              <ThemedText style={styles.breakdownValue}>
                {item.value}
              </ThemedText>
              <ThemedText style={styles.breakdownLabel} type="secondary">
                {item.label}
              </ThemedText>
            </View>
          ))}
        </View>
      </BaseCard>

      <BaseCard>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <View
              style={[
                styles.cardIcon,
                { backgroundColor: theme.brandSoft },
              ]}
            >
              <Beef color={theme.brand} size={18} />
            </View>
            <View style={{ gap: 2 }}>
              <ThemedText style={styles.cardTitle}>მაკრო ბალანსი</ThemedText>
              <ThemedText type="secondary" style={styles.cardCaption}>
                კალორიის გადანაწილება
              </ThemedText>
            </View>
          </View>
        </View>

        <View style={styles.macroBarStack}>
          {macros.map((m) => (
            <View
              key={m.label}
              style={{
                width: `${m.pct}%`,
                backgroundColor: m.color,
              }}
            />
          ))}
        </View>

        <View style={{ gap: Spacing.md }}>
          {macros.map(({ label, pct, grams, color, Icon }) => (
            <View key={label} style={styles.macroRow}>
              <View
                style={[styles.macroIcon, { backgroundColor: color + "22" }]}
              >
                <Icon color={color} size={16} />
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText style={styles.macroLabel}>{label}</ThemedText>
                <ThemedText style={styles.macroSub} type="secondary">
                  {grams}გ / {pct}%
                </ThemedText>
              </View>
              <ThemedText style={styles.macroPct} color={color}>
                {Math.round((pct / 100) * 2000)} კალ
              </ThemedText>
            </View>
          ))}
        </View>
      </BaseCard>

      <Button onPress={() => null}>შენახვა</Button>
    </SubScreenLayout>
  );
}

const styles = StyleSheet.create({
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    flex: 1,
  },
  cardIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: Type.lg,
    fontWeight: "700",
  },
  cardCaption: {
    fontSize: Type.xs,
  },
  twoCol: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  subLabel: {
    fontSize: Type.xs,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginLeft: Spacing.xs,
    opacity: 0.7,
  },
  paceRow: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  paceCard: {
    flex: 1,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    alignItems: "center",
    gap: 4,
  },
  paceLabel: {
    fontSize: Type.sm,
    fontWeight: "700",
  },
  paceDesc: {
    fontSize: Type.xs,
  },
  calBreakdown: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  calBreakdownItem: {
    flex: 1,
    alignItems: "center",
    gap: 2,
    paddingVertical: Spacing.sm,
  },
  breakdownValue: {
    fontSize: Type.lg,
    fontWeight: "700",
  },
  breakdownLabel: {
    fontSize: Type.xs,
    fontWeight: "600",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  macroBarStack: {
    flexDirection: "row",
    height: 12,
    borderRadius: Radius.pill,
    overflow: "hidden",
    marginTop: Spacing.xs,
  },
  macroRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
  },
  macroIcon: {
    width: 32,
    height: 32,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  macroLabel: {
    fontSize: Type.base,
    fontWeight: "600",
  },
  macroSub: {
    fontSize: Type.xs,
    marginTop: 2,
  },
  macroPct: {
    fontSize: Type.sm,
    fontWeight: "700",
  },
});
