import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

import WisataHeader from "../../components/wisata/WisataHeader";
import WisataCategory from "../../components/wisata/WisataCategory";
import WisataList from "../../components/wisata/WisataList";
import Footer from "../../components/Footer";

export default function WisataScreen() {
  const [selected, setSelected] = useState("Semua");

  return (
    <SafeAreaView style={styles.container}>
      <WisataList
        category={selected}
        ListHeaderComponent={
          <>
            <WisataHeader />

            <WisataCategory
              selected={selected}
              setSelected={setSelected}
            />
          </>
        }
        ListFooterComponent={<Footer />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f5f0",
  },
});