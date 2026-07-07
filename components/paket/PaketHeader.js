import React from "react";

import {
  View,
  Text,
  StyleSheet,
} from "react-native";

export default function PaketHeader() {
  return (
    <View style={styles.headerBox}>
      <Text style={styles.label}>PAKET WISATA</Text>

      <Text style={styles.title}>
        Pilih Paket Wisata Gunungsari
      </Text>

      <Text style={styles.description}>
        Temukan paket wisata edukasi, budaya, kuliner, live in desa,
        dan pariwisata hijau. Pilih paket untuk melihat detail dan
        mengajukan kunjungan.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerBox: {
    marginBottom: 20,
  },

  label: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 3,
    color: "#0E7490",
    marginBottom: 10,
  },

  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#1F2937",
    lineHeight: 36,
    marginBottom: 12,
  },

  description: {
    fontSize: 15,
    lineHeight: 25,
    color: "#5B5B5B",
  },
});