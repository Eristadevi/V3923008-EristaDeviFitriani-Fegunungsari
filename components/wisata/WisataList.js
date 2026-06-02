import React from "react";
import { FlatList, StyleSheet, View } from "react-native";

import WisataCard from "./WisataCard";

const wisataData = [
  {
    id: 1,
    title: "Pasar Pundensari",
    category: "Buatan",
    price: "Rp 5.000",
    rating: 4.8,
    description: "Pasar wisata budaya khas Desa Gunungsari.",
    image: require("../../assets/images/pundensari.jpeg"),
  },
  {
    id: 2,
    title: "Museum Purabaya",
    category: "Edukasi",
    price: "Rp 15.000",
    rating: 4.7,
    description: "Museum sejarah budaya dan edukasi wisata.",
    image: require("../../assets/images/museum.jpeg"),
  },
  {
    id: 3,
    title: "Batik Demung",
    category: "UMKM",
    price: "Rp 20.000",
    rating: 4.9,
    description: "Wisata edukasi batik khas Desa Gunungsari.",
    image: require("../../assets/images/batikk.jpg"),
  },
];

export default function WisataList({
  category,
  ListHeaderComponent,
  ListFooterComponent,
}) {
  const filteredData =
    category === "Semua"
      ? wisataData
      : wisataData.filter((item) => item.category === category);

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <WisataCard item={item} />}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 120,
  },
});