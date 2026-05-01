import { resetPassword } from "@/api/auth";
import AuthLayout from "@/components/layout/AuthLayout";
import { useToast } from "@/contexts/ToastContext";
import { router } from "expo-router";
import { useFormik } from "formik";
import { Eye, Lock } from "lucide-react-native";

type FormValues = { newPassword: string; confirmPassword: string };

function validate(values: FormValues) {
  const errors: Partial<Record<keyof FormValues, string>> = {};
  if (!values.newPassword) errors.newPassword = "შეიყვანე ახალი პაროლი";
  else if (values.newPassword.length < 8)
    errors.newPassword = "პაროლი მინიმუმ 8 სიმბოლო";
  if (!values.confirmPassword)
    errors.confirmPassword = "გაიმეორე ახალი პაროლი";
  else if (values.confirmPassword !== values.newPassword)
    errors.confirmPassword = "პაროლები არ ემთხვევა";
  return errors;
}

function ResetPasswordScreen() {
  const toast = useToast();

  const form = useFormik<FormValues>({
    initialValues: { newPassword: "", confirmPassword: "" },
    validate,
    onSubmit: async (values, helpers) => {
      try {
        await resetPassword(values.newPassword);
        toast.success("პაროლი წარმატებით შეიცვალა", "მზადაა");
        router.replace("/Login");
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "პაროლის შეცვლა ვერ მოხერხდა";
        toast.error(message, "შეცდომა");
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  const errorOf = (field: keyof FormValues) =>
    form.touched[field] && form.errors[field] ? form.errors[field] : undefined;

  const inputs = [
    {
      Icon: Lock,
      placeholder: "ახალი პაროლი",
      value: form.values.newPassword,
      onChangeText: form.handleChange("newPassword"),
      errorText: errorOf("newPassword"),
      secure: true,
    },
    {
      Icon: Eye,
      placeholder: "გაიმეორე ახალი პაროლი",
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
      title="ახალი პაროლი"
      subtitle="შეიყვანე ახალი პაროლი ანგარიშისთვის"
      label={form.isSubmitting ? "გთხოვთ მოიცადოთ..." : "შენახვა"}
      inputs={inputs}
      onPress={() => {
        if (form.isSubmitting) return;
        form.handleSubmit();
      }}
    />
  );
}

export default ResetPasswordScreen;
