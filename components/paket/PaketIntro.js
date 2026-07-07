import React from "react";

import {
  View,
  Text,
  StyleSheet,
} from "react-native";

import { Feather } from "@expo/vector-icons";
import { COLORS } from "./paketTheme";

const highlights = [
  {
    icon: "book-open",
    title: "Edukasi Desa",
    desc: "Belajar kopi, padi, dan magot BSF.",
  },
  {
    icon: "music",
    title: "Budaya Lokal",
    desc: "Seni tradisional dan aksara Jawa.",
  },
  {
    icon: "home",
    title: "Live In",
    desc: "Rasakan kehidupan masyarakat desa.",
  },
];

export default function PaketIntro() {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.label}>
            PILIH PENGALAMAN
          </Text>

          <Text style={styles.title}>
            Wisata yang Bisa Kamu Nikmati
          </Text>
        </View>
      </View>

      <Text style={styles.desc}>
        Pilih paket wisata sesuai minat kunjunganmu. Setiap paket
        menghadirkan pengalaman khas Desa Wisata Gunungsari.
      </Text>

      <View style={styles.highlightGrid}>
        {highlights.map((item, index) => (
          <View key={index} style={styles.highlightCard}>
            <View style={styles.iconBox}>
              <Feather
                name={item.icon}
                size={20}
                color={COLORS.primary}
              />
            </View>

            <Text style={styles.cardTitle}>
              {item.title}
            </Text>

            <Text style={styles.cardDesc}>
              {item.desc}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.sectionDivider}>
        <View style={styles.line} />
        <Text style={styles.packageLabel}>
          PAKET TERSEDIA
        </Text>
        <View style={styles.line} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 22,
  },

  headerRow: {
    marginBottom: 10,
  },

  label: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 2.5,
    color: COLORS.primary,
    marginBottom: 8,
  },

  title: {
    fontSize: 24,
    fontWeight: "900",
    color: COLORS.text,
    lineHeight: 32,
  },

  desc: {
    fontSize: 14,
    lineHeight: 23,
    color: COLORS.subtext,
    marginBottom: 18,
  },

  highlightGrid: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 24,
  },

  highlightCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 22,
    padding: 13,
    minHeight: 142,

    shadowColor: COLORS.shadow,
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    elevation: 2,

    borderWidth: 1,
    borderColor: COLORS.border,
  },

  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: COLORS.soft,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  cardTitle: {
    fontSize: 13,
    fontWeight: "900",
    color: COLORS.text,
    marginBottom: 6,
  },

  cardDesc: {
    fontSize: 11,
    lineHeight: 17,
    color: COLORS.subtext,
  },

  sectionDivider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },

  packageLabel: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 2,
    color: COLORS.primary,
  },
});