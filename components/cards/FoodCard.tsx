import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { Image } from "expo-image";
import { Minus, Plus } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import {
  ImageSourcePropType,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import ThemedText from "../ui/ThemedText";
import BaseCard from "./BaseCard";

type Props = {
  title?: string;
  calories?: number;
  serving?: string;
  proteinG?: number;
  carbsG?: number;
  fatG?: number;
  image?: ImageSourcePropType | null;
  onPress?: () => void;
  action?: "add" | "remove" | "stepper" | "none";
  onActionPress?: () => void;
  quantity?: number;
  onIncrement?: () => void;
  onDecrement?: () => void;
};

const FoodCard = ({
  title = "",
  calories = 0,
  serving = "",
  proteinG = 0,
  carbsG = 0,
  fatG = 0,
  image,
  onPress,
  action = "add",
  onActionPress,
  quantity,
  onIncrement,
  onDecrement,
}: Props) => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  const ActionIcon = action === "remove" ? Minus : Plus;
  const actionBg = action === "remove" ? theme.error + "1A" : theme.brandSoft;
  const actionFg = action === "remove" ? theme.error : theme.brand;

  const initial = title.charAt(0);

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
      <BaseCard style={styles.card}>
        {image ? (
          <Image source={image} style={styles.image} contentFit="cover" />
        ) : (
          <View
            style={[
              styles.imagePlaceholder,
              { backgroundColor: theme.brandSoft },
            ]}
          >
            <ThemedText style={styles.imagePlaceholderText} color={theme.brand}>
              {initial}
            </ThemedText>
          </View>
        )}
        <View style={{ flex: 1, gap: Spacing.xs + 2 }}>
          <ThemedText style={styles.title} numberOfLines={1}>
            {title}
          </ThemedText>
          <ThemedText type="secondary" style={styles.serving}>
            {serving}
          </ThemedText>
          <View style={styles.macroRow}>
            <View style={styles.macroPill}>
              <View
                style={[
                  styles.macroDot,
                  { backgroundColor: theme.macroProtein },
                ]}
              />
              <ThemedText style={styles.macroText} type="secondary">
                {t("macros.proteinAbbr")} {proteinG}{t("macros.g")}
              </ThemedText>
            </View>
            <View style={styles.macroPill}>
              <View
                style={[styles.macroDot, { backgroundColor: theme.macroCarbs }]}
              />
              <ThemedText style={styles.macroText} type="secondary">
                {t("macros.carbsAbbr")} {carbsG}{t("macros.g")}
              </ThemedText>
            </View>
            <View style={styles.macroPill}>
              <View
                style={[styles.macroDot, { backgroundColor: theme.macroFat }]}
              />
              <ThemedText style={styles.macroText} type="secondary">
                {t("macros.fatAbbr")} {fatG}{t("macros.g")}
              </ThemedText>
            </View>
          </View>
        </View>
        <View style={styles.rightCol}>
          <View
            style={[styles.calBadge, { backgroundColor: theme.brandSoft }]}
          >
            <ThemedText style={styles.calBadgeText} color={theme.brand}>
              {calories} {t("macros.kcalShort")}
            </ThemedText>
          </View>
          {action === "stepper" ? (
            <View style={styles.stepper}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={onDecrement}
                style={[
                  styles.stepperBtn,
                  { backgroundColor: theme.error + "1A" },
                ]}
                hitSlop={6}
              >
                <Minus color={theme.error} size={16} />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={onIncrement}
                style={[
                  styles.stepperBtn,
                  { backgroundColor: theme.brandSoft },
                ]}
                hitSlop={6}
              >
                <Plus color={theme.brand} size={16} />
              </TouchableOpacity>
            </View>
          ) : action !== "none" ? (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onActionPress}
              style={[styles.actionBtn, { backgroundColor: actionBg }]}
              hitSlop={6}
            >
              <ActionIcon color={actionFg} size={18} />
            </TouchableOpacity>
          ) : null}
        </View>
      </BaseCard>
    </TouchableOpacity>
  );
};

export default FoodCard;
const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    padding: Spacing.md,
    gap: Spacing.md,
    alignItems: "center",
  },
  image: {
    width: 56,
    aspectRatio: 1,
    borderRadius: Radius.md,
  },
  imagePlaceholder: {
    width: 56,
    aspectRatio: 1,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  imagePlaceholderText: {
    fontSize: Type.xl,
    fontWeight: "700",
  },
  rightCol: {
    alignItems: "flex-end",
    gap: Spacing.sm,
  },
  title: {
    fontSize: Type.base,
    fontWeight: "700",
    flex: 1,
  },
  calBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.pill,
  },
  calBadgeText: {
    fontSize: Type.xs,
    fontWeight: "700",
  },
  serving: {
    fontSize: Type.xs,
  },
  macroRow: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  macroPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  macroDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  macroText: {
    fontSize: 11,
    fontWeight: "600",
  },
  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  stepperBtn: {
    width: 30,
    height: 30,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
});
