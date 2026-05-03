import {
  createCustomFood,
  updateCustomFood,
  type CreateFoodInput,
} from "@/api/foods";
import type { Food } from "@/api/types";
import FoodImagePicker, {
  type PickedImage,
} from "@/components/ui/FoodImagePicker";
import Input from "@/components/ui/Input";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { uploadImage } from "@/utils/uploadImage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Beef,
  Droplet,
  Flame,
  Tag,
  Utensils,
  Wheat,
  X,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

type Props = {
  visible: boolean;
  onClose: () => void;
  editingFood?: Food | null;
};

function toNum(s: string): number | null {
  const n = parseFloat(s.replace(",", "."));
  return Number.isFinite(n) && n >= 0 ? n : null;
}

function numToStr(n: number | undefined | null): string {
  if (n == null || !Number.isFinite(n)) return "";
  return String(n);
}

export default function CustomFoodSheet({
  visible,
  onClose,
  editingFood,
}: Props) {
  const isEdit = !!editingFood;
  const { bottom } = useSafeAreaInsets();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const toast = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [servingLabel, setServingLabel] = useState("");
  const [servingGrams, setServingGrams] = useState("");
  const [kcal, setKcal] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [fiber, setFiber] = useState("");
  // PickedImage = newly selected (needs upload). string = existing URL on the
  // food. null = no image (or "remove this food's existing image").
  const [image, setImage] = useState<PickedImage | string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!visible) return;
    setName(editingFood?.name ?? "");
    setBrand(editingFood?.brand ?? "");
    setServingLabel(editingFood?.serving_label ?? "");
    setServingGrams(numToStr(editingFood?.serving_grams));
    setKcal(numToStr(editingFood?.kcal_per_100g));
    setProtein(numToStr(editingFood?.protein_g_per_100g));
    setCarbs(numToStr(editingFood?.carbs_g_per_100g));
    setFat(numToStr(editingFood?.fat_g_per_100g));
    setFiber(numToStr(editingFood?.fiber_g_per_100g));
    setImage(editingFood?.image_url ?? null);
    setUploading(false);
    setErrors({});
  }, [visible, editingFood]);

  const invalidateFoodCaches = () => {
    queryClient.invalidateQueries({ queryKey: ["foods", "all"] });
    queryClient.invalidateQueries({ queryKey: ["foods", "recent"] });
    queryClient.invalidateQueries({ queryKey: ["foods", "mine"] });
    queryClient.invalidateQueries({ queryKey: ["foods", "search"] });
  };

  const mutation = useMutation({
    mutationFn: (input: CreateFoodInput) =>
      isEdit && editingFood
        ? updateCustomFood(editingFood.id, input)
        : createCustomFood(input),
    onSuccess: () => {
      invalidateFoodCaches();
      toast.success(isEdit ? "ცვლილება შენახულია" : "საკვები შეიქმნა");
      onClose();
    },
    onError: (err) => {
      const message =
        err instanceof Error
          ? err.message
          : isEdit
            ? "შენახვა ვერ მოხერხდა"
            : "შექმნა ვერ მოხერხდა";
      toast.error(message, "შეცდომა");
    },
  });

  const handleSave = async () => {
    const next: Record<string, string> = {};
    const trimmedName = name.trim();
    if (!trimmedName) next.name = "შეიყვანე დასახელება";
    const kcalNum = toNum(kcal);
    if (kcalNum == null) next.kcal = "შეიყვანე კალორია";
    const proteinNum = toNum(protein);
    if (proteinNum == null) next.protein = "შეიყვანე ცილა";
    const carbsNum = toNum(carbs);
    if (carbsNum == null) next.carbs = "შეიყვანე ნახშირწყალი";
    const fatNum = toNum(fat);
    if (fatNum == null) next.fat = "შეიყვანე ცხიმი";

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const servingGramsNum = servingGrams ? toNum(servingGrams) : null;
    const fiberNum = fiber ? toNum(fiber) : null;

    // Image resolution:
    //   string → existing URL, leave the field unset so backend keeps it
    //   PickedImage → upload, send the new URL
    //   null → explicitly clear (only matters for edit; for create, undefined is fine)
    let imageField: string | null | undefined;
    if (typeof image === "string") {
      imageField = undefined;
    } else if (image) {
      try {
        setUploading(true);
        imageField = await uploadImage("foods", image, user?.id);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "ფოტოს ატვირთვა ვერ მოხერხდა";
        toast.error(message, "შეცდომა");
        setUploading(false);
        return;
      } finally {
        setUploading(false);
      }
    } else if (isEdit && editingFood?.image_url) {
      imageField = null;
    }

    mutation.mutate({
      name: trimmedName,
      brand: brand.trim() || undefined,
      serving_label: servingLabel.trim() || undefined,
      serving_grams: servingGramsNum ?? undefined,
      kcal_per_100g: kcalNum!,
      protein_g_per_100g: proteinNum!,
      carbs_g_per_100g: carbsNum!,
      fat_g_per_100g: fatNum!,
      fiber_g_per_100g: fiberNum ?? undefined,
      image_url: imageField,
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        style={styles.kav}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Pressable style={styles.backdrop} onPress={onClose}>
          <Pressable
            style={[
              styles.sheetWrap,
              { backgroundColor: theme.surface, paddingBottom: bottom },
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            <SafeAreaView edges={["bottom"]} style={styles.sheetContent}>
              <View style={styles.handleRow}>
                <View
                  style={[styles.handle, { backgroundColor: theme.border }]}
                />
              </View>

              <View style={styles.headerRow}>
                <View style={{ flex: 1, gap: 2 }}>
                  <ThemedText style={styles.title}>
                    {isEdit ? "საკვების რედაქტირება" : "ახალი საკვები"}
                  </ThemedText>
                  <ThemedText type="secondary" style={styles.subtitle}>
                    100გ-ზე გადაანგარიშებული მონაცემები
                  </ThemedText>
                </View>
                <TouchableOpacity
                  onPress={onClose}
                  style={[
                    styles.iconBtn,
                    { backgroundColor: theme.borderLight },
                  ]}
                  hitSlop={6}
                  activeOpacity={0.7}
                >
                  <X color={theme.text} size={18} />
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.scroll}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={styles.form}
              >
                <View style={styles.imagePickerWrap}>
                  <FoodImagePicker
                    value={image}
                    onChange={setImage}
                    uploading={uploading}
                  />
                </View>
                <Input
                  Icon={Utensils}
                  label="დასახელება"
                  placeholder="მაგ. ხორცის სალათი"
                  value={name}
                  onChangeText={(t) => {
                    setName(t);
                    if (errors.name) setErrors({ ...errors, name: "" });
                  }}
                  errorText={errors.name || undefined}
                />
                <Input
                  Icon={Tag}
                  label="ბრენდი (არასავალდებულო)"
                  placeholder="მაგ. Carrefour"
                  value={brand}
                  onChangeText={setBrand}
                />
                <View style={styles.twoCol}>
                  <View style={{ flex: 1 }}>
                    <Input
                      Icon={Utensils}
                      label="პორცია"
                      placeholder="მაგ. ჭიქა"
                      value={servingLabel}
                      onChangeText={setServingLabel}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Input
                      Icon={Utensils}
                      label="გრამი"
                      placeholder="100"
                      value={servingGrams}
                      onChangeText={setServingGrams}
                      keyboardType="decimal-pad"
                    />
                  </View>
                </View>

                <ThemedText style={styles.sectionLabel} type="secondary">
                  100გ-ზე
                </ThemedText>

                <Input
                  Icon={Flame}
                  label="კალორია"
                  placeholder="0"
                  value={kcal}
                  onChangeText={(t) => {
                    setKcal(t);
                    if (errors.kcal) setErrors({ ...errors, kcal: "" });
                  }}
                  keyboardType="decimal-pad"
                  errorText={errors.kcal || undefined}
                />
                <View style={styles.twoCol}>
                  <View style={{ flex: 1 }}>
                    <Input
                      Icon={Beef}
                      label="ცილა (გ)"
                      placeholder="0"
                      value={protein}
                      onChangeText={(t) => {
                        setProtein(t);
                        if (errors.protein)
                          setErrors({ ...errors, protein: "" });
                      }}
                      keyboardType="decimal-pad"
                      errorText={errors.protein || undefined}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Input
                      Icon={Wheat}
                      label="ნახშ. (გ)"
                      placeholder="0"
                      value={carbs}
                      onChangeText={(t) => {
                        setCarbs(t);
                        if (errors.carbs) setErrors({ ...errors, carbs: "" });
                      }}
                      keyboardType="decimal-pad"
                      errorText={errors.carbs || undefined}
                    />
                  </View>
                </View>
                <View style={styles.twoCol}>
                  <View style={{ flex: 1 }}>
                    <Input
                      Icon={Droplet}
                      label="ცხიმი (გ)"
                      placeholder="0"
                      value={fat}
                      onChangeText={(t) => {
                        setFat(t);
                        if (errors.fat) setErrors({ ...errors, fat: "" });
                      }}
                      keyboardType="decimal-pad"
                      errorText={errors.fat || undefined}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Input
                      Icon={Wheat}
                      label="ბოჭკ. (გ)"
                      placeholder="0"
                      value={fiber}
                      onChangeText={setFiber}
                      keyboardType="decimal-pad"
                    />
                  </View>
                </View>
              </ScrollView>
              <TouchableOpacity
                onPress={handleSave}
                activeOpacity={0.85}
                disabled={mutation.isPending || uploading}
                style={[
                  styles.primaryBtn,
                  {
                    backgroundColor: theme.brand,
                    opacity: mutation.isPending || uploading ? 0.6 : 1,
                  },
                ]}
              >
                <ThemedText
                  style={styles.primaryBtnText}
                  color={theme.textOnBrand}
                >
                  {uploading
                    ? "ფოტო იტვირთება..."
                    : mutation.isPending
                      ? "ინახება..."
                      : isEdit
                        ? "შენახვა"
                        : "შექმნა"}
                </ThemedText>
              </TouchableOpacity>
            </SafeAreaView>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  kav: {
    flex: 1,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  sheetWrap: {
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.sm,
    height: "92%",
  },
  sheetContent: {
    gap: Spacing.lg,
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  handleRow: {
    alignItems: "center",
    paddingBottom: Spacing.sm,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: Radius.pill,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  title: {
    fontSize: Type.xl,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: Type.xs,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  form: {
    gap: 0,
    paddingBottom: Spacing.md,
  },
  imagePickerWrap: {
    marginBottom: Spacing.md,
  },
  twoCol: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginLeft: Spacing.xs,
    marginTop: Spacing.sm,
    opacity: 0.7,
  },
  primaryBtn: {
    paddingVertical: Spacing.lg,
    borderRadius: Radius.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: {
    fontSize: Type.lg,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});
