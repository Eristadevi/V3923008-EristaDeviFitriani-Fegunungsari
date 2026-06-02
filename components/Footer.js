import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function Footer() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wisata Gunungsari</Text>

      <Text style={styles.desc}>
        Platform edukasi budaya, wisata, dan kearifan lokal desa.
      </Text>

      <View style={styles.social}>
        <Feather name="facebook" size={22} color="#fff" />
        <Feather name="instagram" size={22} color="#fff" />
        <Feather name="youtube" size={22} color="#fff" />
      </View>

      <Text style={styles.copy}>
        © 2025 Gunungsari. All rights reserved.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#111827",
    padding: 30,
    alignItems: "center",
  },

  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 10,
  },

  desc: {
    color: "#d1d5db",
    textAlign: "center",
    marginBottom: 20,
  },

  social: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 20,
  },

  copy: {
    color: "#9ca3af",
    fontSize: 12,
  },
});