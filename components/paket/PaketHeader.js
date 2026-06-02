import { View, Text, Image, StyleSheet } from "react-native";

export default function PaketHeader() {
  return (
    <View style={styles.container}>
      <Image source={require("../../assets/images/paket.jpg")} style={styles.image} />
      <View style={styles.overlay} />

      <View style={styles.textBox}>
        <Text style={styles.small}>Paket Wisata</Text>
        <Text style={styles.title}>Desa Wisata Gunungsari</Text>
        <Text style={styles.desc}>
          Pilih paket budaya, live-in, edukasi, kuliner, dan gathering.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { height: 260, position: "relative" },
  image: { width: "100%", height: "100%" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  textBox: {
    position: "absolute",
    bottom: 24,
    left: 20,
    right: 20,
  },
  small: {
    color: "#e6c09b",
    fontWeight: "700",
  },
  title: {
    color: "#fff",
    fontSize: 27,
    fontWeight: "900",
    marginTop: 4,
  },
  desc: {
    color: "#eee",
    marginTop: 8,
    lineHeight: 20,
  },
});