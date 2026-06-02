import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import PaketHeader from "../../components/paket/PaketHeader";
import PaketList from "../../components/paket/PaketList";

export default function PaketScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <PaketHeader />
        <PaketList />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f5f0",
  },
  scrollContent: {
    paddingBottom: 90,
  },
});