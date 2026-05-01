import { ImageBackground } from "expo-image";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../themed-text";

const ArticleCover = () => {
  return (
    <TouchableOpacity>
      <ImageBackground
        source={require("@/assets/images/article_cover.png")}
        style={styles.container}
      >
        <View style={styles.overlay} />
        <ThemedText style={styles.title}>რა არის კალორია?</ThemedText>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default ArticleCover;
const styles = StyleSheet.create({
  container: {
    width: 200,
    height: 100,
    borderRadius: 16,
    overflow: "hidden",
    padding: 12,
  },
  overlay: {
    position: "absolute",
    inset: 0,
    backgroundColor: "#212121",
    opacity: 0.25,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFF",
  },
});
