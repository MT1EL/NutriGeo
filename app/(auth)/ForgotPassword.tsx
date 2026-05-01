import AuthLayout from "@/components/layout/AuthLayout";
import { router } from "expo-router";
import { Mail } from "lucide-react-native";
import React from "react";

type Props = {};

function ForgotPasswordScreen(props: Props) {
  const inputs = [
    {
      Icon: Mail,
      placeholder: "ელ.ფოსტა",
    },
  ];
  return (
    <AuthLayout
      illustrationSource={require("@/assets/illustrations/forgot-password.png")}
      illustrationSize="medium"
      title="დაგავიწყდა პაროლი?"
      subtitle="შეიყვანე ელ. ფოსტა და გამოგიგზავნით ლინკს"
      label={"გაგზავნა"}
      inputs={inputs}
      onPress={() => {
        router.replace("/ResetPassword");
      }}
    />
  );
}

export default ForgotPasswordScreen;
