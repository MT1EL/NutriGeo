import { resetPassword } from "@/api/auth";
import AuthLayout from "@/components/layout/AuthLayout";
import { useToast } from "@/contexts/ToastContext";
import { router } from "expo-router";
import { useFormik } from "formik";
import { Eye, Lock } from "lucide-react-native";
import { useTranslation } from "react-i18next";

type FormValues = { newPassword: string; confirmPassword: string };

function ResetPasswordScreen() {
  const { t } = useTranslation();
  const toast = useToast();

  const validate = (values: FormValues) => {
    const errors: Partial<Record<keyof FormValues, string>> = {};
    if (!values.newPassword) errors.newPassword = t("auth.reset.newPassword");
    else if (values.newPassword.length < 8)
      errors.newPassword = t("validation.passwordMin");
    if (!values.confirmPassword)
      errors.confirmPassword = t("auth.reset.repeatNew");
    else if (values.confirmPassword !== values.newPassword)
      errors.confirmPassword = t("validation.passwordsDoNotMatch");
    return errors;
  };

  const form = useFormik<FormValues>({
    initialValues: { newPassword: "", confirmPassword: "" },
    validate,
    onSubmit: async (values, helpers) => {
      try {
        await resetPassword(values.newPassword);
        toast.success(t("auth.reset.success"), t("common.done"));
        router.replace("/Login");
      } catch (err) {
        const message =
          err instanceof Error ? err.message : t("changePassword.failed");
        toast.error(message, t("common.error"));
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  const errorOf = (field: keyof FormValues) =>
    form.touched[field] && form.errors[field] ? form.errors[field] : undefined;

  const inputs = [
    {
      name: "newPassword",
      Icon: Lock,
      placeholder: t("changePassword.new"),
      value: form.values.newPassword,
      onChangeText: form.handleChange("newPassword"),
      errorText: errorOf("newPassword"),
      secure: true,
    },
    {
      name: "confirmPassword",
      Icon: Eye,
      placeholder: t("auth.reset.repeatNew"),
      value: form.values.confirmPassword,
      onChangeText: form.handleChange("confirmPassword"),
      errorText: errorOf("confirmPassword"),
      secure: true,
    },
  ];

  return (
    <AuthLayout
      illustrationSource={require("@/assets/illustrations/forgot-password.png")}
      illustrationSize="medium"
      title={t("changePassword.new")}
      subtitle={t("auth.reset.subtitle")}
      label={form.isSubmitting ? t("common.loading") : t("common.save")}
      inputs={inputs}
      onPress={() => {
        if (form.isSubmitting) return;
        form.handleSubmit();
      }}
    />
  );
}

export default ResetPasswordScreen;
