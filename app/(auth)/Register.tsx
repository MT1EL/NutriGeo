import AuthLayout from "@/components/layout/AuthLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { track } from "@/lib/analytics";
import { isValidEmail } from "@/utils/validation";
import { router } from "expo-router";
import { useFormik } from "formik";
import { Lock, Mail, User } from "lucide-react-native";
import { useTranslation } from "react-i18next";

type FormValues = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

function RegisterScreen() {
  const { t } = useTranslation();
  const toast = useToast();
  const { signUp } = useAuth();

  const validate = (values: FormValues) => {
    const errors: Partial<Record<keyof FormValues, string>> = {};

    if (!values.fullName.trim()) {
      errors.fullName = t("validation.enterName");
    }

    if (!values.email.trim()) {
      errors.email = t("validation.enterEmail");
    } else if (!isValidEmail(values.email)) {
      errors.email = t("validation.invalidEmail");
    }
    const PASSWORD_RE = /^.{8,72}$/;
    if (!values.password) {
      errors.password = t("validation.enterPassword");
    } else if (!PASSWORD_RE.test(values.password)) {
      errors.password = t("validation.passwordMin");
    }

    if (!values.confirmPassword) {
      errors.confirmPassword = t("auth.register.repeatPassword");
    } else if (values.confirmPassword !== values.password) {
      errors.confirmPassword = t("validation.passwordsDoNotMatch");
    }

    return errors;
  };

  const form = useFormik<FormValues>({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate,
    onSubmit: async (values, helpers) => {
      try {
        const user = await signUp({
          email: values.email.trim().toLowerCase(),
          password: values.password,
          name: values.fullName.trim(),
        });
        track("signup_completed", { has_session: !!user });
        toast.success(t("auth.register.success"), t("auth.register.welcome"));
        if (!user) {
          // No session returned (e.g. email verification required) — send to login.
          // When a session IS returned, AuthGate routes the now-authenticated
          // user from Register → Wizard; navigating here races the gate
          // unmounting the (auth) stack.
          router.replace("/Login");
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : t("auth.register.failed");
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
      name: "fullName",
      Icon: User,
      placeholder: t("auth.register.fullName"),
      value: form.values.fullName,
      onChangeText: form.handleChange("fullName"),
      errorText: errorOf("fullName"),
    },
    {
      name: "email",
      Icon: Mail,
      placeholder: t("common.email"),
      value: form.values.email,
      onChangeText: form.handleChange("email"),
      errorText: errorOf("email"),
      keyboardType: "email-address" as const,
    },
    {
      name: "password",
      Icon: Lock,
      placeholder: t("common.password"),
      value: form.values.password,
      onChangeText: form.handleChange("password"),
      errorText: errorOf("password"),
      secure: true,
    },
    {
      name: "confirmPassword",
      Icon: Lock,
      placeholder: t("auth.register.repeatPassword"),
      value: form.values.confirmPassword,
      onChangeText: form.handleChange("confirmPassword"),
      errorText: errorOf("confirmPassword"),
      secure: true,
    },
  ];
  console.log(errorOf("password"));
  return (
    <AuthLayout
      illustrationSource={require("@/assets/images/logo.png")}
      title={t("auth.register.submit")}
      subtitle={t("auth.login.createAccount")}
      label={
        form.isSubmitting ? t("common.loading") : t("auth.register.submit")
      }
      inputs={inputs}
      setFieldTouched={form.setFieldTouched}
      footerLinkText={t("auth.register.haveAccount")}
      footerLinkLabel={t("auth.login.submit")}
      footerLinkAction={() => {
        router.replace("/Login");
      }}
      onPress={() => {
        if (form.isSubmitting) return;
        form.handleSubmit();
      }}
    />
  );
}

export default RegisterScreen;
