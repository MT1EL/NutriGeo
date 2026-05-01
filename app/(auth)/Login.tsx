import AuthLayout from "@/components/layout/AuthLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { router } from "expo-router";
import { useFormik } from "formik";
import { isValidEmail } from "@/utils/validation";
import { Eye, Mail } from "lucide-react-native";

type FormValues = { email: string; password: string };

function validate(values: FormValues) {
  const errors: Partial<Record<keyof FormValues, string>> = {};
  if (!values.email.trim()) errors.email = "შეიყვანე ელ.ფოსტა";
  else if (!isValidEmail(values.email)) errors.email = "არასწორი ელ.ფოსტა";
  if (!values.password) errors.password = "შეიყვანე პაროლი";
  return errors;
}

function LoginScreen() {
  const toast = useToast();
  const { signIn } = useAuth();

  const form = useFormik<FormValues>({
    initialValues: { email: "", password: "" },
    validate,
    onSubmit: async (values, helpers) => {
      try {
        await signIn(values.email.trim().toLowerCase(), values.password);
        toast.success("კეთილი იყოს თქვენი დაბრუნება!");
        // AuthGate handles redirect once status flips to authenticated
      } catch (err) {
        const message = err instanceof Error ? err.message : "შესვლა ვერ მოხერხდა";
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
    {
      Icon: Eye,
      placeholder: "პაროლი",
      value: form.values.password,
      onChangeText: form.handleChange("password"),
      errorText: errorOf("password"),
      secure: true,
      actionText: "დაგავიწყდა პაროლი?",
      onActionTextPress: () => router.push("/ForgotPassword"),
    },
  ];

  return (
    <AuthLayout
      illustrationSource={require("@/assets/illustrations/welcome.png")}
      title="შესვლა"
      subtitle="გამარჯობა! შედი ანგარიშში"
      label={form.isSubmitting ? "გთხოვთ მოიცადოთ..." : "შესვლა"}
      inputs={inputs}
      footerLinkText={"არ გაქვს ანგარიში?"}
      footerLinkLabel={"რეგისტრაცია"}
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
