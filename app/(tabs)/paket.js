import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import PaketHeader from "../../components/paket/PaketHeader";
import PaketList from "../../components/paket/PaketList";
import Footer from "../../components/Footer";

export default function PaketScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <PaketHeader />
        <PaketList />
        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f5f0",
  },
});