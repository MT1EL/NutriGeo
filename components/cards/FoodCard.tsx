import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { Image } from "expo-image";
import { Minus, Plus } from "lucide-react-native";
import React from "react";
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
  action?: "add" | "remove" | "none";
  onActionPress?: () => void;
};

const FoodCard = ({
  title = "ჩიზქეიქი",
  calories = 321,
  serving = "1 ნაჭერი (80გ)",
  proteinG = 6,
  carbsG = 32,
  fatG = 18,
  image,
  onPress,
  action = "add",
  onActionPress,
}: Props) => {
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
          <View style={styles.titleRow}>
            <ThemedText style={styles.title} numberOfLines={1}>
              {title}
            </ThemedText>
            <View
              style={[styles.calBadge, { backgroundColor: theme.brandSoft }]}
            >
              <ThemedText style={styles.calBadgeText} color={theme.brand}>
                {calories} კალ
              </ThemedText>
            </View>
          </View>
          <ThemedText type="secondary" style={styles.serving}>
            {serving}
          </ThemedText>
          <View style={styles.macroRow}>
            <View style={styles.macroPill}>
              <View
                style={[styles.macroDot, { backgroundColor: theme.macroProtein }]}
              />
              <ThemedText style={styles.macroText} type="secondary">
                ც {proteinG}გ
              </ThemedText>
            </View>
            <View style={styles.macroPill}>
              <View
                style={[styles.macroDot, { backgroundColor: theme.macroCarbs }]}
              />
              <ThemedText style={styles.macroText} type="secondary">
                ნ {carbsG}გ
              </ThemedText>
            </View>
            <View style={styles.macroPill}>
              <View
                style={[styles.macroDot, { backgroundColor: theme.macroFat }]}
              />
              <ThemedText style={styles.macroText} type="secondary">
                ცხ {fatG}გ
              </ThemedText>
            </View>
          </View>
        </View>
        {action !== "none" && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onActionPress}
            style={[styles.actionBtn, { backgroundColor: actionBg }]}
            hitSlop={6}
          >
            <ActionIcon color={actionFg} size={18} />
          </TouchableOpacity>
        )}
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
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
});
