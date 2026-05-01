import BaseCard from "@/components/cards/BaseCard";
import { SubScreenLayout } from "@/components/layout/SubScreenLayout";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import {
  ChevronDown,
  ChevronUp,
  HelpCircle,
  LucideIcon,
  Mail,
  MessageCircle,
  Phone,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  LayoutAnimation,
  Linking,
  Platform,
  StyleSheet,
  TouchableOpacity,
  UIManager,
  useColorScheme,
  View,
} from "react-native";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FAQ = [
  {
    q: "როგორ ჩავწერო კვება?",
    a: "გადადი 'დამატება' ტაბზე, აირჩიე კვება (საუზმე, სადილი, სნექი ან ვახშამი) და ხშირი საკვების სიიდან აირჩიე — დააჭირე + ნიშანს.",
  },
  {
    q: "როგორ შევცვალო კალორიის მიზანი?",
    a: "პროფილი → მიზნები → დღიური მიზანი (კალ). შენი მონაცემების მიხედვით ავტომატურად ხდება გათვლა.",
  },
  {
    q: "რას ნიშნავს 'სტრიკი'?",
    a: "ეს არის თანმიმდევრული დღეების რაოდენობა, როდესაც კვება ჩაიწერე. რაც მეტი სტრიკი, მით მეტი დისციპლინა.",
  },
  {
    q: "შემიძლია მაკრო ბალანსის შეცვლა?",
    a: "კი. პროფილი → მიზნები → მაკრო ბალანსი. შეგიძლია შეცვალო ცილის, ნახშირწყლისა და ცხიმის პროცენტული თანაფარდობა.",
  },
  {
    q: "მონაცემები კონფიდენციალურია?",
    a: "კი. ჩვენ ვერასოდეს გავაზიარებთ შენს პერსონალურ მონაცემებს მესამე მხარესთან. ნახე კონფიდენციალურობის პოლიტიკა.",
  },
  {
    q: "როგორ წავშალო ანგარიში?",
    a: "პარამეტრები → ანგარიშის წაშლა. ეს მოქმედება უკან არ ბრუნდება — ყველა მონაცემი წაიშლება.",
  },
];

const CONTACTS: {
  Icon: LucideIcon;
  label: string;
  hint: string;
  color: string;
  tint: string;
  tintDark: string;
  action: () => void;
}[] = [
  {
    Icon: Mail,
    label: "ელფოსტა",
    hint: "hello@nutrigeo.ge",
    color: "#34A867",
    tint: "#E6F6EA",
    tintDark: "#1F3A28",
    action: () => Linking.openURL("mailto:hello@nutrigeo.ge"),
  },
  {
    Icon: MessageCircle,
    label: "ჩატი",
    hint: "მოპასუხე 24სთ-ში",
    color: "#5B6CE0",
    tint: "#EEF0FB",
    tintDark: "#222B4A",
    action: () => Linking.openURL("https://nutrigeo.ge/chat"),
  },
  {
    Icon: Phone,
    label: "ცხელი ხაზი",
    hint: "+995 32 2 00 00 00",
    color: "#FF7A45",
    tint: "#FEEDE2",
    tintDark: "#3A2010",
    action: () => Linking.openURL("tel:+995322000000"),
  },
];

export default function HelpScreen() {
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (i: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenIdx((prev) => (prev === i ? null : i));
  };

  return (
    <SubScreenLayout title="დახმარების ცენტრი" subtitle="ხშირად დასმული კითხვები">
      <View style={styles.heroIconWrap}>
        <View style={[styles.heroIcon, { backgroundColor: theme.brandSoft }]}>
          <HelpCircle color={theme.brand} size={28} />
        </View>
      </View>

      <View style={{ gap: Spacing.sm }}>
        {FAQ.map((item, i) => {
          const isOpen = openIdx === i;
          return (
            <BaseCard key={i} style={styles.faqCard}>
              <TouchableOpacity
                onPress={() => toggle(i)}
                activeOpacity={0.6}
                style={styles.faqRow}
              >
                <ThemedText style={styles.faqQ}>{item.q}</ThemedText>
                {isOpen ? (
                  <ChevronUp color={theme.textSecondary} size={18} />
                ) : (
                  <ChevronDown color={theme.textSecondary} size={18} />
                )}
              </TouchableOpacity>
              {isOpen && (
                <View
                  style={[
                    styles.faqA,
                    { borderTopColor: theme.borderLight },
                  ]}
                >
                  <ThemedText style={styles.faqAText} type="secondary">
                    {item.a}
                  </ThemedText>
                </View>
              )}
            </BaseCard>
          );
        })}
      </View>

      <View style={{ gap: Spacing.sm }}>
        <ThemedText style={styles.sectionTitle} type="secondary">
          ვერ იპოვე პასუხი?
        </ThemedText>
        <View style={{ gap: Spacing.sm }}>
          {CONTACTS.map(({ Icon, label, hint, color, tint, tintDark, action }) => (
            <TouchableOpacity
              key={label}
              activeOpacity={0.7}
              onPress={action}
              style={[
                styles.contactRow,
                { backgroundColor: theme.card, borderColor: theme.borderLight },
              ]}
            >
              <View
                style={[
                  styles.contactIcon,
                  { backgroundColor: colorScheme === "dark" ? tintDark : tint },
                ]}
              >
                <Icon color={color} size={18} />
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText style={styles.contactLabel}>{label}</ThemedText>
                <ThemedText style={styles.contactHint} type="secondary">
                  {hint}
                </ThemedText>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
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
  faqCard: {
    padding: 0,
    overflow: "hidden",
  },
  faqRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    gap: Spacing.md,
  },
  faqQ: {
    flex: 1,
    fontSize: Type.base,
    fontWeight: "700",
    lineHeight: 20,
  },
  faqA: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  faqAText: {
    fontSize: Type.sm,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: Type.xs,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginLeft: Spacing.xs,
    opacity: 0.7,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  contactLabel: {
    fontSize: Type.base,
    fontWeight: "700",
  },
  contactHint: {
    fontSize: Type.xs,
    marginTop: 2,
  },
});
