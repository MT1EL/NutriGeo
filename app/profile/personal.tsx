import { Sex } from "@/api";
import { getProfile, updatePersonal, type PersonalInput } from "@/api/profile";
import { SubScreenLayout } from "@/components/layout/SubScreenLayout";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ThemedText from "@/components/ui/ThemedText";
import { Colors, Radius, Spacing, Type } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import {
  Calendar,
  Mars,
  Ruler,
  User,
  Venus,
  Weight,
} from "lucide-react-native";
import { useEffect } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

const PROFILE_QUERY_KEY = ["Profile"] as const;

type PersonalForm = {
  name: string;
  biological_sex: Sex;
  age: string;
  height_cm: string;
  weight_kg: string;
};

function ageFromBirthDate(birthDate: string | null | undefined): number | null {
  if (!birthDate) return null;
  const birth = new Date(birthDate);
  if (Number.isNaN(birth.getTime())) return null;
  const today = new Date();
  let years = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    years -= 1;
  }
  return years;
}

function birthDateFromAge(ageStr: string): string {
  const age = Number(ageStr);
  const today = new Date();
  const birth = new Date(
    today.getFullYear() - age,
    today.getMonth(),
    today.getDate(),
  );
  return birth.toISOString().slice(0, 10);
}

export default function PersonalScreen() {
  const { user, refreshUser } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();
  const colorScheme = useColorScheme() || "light";
  const theme = Colors[colorScheme];

  const profileQuery = useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: getProfile,
  });
  const profile = profileQuery.data?.data;

  const form = useFormik<PersonalForm>({
    enableReinitialize: true,
    initialValues: {
      name: profile?.name ?? "",
      biological_sex: (profile?.biological_sex as Sex) ?? "male",
      age:
        profile?.age?.toString() ??
        ageFromBirthDate(profile?.birth_date)?.toString() ??
        "",
      height_cm: profile?.height_cm?.toString() ?? "",
      weight_kg: profile?.weight_kg?.toString() ?? "",
    },
    onSubmit: (values) => {
      const payload: PersonalInput = {
        name: values.name.trim(),
        biological_sex: values.biological_sex,
        birth_date: birthDateFromAge(values.age),
        height_cm: Number(values.height_cm),
        weight_kg: Number(values.weight_kg),
      };
      mutation.mutate(payload);
    },
  });

  const mutation = useMutation({
    mutationFn: (input: PersonalInput) => updatePersonal(input),
    onSuccess: async (res) => {
      queryClient.setQueryData(PROFILE_QUERY_KEY, res);
      await queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      await refreshUser();
      toast.success("პირადი მონაცემები შენახულია");
    },
    onError: (err) => {
      const message =
        err instanceof Error ? err.message : "შენახვა ვერ მოხერხდა";
      toast.error(message, "შეცდომა");
    },
  });

  useEffect(() => {
    if (profileQuery.isError) {
      toast.error("პროფილის ჩატვირთვა ვერ მოხერხდა");
    }
  }, [profileQuery.isError, toast]);

  const sexOptions: { key: Sex; label: string; Icon: typeof Mars }[] = [
    { key: "male", label: "კაცი", Icon: Mars },
    { key: "female", label: "ქალი", Icon: Venus },
  ];

  if (profileQuery.isLoading) {
    return (
      <SubScreenLayout
        title="პირადი ინფორმაცია"
        subtitle="შენი პროფილის მონაცემები"
      >
        <View style={styles.loader}>
          <ActivityIndicator color={theme.brand} />
        </View>
      </SubScreenLayout>
    );
  }

  return (
    <SubScreenLayout
      title="პირადი ინფორმაცია"
      subtitle="შენი პროფილის მონაცემები"
    >
      <View style={{ gap: Spacing.sm }}>
        <ThemedText style={styles.groupTitle} type="secondary">
          სქესი
        </ThemedText>
        <View style={styles.sexRow}>
          {sexOptions.map(({ key, label, Icon }) => {
            const isActive = key === form.values.biological_sex;
            return (
              <TouchableOpacity
                key={key}
                onPress={() => form.setFieldValue("biological_sex", key)}
                activeOpacity={0.85}
                style={[
                  styles.sexCard,
                  {
                    borderColor: isActive ? theme.brand : theme.border,
                    backgroundColor: isActive ? theme.brandSoft : theme.card,
                  },
                ]}
              >
                <View
                  style={[
                    styles.sexIcon,
                    {
                      backgroundColor: isActive
                        ? theme.brand
                        : theme.borderLight,
                    },
                  ]}
                >
                  <Icon
                    color={isActive ? "#FFFFFF" : theme.textSecondary}
                    size={22}
                  />
                </View>
                <ThemedText
                  style={styles.sexLabel}
                  color={isActive ? theme.brand : theme.text}
                >
                  {label}
                </ThemedText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={{ gap: Spacing.md }}>
        <ThemedText style={styles.groupTitle} type="secondary">
          ძირითადი მონაცემები
        </ThemedText>
        <View>
          <Input
            Icon={User}
            label="სახელი"
            value={form.values.name}
            onChangeText={(text) => form.setFieldValue("name", text)}
          />
          <Input
            Icon={Calendar}
            label="ასაკი"
            value={form.values.age}
            onChangeText={(text) => form.setFieldValue("age", text)}
            keyboardType="number-pad"
          />
        </View>
        <View style={styles.twoCol}>
          <View style={{ flex: 1 }}>
            <Input
              Icon={Ruler}
              label="სიმაღლე (სმ)"
              value={form.values.height_cm}
              onChangeText={(text) => form.setFieldValue("height_cm", text)}
              keyboardType="number-pad"
            />
          </View>
          <View style={{ flex: 1 }}>
            <Input
              Icon={Weight}
              label="წონა (კგ)"
              value={form.values.weight_kg}
              onChangeText={(text) => form.setFieldValue("weight_kg", text)}
              keyboardType="decimal-pad"
            />
          </View>
        </View>
      </View>

      <View style={{ gap: Spacing.md }}>
        <ThemedText style={styles.groupTitle} type="secondary">
          საკონტაქტო
        </ThemedText>
        <Input
          Icon={User}
          label="ელფოსტა"
          defaultValue={user?.email}
          keyboardType="email-address"
          disabled
        />
      </View>

      <Button
        onPress={() => form.handleSubmit()}
        disabled={mutation.isPending || !form.dirty}
      >
        {mutation.isPending ? "ინახება..." : "შენახვა"}
      </Button>
    </SubScreenLayout>
  );
}

const styles = StyleSheet.create({
  groupTitle: {
    fontSize: Type.xs,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginLeft: Spacing.xs,
    opacity: 0.7,
  },
  sexRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  sexCard: {
    flex: 1,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    alignItems: "center",
    gap: Spacing.sm,
  },
  sexIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  sexLabel: {
    fontSize: Type.base,
    fontWeight: "700",
  },
  twoCol: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  loader: {
    paddingVertical: Spacing.xxxl,
    alignItems: "center",
  },
});
