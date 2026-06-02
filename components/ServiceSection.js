import React from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import {
  Feather,
  Ionicons,
} from "@expo/vector-icons";

import { router } from "expo-router";
import { MotiView } from "moti";

export default function ServiceSection() {
  return (
    <View style={styles.container}>
      {/* BADGE */}
      <View style={styles.badgeWrapper}>
        <View style={styles.badge}>
          <Text style={styles.smallText}>
            FASILITAS WISATA
          </Text>
        </View>
      </View>

      {/* HEADING */}
      <Text style={styles.heading}>
        Nikmati Pengalaman {"\n"}
        Wisata Terbaik
      </Text>

      {/* SUBTITLE */}
      <Text style={styles.subHeading}>
        Jelajahi kuliner lokal dan
        penginapan nyaman di sekitar
        Desa Wisata Gunungsari.
      </Text>

      {/* CARDS */}
      <View style={styles.cardWrapper}>
        {/* KULINER */}
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
            duration: 700,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.card}
            onPress={() =>
              router.push("/kuliner")
            }
          >
            {/* ICON */}
            <View style={styles.iconBox}>
              <Ionicons
                name="restaurant-outline"
                size={38}
                color="#B58B63"
              />
            </View>

            {/* TITLE */}
            <Text style={styles.cardTitle}>
              Kuliner
            </Text>

            {/* DESC */}
            <Text style={styles.cardDesc}>
              Temukan makanan khas dan
              kuliner tradisional lokal
              yang autentik di sekitar
              wisata Gunungsari.
            </Text>

            {/* LINK */}
            <View style={styles.linkRow}>
              <Text style={styles.linkText}>
                Lihat Selengkapnya
              </Text>

              <Feather
                name="arrow-right"
                size={16}
                color="#B58B63"
              />
            </View>
          </TouchableOpacity>
        </MotiView>

        {/* PENGINAPAN */}
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
            duration: 900,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.card}
            onPress={() =>
              router.push("/penginapan")
            }
          >
            {/* ICON */}
            <View style={styles.iconBox}>
              <Ionicons
                name="bed-outline"
                size={38}
                color="#B58B63"
              />
            </View>

            {/* TITLE */}
            <Text style={styles.cardTitle}>
              Penginapan
            </Text>

            {/* DESC */}
            <Text style={styles.cardDesc}>
              Nikmati hotel dan homestay
              nyaman dekat destinasi
              wisata Desa Gunungsari.
            </Text>

            {/* LINK */}
            <View style={styles.linkRow}>
              <Text style={styles.linkText}>
                Lihat Selengkapnya
              </Text>

              <Feather
                name="arrow-right"
                size={16}
                color="#B58B63"
              />
            </View>
          </TouchableOpacity>
        </MotiView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  /* CONTAINER */
  container: {
    paddingTop: 55,
    paddingBottom: 90,

    backgroundColor: "#FAF7F2",
  },

  /* BADGE */
  badgeWrapper: {
    alignItems: "center",

    marginBottom: 24,
  },

  badge: {
    backgroundColor: "#F5EBDD",

    borderWidth: 1,
    borderColor: "#E7D5BF",

    paddingVertical: 13,
    paddingHorizontal: 28,

    borderRadius: 40,
  },

  smallText: {
    fontSize: 14,

    fontWeight: "800",

    letterSpacing: 4,

    color: "#B58B63",
  },

  /* HEADING */
  heading: {
    textAlign: "center",

    fontSize: 40,

    fontWeight: "900",

    color: "#222",

    lineHeight: 48,

    marginBottom: 18,
  },

  /* SUBTITLE */
  subHeading: {
    textAlign: "center",

    fontSize: 16,

    lineHeight: 30,

    color: "#666",

    paddingHorizontal: 40,

    marginBottom: 46,
  },

  /* CARD WRAPPER */
  cardWrapper: {
    gap: 24,

    paddingHorizontal: 22,
  },

  /* CARD */
  card: {
    backgroundColor: "#fff",

    borderRadius: 34,

    padding: 32,

    elevation: 4,
  },

  /* ICON */
  iconBox: {
    width: 78,
    height: 78,

    borderRadius: 24,

    backgroundColor: "#F5EBDD",

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 26,
  },

  /* CARD TITLE */
  cardTitle: {
    fontSize: 30,

    fontWeight: "800",

    color: "#B58B63",

    marginBottom: 16,
  },

  /* CARD DESC */
  cardDesc: {
    fontSize: 16,

    lineHeight: 31,

    color: "#555",
  },

  /* LINK */
  linkRow: {
    flexDirection: "row",

    alignItems: "center",

    gap: 8,

    marginTop: 28,
  },

  linkText: {
    fontSize: 15,

    fontWeight: "700",

    color: "#B58B63",
  },
});