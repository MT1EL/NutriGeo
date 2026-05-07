import { forgotPassword } from "@/api/auth";
import AuthLayout from "@/components/layout/AuthLayout";
import { useToast } from "@/contexts/ToastContext";
import { isValidEmail } from "@/utils/validation";
import { router } from "expo-router";
import { useFormik } from "formik";
import { Mail } from "lucide-react-native";
import { useTranslation } from "react-i18next";

type FormValues = { email: string };

function ForgotPasswordScreen() {
  const { t } = useTranslation();
  const toast = useToast();

  const validate = (values: FormValues) => {
    const errors: Partial<Record<keyof FormValues, string>> = {};
    if (!values.email.trim()) errors.email = t("validation.enterEmail");
    else if (!isValidEmail(values.email))
      errors.email = t("validation.invalidEmail");
    return errors;
  };

  const form = useFormik<FormValues>({
    initialValues: { email: "" },
    validate,
    onSubmit: async (values, helpers) => {
      try {
        await forgotPassword(values.email.trim().toLowerCase());
        toast.success(t("auth.forgot.checkEmail"), t("auth.forgot.sent"));
        router.replace("/Login");
      } catch (err) {
        const message =
          err instanceof Error ? err.message : t("auth.forgot.failed");
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
      name: "email",
      Icon: Mail,
      placeholder: t("common.email"),
      value: form.values.email,
      onChangeText: form.handleChange("email"),
      errorText: errorOf("email"),
      keyboardType: "email-address" as const,
    },
  ];

  return (
    <AuthLayout
      illustrationSource={require("@/assets/illustrations/forgot-password.png")}
      illustrationSize="medium"
      title={t("auth.login.forgotPassword")}
      subtitle={t("auth.forgot.subtitle")}
      label={form.isSubmitting ? t("common.loading") : t("auth.forgot.submit")}
      inputs={inputs}
      setFieldTouched={form.setFieldTouched}
      onPress={() => {
        if (form.isSubmitting) return;
        form.handleSubmit();
      }}
    />
  );
}

export default ForgotPasswordScreen;
