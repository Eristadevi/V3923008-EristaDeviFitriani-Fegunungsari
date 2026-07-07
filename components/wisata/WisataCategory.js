import React from "react";

import { StyleSheet, Text, View } from "react-native";

export default function WisataCategory() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pilihan Wisata</Text>

      <Text style={styles.description}>
        Pilih destinasi wisata yang ingin kamu kunjungi.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 14,
  },

  title: {
    color: "#222222",
    fontSize: 21,
    fontWeight: "900",
    marginBottom: 6,
  },

  description: {
    color: "#777777",
    fontSize: 14,
    lineHeight: 20,
  },
});