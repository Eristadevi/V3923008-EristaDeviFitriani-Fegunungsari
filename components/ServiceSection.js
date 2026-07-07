import React from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { MotiView } from "moti";

export default function ServiceSection() {
  const goToFasilitas = (type) => {
    router.push({
      pathname: "/fasilitas",
      params: {
        type,
      },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.badgeWrapper}>
        <View style={styles.badge}>
          <Text style={styles.smallText}>FASILITAS WISATA</Text>
        </View>
      </View>

      <Text style={styles.heading}>
        Nikmati Pengalaman{"\n"}Wisata Terbaik
      </Text>

      <Text style={styles.subHeading}>
        Temukan pilihan kuliner lokal dan penginapan nyaman di sekitar Desa
        Wisata Gunungsari.
      </Text>

      <View style={styles.cardWrapper}>
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
            onPress={() => goToFasilitas("kuliner")}
          >
            <View style={styles.cardTop}>
              <View style={styles.iconBox}>
                <Ionicons
                  name="restaurant-outline"
                  size={36}
                  color="#8B5E34"
                />
              </View>

              <View style={styles.countBadge}>
                <Text style={styles.countText}>5 Lokasi</Text>
              </View>
            </View>

            <Text style={styles.cardTitle}>Kuliner</Text>

            <Text style={styles.cardDesc}>
              Temukan makanan khas, kuliner tradisional, dan produk UMKM lokal
              yang dapat dikunjungi wisatawan.
            </Text>

            <View style={styles.linkRow}>
              <Text style={styles.linkText}>Lihat Selengkapnya</Text>

              <Feather name="arrow-right" size={16} color="#8B5E34" />
            </View>
          </TouchableOpacity>
        </MotiView>

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
            onPress={() => goToFasilitas("penginapan")}
          >
            <View style={styles.cardTop}>
              <View style={styles.iconBox}>
                <Ionicons name="bed-outline" size={36} color="#8B5E34" />
              </View>

              <View style={styles.countBadge}>
                <Text style={styles.countText}>5 Lokasi</Text>
              </View>
            </View>

            <Text style={styles.cardTitle}>Penginapan</Text>

            <Text style={styles.cardDesc}>
              Lihat pilihan homestay, rumah singgah, dan penginapan sekitar
              Desa Wisata Gunungsari.
            </Text>

            <View style={styles.linkRow}>
              <Text style={styles.linkText}>Lihat Selengkapnya</Text>

              <Feather name="arrow-right" size={16} color="#8B5E34" />
            </View>
          </TouchableOpacity>
        </MotiView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 56,
    paddingBottom: 90,
    backgroundColor: "#FAF7F2",
  },

  badgeWrapper: {
    alignItems: "center",
    marginBottom: 22,
  },

  badge: {
    backgroundColor: "#F5EBDD",
    borderWidth: 1,
    borderColor: "#E7D5BF",
    paddingVertical: 12,
    paddingHorizontal: 26,
    borderRadius: 40,
  },

  smallText: {
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 3.5,
    color: "#8B5E34",
  },

  heading: {
    textAlign: "center",
    fontSize: 33,
    fontWeight: "900",
    color: "#222",
    lineHeight: 42,
    marginBottom: 16,
    paddingHorizontal: 20,
  },

  subHeading: {
    textAlign: "center",
    fontSize: 15,
    lineHeight: 26,
    color: "#666",
    paddingHorizontal: 34,
    marginBottom: 40,
  },

  cardWrapper: {
    gap: 24,
    paddingHorizontal: 22,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    padding: 26,

    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 7,
    },
  },

  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  iconBox: {
    width: 70,
    height: 70,
    borderRadius: 24,
    backgroundColor: "#F5EBDD",
    justifyContent: "center",
    alignItems: "center",
  },

  countBadge: {
    backgroundColor: "#FFF7ED",
    borderWidth: 1,
    borderColor: "#F5E9DC",
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },

  countText: {
    color: "#8B5E34",
    fontSize: 12,
    fontWeight: "900",
  },

  cardTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#8B5E34",
    marginBottom: 14,
  },

  cardDesc: {
    fontSize: 15,
    lineHeight: 27,
    color: "#555",
  },

  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 26,
  },

  linkText: {
    fontSize: 14,
    fontWeight: "900",
    color: "#8B5E34",
  },
});