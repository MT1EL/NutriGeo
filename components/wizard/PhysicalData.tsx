import { useWizard } from "@/contexts/WizardContext";
import { Calendar, Ruler, Weight } from "lucide-react-native";
import React from "react";
import { StyleSheet, View } from "react-native";
import Input from "../ui/Input";
import WizzardContentLayout from "./layout";

const PhysicalData = () => {
  const { data, setField } = useWizard();
  return (
    <WizzardContentLayout
      title="ფიზიკური მონაცემები"
      subtitle="ეს ინფორმაცია დაგვეხმარება შენთვის სწორი კალორიული მიზნის გამოთვლაში"
    >
      <View style={styles.container}>
        <Input
          Icon={Ruler}
          placeholder={"175"}
          label="სიმაღლე (სმ)"
          keyboardType="numeric"
          value={data.height_cm}
          onChangeText={(t) => setField("height_cm", t)}
        />
        <Input
          Icon={Weight}
          placeholder={"66.5"}
          label="წონა (კგ)"
          keyboardType="decimal-pad"
          value={data.weight_kg}
          onChangeText={(t) => setField("weight_kg", t)}
        />
        <Input
          Icon={Calendar}
          placeholder={"20"}
          label="ასაკი"
          keyboardType="numeric"
          value={data.age}
          onChangeText={(t) => setField("age", t)}
        />
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
