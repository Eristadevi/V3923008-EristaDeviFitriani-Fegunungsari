import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

export default function KnowledgeSection() {
  return (
    <View style={styles.container}>
      
      {/* TEXT */}
      <View style={styles.textBox}>
        <Text style={styles.kicker}>Wisata Gunungsari</Text>

        <Text style={styles.title}>
          Ikhtiar Menjaga Rasa, Budaya dan Aksara Indonesia
        </Text>

        <Text style={styles.desc}>
          Wisata Gunungsari menjadi ruang belajar bersama yang mengedepankan
          budaya, kearifan lokal, serta pengetahuan masyarakat melalui
          pengalaman digital.
        </Text>
      </View>

      {/* GAMBAR BULAT */}
      <Image
        source={require("../assets/images/pengetahuan.jpg")}
        style={styles.image}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 22,
    paddingBottom: 60,
    alignItems: "center",
    gap: 16,
  },

  textBox: {
    flex: 1,
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
    marginBottom: 10,
  },

  desc: {
    fontSize: 14,
    color: "#4b5563",
    lineHeight: 20,
  },

  image: {
    width: 110,
    height: 110,
    borderRadius: 55, // 🔥 bulat
  },
});