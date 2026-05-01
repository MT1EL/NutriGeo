import { User } from "lucide-react-native";
import React from "react";
import { StyleSheet, View } from "react-native";
import Input from "../ui/Input";
import WizzardContentLayout from "./layout";

const PhysicalData = () => {
  return (
    <WizzardContentLayout
      title="ფიზიკური მონაცემები"
      subtitle="ეს ინფორმაცია დაგვეხმარება შენთვის სწორი კალორიული მიზნის გამოთვლაში"
    >
      <View style={styles.container}>
        <Input Icon={User} placeholder={"175"} label="სიმაღლე" />
        <Input Icon={User} placeholder={"66.5"} label="წონა" />
        <Input Icon={User} placeholder={"20"} label="ასაკი" />
      </View>
    </WizzardContentLayout>
  );
};

export default PhysicalData;
const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
});
