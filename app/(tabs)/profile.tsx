import { getProfile } from "@/api/profile";
import { getStatsOverview } from "@/api/stats";
import BaseCard from "@/components/cards/BaseCard";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileMenuRow from "@/components/profile/ProfileMenuRow";
import ImageSourceSheet from "@/components/ui/ImageSourceSheet";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Spacing, Type } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import {
  pickFromCamera,
  pickFromLibrary,
  type PickedImage,
} from "@/utils/pickImage";
import { uploadImage } from "@/utils/uploadImage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  Bookmark,
  ChefHat,
  Crown,
  Globe,
  Heart,
  LogOut,
  Settings,
  Star,
  Target,
  User,
} from "lucide-react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { TAB_BAR_HEIGHT } from "./_layout";

const ProfilePage = () => {
  const { t } = useTranslation();
  const { signOut, refreshUser, user } = useAuth();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const toast = useToast();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["Profile"],
    queryFn: getProfile,
  });
  const overviewQuery = useQuery({
    queryKey: ["stats", "overview", "month"],
    queryFn: () => getStatsOverview("month"),
  });

  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarSheetOpen, setAvatarSheetOpen] = useState(false);

  const avatarMutation = useMutation({
    mutationFn: async (image: PickedImage) => {
      if (!user?.id) throw new Error(t("common.userNotFound"));
      const ext = image.mimeType?.includes("png")
        ? "png"
        : image.mimeType?.includes("webp")
          ? "webp"
          : image.mimeType?.includes("heic")
            ? "heic"
            : "jpg";
      return uploadImage("avatars", image, { path: `${user.id}.${ext}` });
    },
    onSuccess: async (publicUrl) => {
      await queryClient.invalidateQueries({ queryKey: ["Profile"] });
      await refreshUser();
      toast.success(t("food.photoUpdated"));
    },
    onError: (err) => {
      console.warn("[avatar] upload failed", err);
      const message =
        err instanceof Error ? err.message : t("food.photoUploadFailed");
      toast.error(message, t("common.error"));
    },
    onSettled: () => setUploadingAvatar(false),
  });

  const launchPicker = async (kind: "camera" | "library") => {
    try {
      const picked =
        kind === "camera"
          ? await pickFromCamera({ aspect: [1, 1] })
          : await pickFromLibrary({ aspect: [1, 1] });
      if (!picked) return;
      setUploadingAvatar(true);
      avatarMutation.mutate(picked);
    } catch (err) {
      setUploadingAvatar(false);
      console.warn("[avatar] picker failed", err);
      const message =
        err instanceof Error ? err.message : t("common.errorGeneric");
      toast.error(message, t("common.error"));
    }
  };

  const openAvatarMenu = () => setAvatarSheetOpen(true);

  return (
    <>
      <ScrollView
        style={{ backgroundColor: theme.surface }}
        contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT + 40 }}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader
          profile={data?.data?.profile}
          summary={overviewQuery.data?.data.summary}
          onAvatarPress={openAvatarMenu}
          uploadingAvatar={uploadingAvatar}
        />

        <View style={styles.body}>
          <ThemedText style={styles.sectionTitle}>
            {t("profile.account")}
          </ThemedText>
          <BaseCard style={styles.cardList}>
            <ProfileMenuRow
              Icon={User}
              label={t("profile.personal")}
              hint={t("profile.personalHint")}
              tint={colorScheme === "dark" ? "#22335A" : "#EAF2FE"}
              iconColor={theme.brand}
              href="/profile/personal"
            />
            <ProfileMenuRow
              Icon={Target}
              label={t("profile.goals")}
              hint={t("profile.goalsHint")}
              tint={colorScheme === "dark" ? "#1F3A28" : "#E6F6EA"}
              iconColor="#34A867"
              href="/profile/goals"
            />
            <ProfileMenuRow
              Icon={Heart}
              label={t("profile.health")}
              hint={t("profile.healthHint")}
              tint={colorScheme === "dark" ? "#3A2030" : "#FCEAF1"}
              iconColor="#E85A8C"
              href="/profile/health"
            />
          </BaseCard>

          <ThemedText style={styles.sectionTitle}>
            {t("profile.library")}
          </ThemedText>
          <BaseCard style={styles.cardList}>
            <ProfileMenuRow
              Icon={Bookmark}
              label={t("profile.savedArticles")}
              tint={colorScheme === "dark" ? "#222B4A" : "#EEF0FB"}
              iconColor="#5B6CE0"
              href="/profile/library/articles"
            />
            <ProfileMenuRow
              Icon={Heart}
              label={t("profile.savedRecipes")}
              tint={colorScheme === "dark" ? "#3A2030" : "#FCEAF1"}
              iconColor="#E85A8C"
              href="/profile/library/recipes"
            />
            <ProfileMenuRow
              Icon={Star}
              label={t("profile.favoriteFoods")}
              tint={colorScheme === "dark" ? "#3A2A0A" : "#FFF4DA"}
              iconColor="#FFB020"
              href="/profile/library/favorite-foods"
            />
            <ProfileMenuRow
              Icon={ChefHat}
              label={t("profile.myFoods")}
              tint={colorScheme === "dark" ? "#1F3A28" : "#E6F6EA"}
              iconColor="#34A867"
              href="/profile/library/my-foods"
            />
          </BaseCard>

          <ThemedText style={styles.sectionTitle}>
            {t("profile.appSection")}
          </ThemedText>
          <BaseCard style={styles.cardList}>
            <ProfileMenuRow
              Icon={Crown}
              label={t("premium.screenTitle")}
              hint={t("premium.screenSubtitle")}
              tint={colorScheme === "dark" ? "#3A2A0A" : "#FFF4DA"}
              iconColor="#FFB020"
              href="/profile/premium"
            />
            <ProfileMenuRow
              Icon={Bell}
              label={t("profile.notifications")}
              tint={colorScheme === "dark" ? "#3A2E10" : "#FEF6E4"}
              iconColor="#E8A02C"
              href="/profile/notifications"
            />
            <ProfileMenuRow
              Icon={Globe}
              label={t("profile.language")}
              hint={t("profile.languageGeorgian")}
              tint={colorScheme === "dark" ? "#222B4A" : "#EEF0FB"}
              iconColor="#5B6CE0"
              href="/profile/language"
            />
            <ProfileMenuRow
              Icon={Settings}
              label={t("profile.settings")}
              tint={theme.borderLight}
              iconColor={theme.text}
              href="/profile/settings"
            />
          </BaseCard>

          <TouchableOpacity
            activeOpacity={0.6}
            style={styles.logout}
            onPress={() => signOut()}
          >
            <LogOut color={theme.error} size={18} />
            <ThemedText style={styles.logoutText} color={theme.error}>
              {t("profile.logout")}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <ImageSourceSheet
        visible={avatarSheetOpen}
        onClose={() => setAvatarSheetOpen(false)}
        onPickCamera={() => launchPicker("camera")}
        onPickLibrary={() => launchPicker("library")}
        title={t("food.photoUpdateTitle")}
      />
    </>
  );
};

export default ProfilePage;

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Type.sm,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginTop: Spacing.sm,
    marginLeft: Spacing.xs,
    opacity: 0.7,
  },
  cardList: {
    padding: Spacing.sm,
    gap: 0,
  },
  logout: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
    marginTop: Spacing.lg,
  },
  logoutText: {
    fontSize: Type.base,
    fontWeight: "600",
  },
});
