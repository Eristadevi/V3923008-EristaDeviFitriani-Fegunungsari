import React from "react";

import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "./paketTheme";

export default function PaketHero() {
  return (
    <View style={styles.wrapper}>
      <ImageBackground
        source={require("../../assets/images/herooo2.jpeg")}
        style={styles.hero}
        imageStyle={styles.heroImage}
      >
        <LinearGradient
          colors={[
            "rgba(0,0,0,0.12)",
            "rgba(0,0,0,0.28)",
            "rgba(0,0,0,0.52)",
          ]}
          style={styles.overlay}
        >
          <View style={styles.textWrapper}>
            <Text style={styles.title}>
              Paket Wisata Gunungsari
            </Text>

            <Text style={styles.desc}>
              Rasakan pesona desa.
            </Text>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: COLORS.background,
  },

  hero: {
    width: "100%",
    height: 330,
    backgroundColor: "#000",
  },

  heroImage: {
    resizeMode: "cover",
  },

  overlay: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 26,
    paddingTop: 40,
    paddingBottom: 20,
  },

  textWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    color: COLORS.white,
    fontSize: 38,
    fontWeight: "300",
    lineHeight: 46,
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.40)",
    textShadowOffset: {
      width: 0,
      height: 3,
    },
    textShadowRadius: 10,
  },

  desc: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 16,
    fontWeight: "400",
    marginTop: 12,
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.35)",
    textShadowOffset: {
      width: 0,
      height: 2,
    },
    textShadowRadius: 8,
  },
});