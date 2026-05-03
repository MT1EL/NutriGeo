import { getProfile } from "@/api/profile";
import { getStatsOverview } from "@/api/stats";
import BaseCard from "@/components/cards/BaseCard";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileMenuRow from "@/components/profile/ProfileMenuRow";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Spacing, Type } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import {
  Bell,
  Bookmark,
  ChefHat,
  Globe,
  Heart,
  LogOut,
  Settings,
  Star,
  Target,
  User,
} from "lucide-react-native";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { TAB_BAR_HEIGHT } from "./_layout";

const ProfilePage = () => {
  const { signOut } = useAuth();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  const { data } = useQuery({
    queryKey: ["Profile"],
    queryFn: getProfile,
  });
  const overviewQuery = useQuery({
    queryKey: ["stats", "overview", "month"],
    queryFn: () => getStatsOverview("month"),
  });

  return (
    <ScrollView
      style={{ backgroundColor: theme.surface }}
      contentContainerStyle={{ paddingBottom: TAB_BAR_HEIGHT + 40 }}
      showsVerticalScrollIndicator={false}
    >
      <ProfileHeader
        profile={data?.data}
        summary={overviewQuery.data?.data.summary}
      />

      <View style={styles.body}>
        <ThemedText style={styles.sectionTitle}>ანგარიში</ThemedText>
        <BaseCard style={styles.cardList}>
          <ProfileMenuRow
            Icon={User}
            label="პირადი ინფორმაცია"
            hint="სახელი, ასაკი, სქესი"
            tint={colorScheme === "dark" ? "#22335A" : "#EAF2FE"}
            iconColor={theme.brand}
            href="/profile/personal"
          />
          <ProfileMenuRow
            Icon={Target}
            label="მიზნები"
            hint="წონა, კალორია, მაკრო"
            tint={colorScheme === "dark" ? "#1F3A28" : "#E6F6EA"}
            iconColor="#34A867"
            href="/profile/goals"
          />
          <ProfileMenuRow
            Icon={Heart}
            label="ჯანმრთელობა"
            hint="ალერგია, შეზღუდვა"
            tint={colorScheme === "dark" ? "#3A2030" : "#FCEAF1"}
            iconColor="#E85A8C"
            href="/profile/health"
          />
        </BaseCard>

        <ThemedText style={styles.sectionTitle}>ბიბლიოთეკა</ThemedText>
        <BaseCard style={styles.cardList}>
          <ProfileMenuRow
            Icon={Bookmark}
            label="შენახული სტატიები"
            tint={colorScheme === "dark" ? "#222B4A" : "#EEF0FB"}
            iconColor="#5B6CE0"
            href="/profile/library/articles"
          />
          <ProfileMenuRow
            Icon={Heart}
            label="შენახული რეცეპტები"
            tint={colorScheme === "dark" ? "#3A2030" : "#FCEAF1"}
            iconColor="#E85A8C"
            href="/profile/library/recipes"
          />
          <ProfileMenuRow
            Icon={Star}
            label="საყვარელი საკვები"
            tint={colorScheme === "dark" ? "#3A2A0A" : "#FFF4DA"}
            iconColor="#FFB020"
            href="/profile/library/favorite-foods"
          />
          <ProfileMenuRow
            Icon={ChefHat}
            label="ჩემი საკვები"
            tint={colorScheme === "dark" ? "#1F3A28" : "#E6F6EA"}
            iconColor="#34A867"
            href="/profile/library/my-foods"
          />
        </BaseCard>

        <ThemedText style={styles.sectionTitle}>აპლიკაცია</ThemedText>
        <BaseCard style={styles.cardList}>
          <ProfileMenuRow
            Icon={Bell}
            label="შეტყობინებები"
            tint={colorScheme === "dark" ? "#3A2E10" : "#FEF6E4"}
            iconColor="#E8A02C"
            href="/profile/notifications"
          />
          <ProfileMenuRow
            Icon={Globe}
            label="ენა"
            hint="ქართული"
            tint={colorScheme === "dark" ? "#222B4A" : "#EEF0FB"}
            iconColor="#5B6CE0"
            href="/profile/language"
          />
          <ProfileMenuRow
            Icon={Settings}
            label="პარამეტრები"
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
            გასვლა
          </ThemedText>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
