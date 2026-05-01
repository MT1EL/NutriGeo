import { SubScreenLayout } from "@/components/layout/SubScreenLayout";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { SettingsGroup } from "@/components/ui/SettingsRow";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import {
  Calendar,
  Ruler,
  User,
  Venus,
  Mars,
  Weight,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

type Sex = "male" | "female";

export default function PersonalScreen() {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const [sex, setSex] = useState<Sex>("male");

  const sexOptions: { key: Sex; label: string; Icon: typeof Mars }[] = [
    { key: "male", label: "კაცი", Icon: Mars },
    { key: "female", label: "ქალი", Icon: Venus },
  ];

  return (
    <SubScreenLayout title="პირადი ინფორმაცია" subtitle="შენი პროფილის მონაცემები">
      <View style={{ gap: Spacing.sm }}>
        <ThemedText style={styles.groupTitle} type="secondary">
          სქესი
        </ThemedText>
        <View style={styles.sexRow}>
          {sexOptions.map(({ key, label, Icon }) => {
            const isActive = key === sex;
            return (
              <TouchableOpacity
                key={key}
                onPress={() => setSex(key)}
                activeOpacity={0.85}
                style={[
                  styles.sexCard,
                  {
                    borderColor: isActive ? theme.brand : theme.border,
                    backgroundColor: isActive ? theme.brandSoft : theme.card,
                  },
                ]}
              >
                <View
                  style={[
                    styles.sexIcon,
                    {
                      backgroundColor: isActive
                        ? theme.brand
                        : theme.borderLight,
                    },
                  ]}
                >
                  <Icon
                    color={isActive ? "#FFFFFF" : theme.textSecondary}
                    size={22}
                  />
                </View>
                <ThemedText
                  style={styles.sexLabel}
                  color={isActive ? theme.brand : theme.text}
                >
                  {label}
                </ThemedText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={{ gap: Spacing.md }}>
        <ThemedText style={styles.groupTitle} type="secondary">
          ძირითადი მონაცემები
        </ThemedText>
        <Input Icon={User} label="სახელი" defaultValue="თორნიკე" />
        <Input
          Icon={Calendar}
          label="ასაკი"
          defaultValue="28"
          keyboardType="number-pad"
        />
        <View style={styles.twoCol}>
          <View style={{ flex: 1 }}>
            <Input
              Icon={Ruler}
              label="სიმაღლე (სმ)"
              defaultValue="178"
              keyboardType="number-pad"
            />
          </View>
          <View style={{ flex: 1 }}>
            <Input
              Icon={Weight}
              label="წონა (კგ)"
              defaultValue="80.4"
              keyboardType="decimal-pad"
            />
          </View>
        </View>
      </View>

      <SettingsGroup title="საკონტაქტო">
        <Input
          Icon={User}
          label="ელფოსტა"
          defaultValue="tornike@nutrigeo.ge"
          keyboardType="email-address"
        />
      </SettingsGroup>

      <Button onPress={() => null}>შენახვა</Button>
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
  sexRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  sexCard: {
    flex: 1,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    alignItems: "center",
    gap: Spacing.sm,
  },
  sexIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  sexLabel: {
    fontSize: Type.base,
    fontWeight: "700",
  },
  twoCol: {
    flexDirection: "row",
    gap: Spacing.md,
  },
});
