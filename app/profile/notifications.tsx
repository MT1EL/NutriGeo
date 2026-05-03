import { SubScreenLayout } from "@/components/layout/SubScreenLayout";
import { SettingsGroup, SettingsRow } from "@/components/ui/SettingsRow";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import {
  Bell,
  BellOff,
  Calendar,
  Coffee,
  Droplet,
  Flame,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react-native";
import { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

export default function NotificationsScreen() {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const [all, setAll] = useState(true);
  const [meal, setMeal] = useState(true);
  const [water, setWater] = useState(true);
  const [streak, setStreak] = useState(true);
  const [weekly, setWeekly] = useState(true);
  const [motivational, setMotivational] = useState(false);
  const [social, setSocial] = useState(false);

  const setAllOff = () => {
    setAll(false);
    setMeal(false);
    setWater(false);
    setStreak(false);
    setWeekly(false);
    setMotivational(false);
    setSocial(false);
  };
  const setAllOn = () => {
    setAll(true);
    setMeal(true);
    setWater(true);
    setStreak(true);
    setWeekly(true);
    setMotivational(true);
    setSocial(true);
  };

  return (
    <SubScreenLayout title="შეტყობინებები" subtitle="რა და როდის გინდა მიიღო">
      <View
        style={[
          styles.banner,
          {
            backgroundColor: all ? theme.brandSoft : theme.borderLight,
          },
        ]}
      >
        <View
          style={[
            styles.bannerIcon,
            { backgroundColor: all ? theme.brand : theme.textSecondary },
          ]}
        >
          {all ? (
            <Bell color="#FFFFFF" size={20} />
          ) : (
            <BellOff color="#FFFFFF" size={20} />
          )}
        </View>
        <View style={{ flex: 1 }}>
          <ThemedText style={styles.bannerTitle} numberOfLines={1}>
            {all ? "ყველა შეტყობინება ჩართულია" : "შეტყობინებები გათიშულია"}
          </ThemedText>
          <ThemedText
            type="secondary"
            style={styles.bannerSub}
            numberOfLines={1}
          >
            {all ? "გახდი უფრო თანმიმდევრული" : "ვერ მიიღებ შეხსენებებს"}
          </ThemedText>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => (all ? setAllOff() : setAllOn())}
          style={[styles.bannerBtn, { backgroundColor: theme.card }]}
        >
          <ThemedText
            style={styles.bannerBtnText}
            color={theme.brand}
            numberOfLines={1}
          >
            {all ? "გათიშვა" : "ჩართვა"}
          </ThemedText>
        </TouchableOpacity>
      </View>

      <SettingsGroup title="ყოველდღიური">
        <SettingsRow
          Icon={Coffee}
          iconColor="#E8A02C"
          iconTint={colorScheme === "dark" ? "#3A2E10" : "#FEF6E4"}
          label="კვების შეხსენება"
          hint="საუზმე, სადილი, ვახშამი"
          rightAccessory="switch"
          switchOn={meal && all}
          onSwitchChange={setMeal}
        />
        <SettingsRow
          Icon={Droplet}
          iconColor="#3FA9F5"
          iconTint={colorScheme === "dark" ? "#102A3A" : "#E5F3FE"}
          label="წყლის შეხსენება"
          hint="ყოველ 2 საათში"
          rightAccessory="switch"
          switchOn={water && all}
          onSwitchChange={setWater}
        />
        <SettingsRow
          Icon={Flame}
          iconColor="#FF7A45"
          iconTint={colorScheme === "dark" ? "#3A2010" : "#FEEDE2"}
          label="სტრიკის შენარჩუნება"
          hint="საღამოს მოგაგონებთ"
          rightAccessory="switch"
          switchOn={streak && all}
          onSwitchChange={setStreak}
        />
      </SettingsGroup>

      <SettingsGroup title="შემაჯამებელი">
        <SettingsRow
          Icon={Calendar}
          iconColor="#5B6CE0"
          iconTint={colorScheme === "dark" ? "#222B4A" : "#EEF0FB"}
          label="კვირის ანგარიში"
          hint="ყოველ კვირას, 09:00"
          rightAccessory="switch"
          switchOn={weekly && all}
          onSwitchChange={setWeekly}
        />
        <SettingsRow
          Icon={Trophy}
          iconColor="#FFB020"
          iconTint={colorScheme === "dark" ? "#3A2A0A" : "#FFF4DA"}
          label="მიღწევები"
          hint="ახალი რეკორდი ან ნიშანი"
          rightAccessory="switch"
          switchOn={motivational && all}
          onSwitchChange={setMotivational}
        />
      </SettingsGroup>

      <SettingsGroup title="დამატებითი">
        <SettingsRow
          Icon={Sparkles}
          iconColor="#7C5CFF"
          iconTint={colorScheme === "dark" ? "#2A1F4A" : "#F0EBFE"}
          label="მოტივაცია"
          hint="დილის ციტატები"
          rightAccessory="switch"
          switchOn={motivational && all}
          onSwitchChange={setMotivational}
        />
        <SettingsRow
          Icon={Users}
          iconColor="#E85A8C"
          iconTint={colorScheme === "dark" ? "#3A2030" : "#FCEAF1"}
          label="სოციალური"
          hint="მეგობრების აქტიურობა"
          rightAccessory="switch"
          switchOn={social && all}
          onSwitchChange={setSocial}
        />
      </SettingsGroup>
    </SubScreenLayout>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radius.lg,
  },
  bannerIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  bannerTitle: {
    fontSize: Type.sm,
    fontWeight: "700",
  },
  bannerSub: {
    fontSize: Type.xs,
    marginTop: 2,
  },
  bannerBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
    minWidth: 76,
    alignItems: "center",
  },
  bannerBtnText: {
    fontSize: Type.xs,
    fontWeight: "700",
  },
});
