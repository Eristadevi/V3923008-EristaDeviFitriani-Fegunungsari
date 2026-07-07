import React from "react";
import { FlatList, StyleSheet, View } from "react-native";

import WisataCard from "./WisataCard";
import WisataHeader from "./WisataHeader";
import Footer from "../Footer";
import { wisataData } from "./wisataData";

export default function WisataList({
  category,
  ListHeaderComponent,
  ListFooterComponent,
}) {
  const filteredWisata =
    !category || category === "Semua"
      ? wisataData
      : wisataData.filter((item) => item.category === category);

  return (
    <FlatList
      data={filteredWisata}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <WisataCard item={item} />}
      ListHeaderComponent={ListHeaderComponent || <WisataHeader />}
      ListFooterComponent={
        <View style={styles.footerWrapper}>
          {ListFooterComponent || <Footer />}
        </View>
      }
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingTop: 0,
    paddingBottom: 150,
  },

  footerWrapper: {
    marginHorizontal: 20,
    marginTop: 4,
  },
});