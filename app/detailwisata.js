import React from "react";

import {
  ScrollView,
  StyleSheet,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import DetailWisataHeader from "../components/wisata/DetailWisataHeader";

export default function DetailWisataScreen() {
  const wisata = {
    title: "Pasar Pundensari",

    category: "Wisata Budaya",

    rating: 4.8,

    price: "Rp 5.000",

    description:
      "Pasar wisata budaya khas Desa Gunungsari yang menghadirkan suasana tradisional dan kuliner lokal.",

    image: require("../assets/images/pundensari.jpeg"),
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
      >
        <DetailWisataHeader
          item={wisata}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "#F8F5F0",
  },
});