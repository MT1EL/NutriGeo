import { SubScreenLayout } from "@/components/layout/SubScreenLayout";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { Shield } from "lucide-react-native";
import React from "react";
import { StyleSheet, useColorScheme, View } from "react-native";

const SECTIONS: { h: string; p: string }[] = [
  {
    h: "1. რა მონაცემებს ვაგროვებთ",
    p: "ჩვენ ვაგროვებთ მონაცემებს, რომლებიც აუცილებელია სერვისის გასაწევად: სახელი, ელფოსტა, ასაკი, წონა, სიმაღლე, კვების ჩანაწერები და აქტივობის სტატისტიკა.",
  },
  {
    h: "2. როგორ ვიყენებთ მონაცემებს",
    p: "შენი მონაცემები გამოიყენება პერსონალიზებული რეკომენდაციების მისაცემად, კალორიის და მაკრო მიზნების გამოსათვლელად და პროგრესის თვალყურის სადევნებლად.",
  },
  {
    h: "3. გაზიარება",
    p: "ჩვენ არასოდეს ვყიდით ან ვაზიარებთ შენს პერსონალურ მონაცემებს მესამე მხარეს რეკლამის ან მარკეტინგის მიზნით. გაზიარება ხდება მხოლოდ კანონის მოთხოვნით.",
  },
  {
    h: "4. მონაცემების უსაფრთხოება",
    p: "ჩვენ ვიყენებთ მაღალი სტანდარტის დაშიფვრას როგორც გადაცემის, ისე შენახვის პროცესში. შენი ანგარიში დაცულია პაროლით.",
  },
  {
    h: "5. შენი უფლებები",
    p: "შეგიძლია ნებისმიერ დროს მოითხოვო მონაცემების ექსპორტი, განახლება ან წაშლა. დაგვიკავშირდი privacy@nutrigeo.ge.",
  },
  {
    h: "6. ცვლილებები",
    p: "ამ პოლიტიკის ცვლილების შემთხვევაში შეგატყობინებთ აპლიკაციით ან ელფოსტით. ბოლო განახლება: 2026 წლის 1 მაისი.",
  },
];

export default function PrivacyScreen() {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  return (
    <SubScreenLayout
      title="კონფიდენციალურობა"
      subtitle="მონაცემთა დამუშავების პოლიტიკა"
    >
      <View style={styles.heroIconWrap}>
        <View style={[styles.heroIcon, { backgroundColor: theme.brandSoft }]}>
          <Shield color={theme.brand} size={28} />
        </View>
      </View>

      <ThemedText style={styles.intro} type="secondary">
        ჩვენ ვაფასებთ შენს კონფიდენციალურობას. ეს დოკუმენტი ხსნის, თუ როგორ
        ვაგროვებთ, ვიყენებთ და ვიცავთ შენს მონაცემებს.
      </ThemedText>

      <View style={{ gap: Spacing.lg }}>
        {SECTIONS.map((s) => (
          <View key={s.h} style={{ gap: Spacing.sm }}>
            <ThemedText style={styles.h}>{s.h}</ThemedText>
            <ThemedText style={styles.p} type="secondary">
              {s.p}
            </ThemedText>
          </View>
        ))}
      </View>

      <ThemedText style={styles.footer} type="secondary">
        ბოლო განახლება: 2026 წლის 1 მაისი
      </ThemedText>
    </SubScreenLayout>
  );
}

const styles = StyleSheet.create({
  heroIconWrap: {
    alignItems: "center",
    paddingTop: Spacing.sm,
  },
  heroIcon: {
    width: 64,
    height: 64,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  intro: {
    fontSize: Type.base,
    lineHeight: 22,
  },
  h: {
    fontSize: Type.lg,
    fontWeight: "700",
  },
  p: {
    fontSize: Type.sm,
    lineHeight: 22,
  },
  footer: {
    fontSize: Type.xs,
    textAlign: "center",
    opacity: 0.7,
    marginTop: Spacing.lg,
  },
});
