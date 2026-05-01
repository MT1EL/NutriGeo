import AuthLayout from "@/components/layout/AuthLayout";
import { router } from "expo-router";
import { Eye, Mail } from "lucide-react-native";
import React from "react";

function LoginScreen() {
  const inputs = [
    {
      Icon: Mail,
      placeholder: "ელ.ფოსტა",
    },
    {
      Icon: Eye,
      placeholder: "პაროლი",
      actionText: "დაგავიწყდა პაროლი?",
      onActionTextPress: () => router.push("/ForgotPassword"),
    },
  ];
  return (
    <AuthLayout
      illustrationSource={require("@/assets/illustrations/welcome.png")}
      title="შესვლა"
      subtitle="გამარჯობა! შედი ანგარიშში"
      label={"შესვლა"}
      inputs={inputs}
      footerLinkText={"არ გაქვს ანგარიში?"}
      footerLinkLabel={"რეგისტრაცია"}
      footerLinkAction={() => {
        router.replace("/Register");
      }}
      onPress={() => {
        router.replace("/(tabs)");
      }}
    />
  );
}

export default LoginScreen;
