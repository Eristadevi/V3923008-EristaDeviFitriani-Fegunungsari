import React from "react";
import { View, Text, StyleSheet } from "react-native";

const posts = [
  "Wisata Alam Gunungsari yang Wajib Dikunjungi",
  "Melestarikan Budaya Lokal di Era Digital",
  "Keindahan Desa dan Kearifan Lokal",
];

export default function BlogSection() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Artikel & Berita</Text>

      {posts.map((item, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.category}>Berita</Text>
          <Text style={styles.postTitle}>{item}</Text>
          <Text style={styles.meta}>2025 • Admin</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 22,
    paddingBottom: 60,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#fffaf5",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },

  category: {
    color: "#c29a78",
    fontWeight: "700",
    marginBottom: 6,
  },

  postTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
  },

  meta: {
    marginTop: 6,
    fontSize: 12,
    color: "#6b7280",
  },
});