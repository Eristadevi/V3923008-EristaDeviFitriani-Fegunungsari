import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

export default function WisataHeader() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/gunungsari.jpeg")}
        style={styles.image}
      />

      <View style={styles.overlay} />

      <View style={styles.textContainer}>
        <Text style={styles.label}>Wisata Lokal</Text>

        <Text style={styles.title}>Wisata Gunungsari</Text>

        <Text style={styles.description}>
          Jelajahi budaya, kuliner, dan keindahan Desa Gunungsari.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 220,
    position: "relative",
    marginBottom: 30,
    backgroundColor: "#ddd",
  },

  image: {
    width: "100%",
    height: "100%",
    position: "absolute",
    resizeMode: "cover",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.42)",
  },

  textContainer: {
    position: "absolute",
    left: 22,
    right: 22,
    bottom: 22,
  },

  label: {
    color: "#E6C09B",
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 5,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 29,
    fontWeight: "900",
    marginBottom: 6,
  },

  description: {
    color: "#F5F5F5",
    fontSize: 14,
    lineHeight: 20,
  },
});