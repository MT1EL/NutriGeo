import type { Sex } from "@/api";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { Mars, Venus } from "lucide-react-native";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

const OPTIONS: { key: Sex; label: string; Icon: typeof Mars }[] = [
  { key: "male", label: "კაცი", Icon: Mars },
  { key: "female", label: "ქალი", Icon: Venus },
];

type Props = {
  value: Sex;
  onChange: (next: Sex) => void;
};

export default function SexSelector({ value, onChange }: Props) {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  return (
    <View style={{ gap: Spacing.sm }}>
      <ThemedText style={styles.groupTitle} type="secondary">
        სქესი
      </ThemedText>
      <View style={styles.row}>
        {OPTIONS.map(({ key, label, Icon }) => {
          const isActive = key === value;
          return (
            <TouchableOpacity
              key={key}
              onPress={() => onChange(key)}
              activeOpacity={0.85}
              style={[
                styles.card,
                {
                  borderColor: isActive ? theme.brand : theme.border,
                  backgroundColor: isActive ? theme.brandSoft : theme.card,
                },
              ]}
            >
              <View
                style={[
                  styles.icon,
                  {
                    backgroundColor: isActive ? theme.brand : theme.borderLight,
                  },
                ]}
              >
                <Icon
                  color={isActive ? "#FFFFFF" : theme.textSecondary}
                  size={22}
                />
              </View>
              <ThemedText
                style={styles.label}
                color={isActive ? theme.brand : theme.text}
              >
                {label}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
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
  row: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  card: {
    flex: 1,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    alignItems: "center",
    gap: Spacing.sm,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: Type.base,
    fontWeight: "700",
  },
});
