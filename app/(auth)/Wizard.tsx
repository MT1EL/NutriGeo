import StepItem from "@/components/ui/StepItem";
import ThemedText from "@/components/ui/ThemedText";
import ActivityLevel from "@/components/wizard/ActivityLevel";
import Goal from "@/components/wizard/Goal";
import PhysicalData from "@/components/wizard/PhysicalData";
import SexPage from "@/components/wizard/SexPage";
import Suggestion from "@/components/wizard/Suggestion";
import { Colors } from "@/constants/theme";
import { router } from "expo-router";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const SCREEN_WIDTH = Dimensions.get("window").width;
function WizzardScreen() {
  const flatListRef = useRef<FlatList<React.ReactElement>>(null);
  const [activeStep, setActiveStep] = useState(0);
  const steps: React.ReactElement[] = [
    <SexPage key={1} />,
    <PhysicalData key={2} />,
    <Goal key={3} />,
    <ActivityLevel key={4} />,
    <Suggestion key={5} />,
  ];
  const handleNextPage = () => {
    if (activeStep < steps.length - 1) {
      const next = activeStep + 1;
      setActiveStep(next);
      flatListRef.current?.scrollToIndex({
        index: next,
        animated: true,
      });
    } else {
      router.replace("/Success");
    }
  };

  const handlePreviousPage = () => {
    if (activeStep > 0) {
      const prev = activeStep - 1;
      setActiveStep(prev);
      flatListRef.current?.scrollToIndex({
        index: prev,
        animated: true,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ThemedText style={styles.title}>პროფილის შექმნა</ThemedText>

      <FlatList
        data={steps}
        renderItem={({ item }) => (
          <View style={{ width: SCREEN_WIDTH - 40 }}>{item}</View>
        )}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        ref={flatListRef}
        keyExtractor={(_, index) => index.toString()}
        getItemLayout={(_, index) => ({
          length: SCREEN_WIDTH - 40,
          offset: (SCREEN_WIDTH - 40) * index,
          index,
        })}
      />

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, activeStep === 0 && styles.disabledButton]}
          disabled={activeStep === 0}
          onPress={handlePreviousPage}
        >
          <ChevronLeft color={Colors.light.background} />
        </TouchableOpacity>

        <View style={styles.stepsContainer}>
          {steps.map((_, index) => (
            <StepItem key={index} isActive={activeStep >= index} />
          ))}
        </View>
        <TouchableOpacity style={styles.button} onPress={handleNextPage}>
          <ChevronRight color={Colors.light.background} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default WizzardScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 26,
    fontWeight: "semibold",
    textAlign: "center",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  button: {
    padding: 8,
    backgroundColor: Colors.light.brand,
    borderRadius: 100,
  },
  stepsContainer: {
    flexDirection: "row",
    gap: 4,
  },
  step: {
    width: 10,
    height: 10,
  },
  disabledButton: {
    opacity: 0.3,
  },
});
