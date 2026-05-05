import AuthLayout from "@/components/layout/AuthLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { track } from "@/lib/analytics";
import { isValidEmail } from "@/utils/validation";
import { router } from "expo-router";
import { useFormik } from "formik";
import { Eye, Mail } from "lucide-react-native";
import { useTranslation } from "react-i18next";

type FormValues = { email: string; password: string };

function LoginScreen() {
  const { t } = useTranslation();
  const toast = useToast();
  const { signIn } = useAuth();

  const validate = (values: FormValues) => {
    const errors: Partial<Record<keyof FormValues, string>> = {};
    if (!values.email.trim()) errors.email = t("validation.enterEmail");
    else if (!isValidEmail(values.email))
      errors.email = t("validation.invalidEmail");
    if (!values.password) errors.password = t("validation.enterPassword");
    return errors;
  };

  const form = useFormik<FormValues>({
    initialValues: { email: "", password: "" },
    validate,
    onSubmit: async (values, helpers) => {
      try {
        await signIn(values.email.trim().toLowerCase(), values.password);
        track("login_completed");
        toast.success(t("auth.login.welcomeBack"));
        // AuthGate handles redirect once status flips to authenticated
      } catch (err) {
        let message = t("auth.login.failed");

        if (err instanceof Error) {
          message = err.message;
        }

        helpers.setFieldError("password", message);
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
      Icon: Mail,
      placeholder: t("common.email"),
      value: form.values.email,
      onChangeText: form.handleChange("email"),
      errorText: errorOf("email"),
      keyboardType: "email-address" as const,
    },
    {
      Icon: Eye,
      placeholder: t("common.password"),
      value: form.values.password,
      onChangeText: form.handleChange("password"),
      errorText: errorOf("password"),
      secure: true,
      actionText: t("auth.login.forgotPassword"),
      onActionTextPress: () => router.push("/ForgotPassword"),
    },
  ];

  return (
    <AuthLayout
      illustrationSource={require("@/assets/images/logo.png")}
      title={t("auth.login.submit")}
      subtitle={t("auth.login.title")}
      label={form.isSubmitting ? t("common.loading") : t("auth.login.submit")}
      inputs={inputs}
      footerLinkText={t("auth.login.noAccount")}
      footerLinkLabel={t("auth.register.submit")}
      footerLinkAction={() => {
        router.replace("/Register");
      }}
      onPress={() => {
        if (form.isSubmitting) return;
        form.handleSubmit();
      }}
    />
  );
}

export default LoginScreen;
