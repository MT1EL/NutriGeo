import AuthLayout from "@/components/layout/AuthLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { isValidEmail } from "@/utils/validation";
import { router } from "expo-router";
import { useFormik } from "formik";
import { Eye, Lock, Mail, User } from "lucide-react-native";

type FormValues = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

function validate(values: FormValues) {
  const errors: Partial<Record<keyof FormValues, string>> = {};

  if (!values.fullName.trim()) {
    errors.fullName = "შეიყვანე სახელი";
  }
  if (!values.email.trim()) {
    errors.email = "შეიყვანე ელ.ფოსტა";
  } else if (!isValidEmail(values.email)) {
    errors.email = "არასწორი ელ.ფოსტა";
  }
  if (!values.password) {
    errors.password = "შეიყვანე პაროლი";
  } else if (values.password.length < 8) {
    errors.password = "პაროლი მინიმუმ 8 სიმბოლო";
  }
  if (!values.confirmPassword) {
    errors.confirmPassword = "გაიმეორე პაროლი";
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "პაროლები არ ემთხვევა";
  }

  return errors;
}

function RegisterScreen() {
  const toast = useToast();
  const { signUp } = useAuth();

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
        toast.success("ანგარიში წარმატებით შეიქმნა", "მოგესალმებით!");
        if (user) {
          router.replace("/Wizard");
        } else {
          // No session returned (e.g. email verification required) — send to login.
          router.replace("/Login");
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "რეგისტრაცია ვერ მოხერხდა";
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
      Icon: User,
      placeholder: "სახელი და გვარი",
      value: form.values.fullName,
      onChangeText: form.handleChange("fullName"),
      errorText: errorOf("fullName"),
    },
    {
      Icon: Mail,
      placeholder: "ელ.ფოსტა",
      value: form.values.email,
      onChangeText: form.handleChange("email"),
      errorText: errorOf("email"),
      keyboardType: "email-address" as const,
    },
    {
      Icon: Lock,
      placeholder: "პაროლი",
      value: form.values.password,
      onChangeText: form.handleChange("password"),
      errorText: errorOf("password"),
      secure: true,
    },
    {
      Icon: Eye,
      placeholder: "გაიმეორე პაროლი",
      value: form.values.confirmPassword,
      onChangeText: form.handleChange("confirmPassword"),
      errorText: errorOf("confirmPassword"),
      secure: true,
    },
  ];

  return (
    <AuthLayout
      illustrationSource={require("@/assets/illustrations/sign-up.png")}
      title="რეგისტრაცია"
      subtitle="შექმენი ახალი ანგარიში"
      label={form.isSubmitting ? "გთხოვთ მოიცადოთ..." : "რეგისტრაცია"}
      inputs={inputs}
      footerLinkText={"უკვე გაქ ანგარიში?"}
      footerLinkLabel={"შესვლა"}
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
