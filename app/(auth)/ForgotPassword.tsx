import { forgotPassword } from "@/api/auth";
import AuthLayout from "@/components/layout/AuthLayout";
import { useToast } from "@/contexts/ToastContext";
import { isValidEmail } from "@/utils/validation";
import { router } from "expo-router";
import { useFormik } from "formik";
import { Mail } from "lucide-react-native";

type FormValues = { email: string };

function validate(values: FormValues) {
  const errors: Partial<Record<keyof FormValues, string>> = {};
  if (!values.email.trim()) errors.email = "შეიყვანე ელ.ფოსტა";
  else if (!isValidEmail(values.email)) errors.email = "არასწორი ელ.ფოსტა";
  return errors;
}

function ForgotPasswordScreen() {
  const toast = useToast();

  const form = useFormik<FormValues>({
    initialValues: { email: "" },
    validate,
    onSubmit: async (values, helpers) => {
      try {
        await forgotPassword(values.email.trim().toLowerCase());
        toast.success(
          "შეამოწმე ელ.ფოსტა — გამოგიგზავნეთ ლინკი პაროლის აღსადგენად",
          "გაგზავნილია",
        );
        router.replace("/Login");
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "გაგზავნა ვერ მოხერხდა";
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
      Icon: Mail,
      placeholder: "ელ.ფოსტა",
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
      title="დაგავიწყდა პაროლი?"
      subtitle="შეიყვანე ელ. ფოსტა და გამოგიგზავნით ლინკს"
      label={form.isSubmitting ? "გთხოვთ მოიცადოთ..." : "გაგზავნა"}
      inputs={inputs}
      onPress={() => {
        if (form.isSubmitting) return;
        form.handleSubmit();
      }}
    />
  );
}

export default ForgotPasswordScreen;
