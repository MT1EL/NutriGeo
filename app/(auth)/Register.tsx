import AuthLayout from "@/components/layout/AuthLayout";
import { router } from "expo-router";
import { Eye, Mail, User } from "lucide-react-native";
import React from "react";

type Props = {};

function RegisterScreen(props: Props) {
  const inputs = [
    {
      Icon: User,
      placeholder: "სახელი და გვარი",
    },
    {
      Icon: Mail,
      placeholder: "ელ.ფოსტა",
    },
    {
      Icon: Eye,
      placeholder: "პაროლი",
    },
    {
      Icon: Eye,
      placeholder: "გაიმეორე პაროლი",
    },
  ];
  return (
    <AuthLayout
      illustrationSource={require("@/assets/illustrations/sign-up.png")}
      title="რეგისტრაცია"
      subtitle="შექმენი ახალი ანგარიშში"
      label={"რეგისტრაცია"}
      inputs={inputs}
      footerLinkText={"უკვე გაქ ანგარიში?"}
      footerLinkLabel={"შესვლა"}
      footerLinkAction={() => {
        router.replace("/Login");
      }}
      onPress={() => {
        router.replace("/Wizard");
      }}
    />
  );
}

export default RegisterScreen;
