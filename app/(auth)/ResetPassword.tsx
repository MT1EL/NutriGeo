import AuthLayout from "@/components/layout/AuthLayout";
import { router } from "expo-router";
import { Eye } from "lucide-react-native";
import React from "react";

type Props = {};

function ResetPasswordScreen(props: Props) {
  const inputs = [
    {
      Icon: Eye,
      placeholder: "ახალი პაროლი",
    },
    {
      Icon: Eye,
      placeholder: "გაიმეორე ახალი პაროლი",
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
        router.replace("/Login");
      }}
    />
  );
}

export default ResetPasswordScreen;
