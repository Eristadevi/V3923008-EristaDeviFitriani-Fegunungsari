import React from "react";

import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";

import { Feather } from "@expo/vector-icons";
import { MotiView } from "moti";
import { router } from "expo-router";

export default function AboutSection() {
  return (
    <View style={styles.container}>
      {/* HEADER */}
      <MotiView
        from={{
          opacity: 0,
          translateY: 25,
        }}
        animate={{
          opacity: 1,
          translateY: 0,
        }}
        transition={{
          type: "timing",
          duration: 900,
        }}
      >
        {/* ABOUT */}
        <Text style={styles.aboutText}>
          ABOUT US
        </Text>

        {/* TITLE */}
        <Text style={styles.heading}>
          Desa Wisata {"\n"}
          Gunungsari
        </Text>
      </MotiView>

      {/* IMAGE */}
      <MotiView
        from={{
          opacity: 0,
          scale: 1.08,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          type: "timing",
          duration: 1400,
          delay: 200,
        }}
      >
        <Image
          source={require("../assets/images/about.jpeg")}
          style={styles.image}
        />
      </MotiView>

      {/* CONTENT */}
      <MotiView
        from={{
          opacity: 0,
          translateY: 30,
        }}
        animate={{
          opacity: 1,
          translateY: 0,
        }}
        transition={{
          type: "timing",
          duration: 1100,
          delay: 400,
        }}
        style={styles.content}
      >
        {/* DESCRIPTION */}
        <Text style={styles.desc}>
          Desa Gunungsari merupakan desa
          wisata budaya berbasis budaya
          Jawa di Kabupaten Madiun.
          Sebagai pelopor desa wisata
          resmi di Kabupaten Madiun,
          Gunungsari menghadirkan
          pengalaman budaya, tradisi
          lokal, kuliner desa, dan
          festival budaya yang autentik
          serta berbeda dari desa wisata
          lainnya.
        </Text>

      

        {/* BUTTON */}
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.9}
          onPress={() =>
            router.push("/profil")
          }
        >
          <Text style={styles.buttonText}>
            Tentang Desa
          </Text>

          <Feather
            name="arrow-right"
            size={18}
            color="#fff"
          />
        </TouchableOpacity>
      </MotiView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 75,
    paddingBottom: 80,

    backgroundColor: "#fff",
  },

  /* ABOUT */
  aboutText: {
    fontSize: 18,

    fontWeight: "700",

    letterSpacing: 6,

    color: "#B58B63",

    textAlign: "center",

    marginBottom: 18,
  },

  /* TITLE */
  heading: {
    fontSize: 46,

    fontWeight: "900",

    color: "#222",

    textAlign: "center",

    lineHeight: 56,

    marginBottom: 42,
  },

  /* IMAGE */
  image: {
    width: "100%",
    height: 270,
  },

  /* CONTENT */
  content: {
    paddingHorizontal: 30,

    paddingTop: 40,
  },

  desc: {
    fontSize: 16,

    lineHeight: 34,

    color: "#555",

    textAlign: "justify",
  },

  /* STATS */
  stats: {
    flexDirection: "row",

    justifyContent: "space-between",

    marginTop: 42,
  },

  statItem: {
    alignItems: "center",
  },

  statNumber: {
    fontSize: 30,

    fontWeight: "800",

    color: "#222",
  },

  statLabel: {
    marginTop: 8,

    fontSize: 13,

    color: "#777",
  },

  /* BUTTON */
  button: {
    marginTop: 46,

    backgroundColor: "#C49A6C",

    alignSelf: "flex-start",

    flexDirection: "row",
    alignItems: "center",

    gap: 10,

    paddingVertical: 16,
    paddingHorizontal: 24,

    borderRadius: 32,
  },

  buttonText: {
    color: "#fff",

    fontWeight: "700",

    fontSize: 15,
  },
});