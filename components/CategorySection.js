import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";

const data = [
  {
    title: "Rasa",
    desc: "Eksplorasi kuliner khas lokal Gunungsari.",
    image: require("../assets/images/kategori1.jpeg"),
    route: "/wisata",
  },
  {
    title: "Budaya",
    desc: "Pelajari budaya dan tradisi masyarakat.",
    image: require("../assets/images/kategori2.jpeg"),
    route: "/wisata",
  },
  {
    title: "Aksara",
    desc: "Mengenal aksara dan literasi tradisional.",
    image: require("../assets/images/kategori3.jpeg"),
    route: "/wisata",
  },
];

export default function CategorySection() {
  return (
    <View style={styles.container}>
      {data.map((item, index) => (
        <View key={index} style={styles.card}>
          <Image source={item.image} style={styles.image} />

          <View style={styles.content}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.desc}>{item.desc}</Text>

            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.8}
              onPress={() => router.push(item.route)}
            >
              <Text style={styles.buttonText}>Lihat</Text>
            </TouchableOpacity>
          </View>
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

  card: {
    marginBottom: 24,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#fffaf5",
  },

  image: {
    width: "100%",
    height: 200,
  },

  content: {
    padding: 16,
  },

  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
  },

  desc: {
    fontSize: 14,
    color: "#6b7280",
    marginVertical: 8,
  },

  button: {
    backgroundColor: "#c29a78",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: "flex-start",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },
});