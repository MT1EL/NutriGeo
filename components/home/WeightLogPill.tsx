import type { DayWeight } from "@/api/home";
import WeightLogSheet from "@/components/sheets/WeightLogSheet";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { useActiveDate } from "@/contexts/ActiveDateContext";
import { useAuth } from "@/contexts/AuthContext";
import { formatTodayKa } from "@/utils/date";
import { ChevronRight, Plus, Scale } from "lucide-react-native";
import { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

function dateLabelFor(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return formatTodayKa(new Date(y, (m || 1) - 1, d || 1));
}

type Props = {
  weight: DayWeight | null;
};

// Daily weight log entry point. Lives just under the home header so the
// user sees it before scrolling — same prominence as the rest of the
// "today's body" data. Tap to log; if there's already a value for the
// active date, the pill displays it.
export default function WeightLogPill({ weight }: Props) {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const { user } = useAuth();
  const { date, isToday } = useActiveDate();
  const [open, setOpen] = useState(false);

  const hasLogged = weight != null;
  const defaultLogWeight = weight?.weight_kg ?? user?.profile.weight_kg ?? 70;

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => setOpen(true)}
        style={[
          styles.pill,
          {
            backgroundColor: hasLogged ? theme.card : theme.brandSoft,
            borderColor: hasLogged ? theme.borderLight : theme.brand + "33",
          },
        ]}
      >
        <View
          style={[
            styles.icon,
            { backgroundColor: hasLogged ? theme.brandSoft : theme.brand },
          ]}
        >
          {hasLogged ? (
            <Scale color={theme.brand} size={18} />
          ) : (
            <Plus color="#FFFFFF" size={18} />
          )}
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          {hasLogged ? (
            <>
              <ThemedText type="secondary" style={styles.label}>
                წონა
              </ThemedText>
              <ThemedText style={styles.value}>
                {weight!.weight_kg.toFixed(1)} კგ
              </ThemedText>
            </>
          ) : (
            <>
              <ThemedText style={styles.cta} color={theme.brand}>
                {isToday ? "ჩაწერე დღევანდელი წონა" : "ჩაწერე ამ დღის წონა"}
              </ThemedText>
              <ThemedText type="secondary" style={styles.label}>
                {dateLabelFor(date)}
              </ThemedText>
            </>
          )}
        </View>
        <ChevronRight color={theme.textSecondary} size={18} />
      </TouchableOpacity>

      <WeightLogSheet
        visible={open}
        onClose={() => setOpen(false)}
        defaultWeightKg={defaultLogWeight}
        dateLabel={dateLabelFor(date)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    opacity: 0.7,
  },
  value: {
    fontSize: Type.xl,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  cta: {
    fontSize: Type.base,
    fontWeight: "700",
  },
});
