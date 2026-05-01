import { Stack } from "expo-router";
import React from "react";

type Props = {};

const StackLayout = (props: Props) => {
  return (
    <Stack>
      <Stack.Screen name="Login" options={{ headerShown: false }} />
      <Stack.Screen name="Register" options={{ headerShown: false }} />
      <Stack.Screen name="Wizard" options={{ headerShown: false }} />
      <Stack.Screen name="ForgotPassword" options={{ headerShown: false }} />
      <Stack.Screen name="ResetPassword" options={{ headerShown: false }} />
      <Stack.Screen name="Success" options={{ headerShown: false }} />
    </Stack>
  );
};

export default StackLayout;
