import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

const data = [
  { icon: "book-open", title: "Konten Lokal", desc: "Berbasis kearifan lokal" },
  { icon: "users", title: "Keberagaman", desc: "Menjaga budaya Indonesia" },
  { icon: "link", title: "Terhubung", desc: "Menghubungkan generasi" },
  { icon: "archive", title: "Katalog", desc: "Data tersusun rapi" },
  { icon: "smartphone", title: "Digitalisasi", desc: "Media pembelajaran modern" },
  { icon: "home", title: "Ruang Belajar", desc: "Tempat belajar bersama" },
];

export default function FeatureSection() {
  return (
    <View style={styles.container}>
      
      <Text style={styles.kicker}>Wisata Gunungsari</Text>
      <Text style={styles.title}>
        Cara Mengenal Indonesia Melalui Budaya
      </Text>

      <View style={styles.grid}>
        {data.map((item, index) => (
          <View key={index} style={styles.card}>
            <Feather name={item.icon} size={28} color="#c29a78" />
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDesc}>{item.desc}</Text>
          </View>
        ))}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 22,
    paddingBottom: 60,
    backgroundColor: "#fff",
  },

  kicker: {
    color: "#c29a78",
    fontWeight: "800",
    marginBottom: 8,
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 20,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  card: {
    width: "48%",
    backgroundColor: "#fffaf5",
    padding: 16,
    borderRadius: 16,
    marginBottom: 14,
  },

  cardTitle: {
    marginTop: 10,
    fontWeight: "800",
    color: "#111827",
  },

  cardDesc: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },
});