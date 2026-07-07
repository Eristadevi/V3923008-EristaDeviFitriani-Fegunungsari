import React from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";
import { COLORS } from "./paketTheme";

export default function PaketSummary() {
  return (
    <View style={styles.summaryBox}>
      <View style={styles.summaryItem}>
        <Text style={styles.summaryNumber}>5</Text>
        <Text style={styles.summaryText}>Paket</Text>
      </View>

      <View style={styles.summaryDivider} />

      <View style={styles.summaryItem}>
        <Text style={styles.summaryNumber}>5</Text>
        <Text style={styles.summaryText}>Kategori</Text>
      </View>

      <View style={styles.summaryDivider} />

      <View style={styles.summaryItem}>
        <Text style={styles.summaryNumber}>Form</Text>
        <Text style={styles.summaryText}>Pengajuan</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  summaryBox: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    elevation: 2,
  },

  summaryItem: {
    flex: 1,
    alignItems: "center",
  },

  summaryNumber: {
    fontSize: 17,
    fontWeight: "900",
    color: COLORS.primary,
    marginBottom: 4,
  },

  summaryText: {
    fontSize: 11,
    color: COLORS.subtext,
    textAlign: "center",
  },

  summaryDivider: {
    width: 1,
    height: 34,
    backgroundColor: COLORS.border,
  },
});