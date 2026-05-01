import { SubScreenLayout } from "@/components/layout/SubScreenLayout";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { FileText } from "lucide-react-native";
import React from "react";
import { StyleSheet, useColorScheme, View } from "react-native";

const SECTIONS: { h: string; p: string }[] = [
  {
    h: "1. სერვისის გამოყენება",
    p: "NutriGeo უზრუნველყოფს კვების ჩაწერისა და კალორიის ანგარიშის ხელსაწყოს. სერვისი არის საინფორმაციო და არ ცვლის სამედიცინო კონსულტაციას.",
  },
  {
    h: "2. ანგარიში",
    p: "ანგარიშის შესაქმნელად საჭიროა იყო 13 წლის ან მეტი. პასუხისმგებელი ხარ შენი ანგარიშის უსაფრთხოებაზე და ყველა აქტივობაზე.",
  },
  {
    h: "3. დასაშვები გამოყენება",
    p: "აკრძალულია სერვისის გამოყენება უკანონო მიზნებისთვის, სხვა მომხმარებლების შემავიწროებლად, ან NutriGeo-ს ინფრასტრუქტურის დაზიანებისთვის.",
  },
  {
    h: "4. შინაარსი",
    p: "შენს მიერ შექმნილი შინაარსი (კვების ჩანაწერები, საკვები) შენი საკუთრებაა. ჩვენ გვაქვს ლიცენზია მათი დამუშავებისთვის სერვისის გასაწევად.",
  },
  {
    h: "5. შეცვლა და შეწყვეტა",
    p: "შეგვიძლია სერვისის ფუნქციები შევცვალოთ ან შეწყვიტოთ ნებისმიერ დროს. შეგატყობინებთ მნიშვნელოვანი ცვლილების შესახებ.",
  },
  {
    h: "6. პასუხისმგებლობის შეზღუდვა",
    p: "სერვისი მოწოდებულია 'როგორც არის' საფუძველზე. NutriGeo არ აგებს პასუხს ჯანმრთელობის შედეგებზე, რომლებიც სერვისის გამოყენებიდან გამომდინარეობს.",
  },
  {
    h: "7. გამოყენებული კანონი",
    p: "ეს ხელშეკრულება რეგულირდება საქართველოს კანონმდებლობით. დავა განიხილება თბილისის სასამართლოში.",
  },
];

export default function TermsScreen() {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  return (
    <SubScreenLayout
      title="წესები და პირობები"
      subtitle="სერვისის გამოყენების ხელშეკრულება"
    >
      <View style={styles.heroIconWrap}>
        <View style={[styles.heroIcon, { backgroundColor: theme.brandSoft }]}>
          <FileText color={theme.brand} size={28} />
        </View>
      </View>

      <ThemedText style={styles.intro} type="secondary">
        NutriGeo-ს გამოყენებით ეთანხმები ამ წესებსა და პირობებს. გთხოვთ
        ყურადღებით წაიკითხო.
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
        ძალაშია 2026 წლის 1 მაისიდან
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
