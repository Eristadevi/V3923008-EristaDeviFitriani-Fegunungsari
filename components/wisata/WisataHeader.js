import { View, Text, StyleSheet, Image } from "react-native";

export default function WisataHeader() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/gunungsari.jpeg")}
        style={styles.image}
      />
      <View style={styles.overlay} />

      <View style={styles.textContainer}>
        <Text style={styles.small}>Wisata Lokal</Text>
        <Text style={styles.title}>Wisata Gunungsari</Text>
        <Text style={styles.desc}>
          Jelajahi budaya, kuliner, dan keindahan desa Gunungsari
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 280,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  textContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
  },
  small: {
    color: "#E6C09B",
    fontWeight: "700",
  },
  title: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "900",
  },
  desc: {
    color: "#eee",
    marginTop: 6,
  },
});