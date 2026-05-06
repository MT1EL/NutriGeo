import { Sex } from "@/api";
import { getProfile, updatePersonal, type PersonalInput } from "@/api/profile";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import i18n from "@/i18n";
import { ageFromBirthDate, birthDateFromAge } from "@/utils/date";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useEffect } from "react";

const PROFILE_QUERY_KEY = ["Profile"] as const;

type PersonalForm = {
  name: string;
  biological_sex: Sex;
  age: string;
  height_cm: string;
  weight_kg: string;
};

export function usePersonalForm() {
  const { refreshUser } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: getProfile,
  });
  const profile = profileQuery.data?.data?.profile;

  const mutation = useMutation({
    mutationFn: (input: PersonalInput) => updatePersonal(input),
    onSuccess: async (res) => {
      queryClient.setQueryData(PROFILE_QUERY_KEY, res);
      await queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      await refreshUser();
      toast.success(i18n.t("profile.personalScreen.saved"));
    },
    onError: (err) => {
      const message =
        err instanceof Error ? err.message : i18n.t("common.saveFailed");
      toast.error(message, i18n.t("common.error"));
    },
  });

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
      mutation.mutate({
        name: values.name.trim(),
        biological_sex: values.biological_sex,
        birth_date: birthDateFromAge(values.age),
        height_cm: Number(values.height_cm),
        weight_kg: Number(values.weight_kg),
      });
    },
  });

  useEffect(() => {
    if (profileQuery.isError) {
      toast.error(i18n.t("profile.personalScreen.loadFailed"));
    }
  }, [profileQuery.isError, toast]);

  return {
    form,
    isLoading: profileQuery.isLoading,
    isSaving: mutation.isPending,
  };
}
