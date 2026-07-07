import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function Footer() {
  return (
    <View style={styles.wrapper}>
      <View style={styles.logoBox}>
        <Feather name="map-pin" size={24} color="#B87945" />
      </View>

      <Text style={styles.title}>Wisata Gunungsari</Text>

      <Text style={styles.subtitle}>
        Jelajahi budaya, kuliner, dan kearifan lokal Desa Gunungsari.
      </Text>

      <View style={styles.menuWrapper}>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuText}>Tentang Gunungsari</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuText}>Tukar Koin Pundensari</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuText}>Hubungi Pengelola</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchBox}>
        <Text style={styles.searchText}>Cari wisata atau paket...</Text>
        <Feather name="search" size={16} color="#8B5E34" />
      </View>

      <View style={styles.socialBox}>
        <Text style={styles.socialTitle}>Ikuti Kami</Text>

        <View style={styles.socialRow}>
          <View style={styles.socialIcon}>
            <Feather name="instagram" size={16} color="#B87945" />
          </View>

          <View style={styles.socialIcon}>
            <Feather name="youtube" size={16} color="#B87945" />
          </View>

          <View style={styles.socialIcon}>
            <Feather name="facebook" size={16} color="#B87945" />
          </View>

          <View style={styles.socialIcon}>
            <Feather name="mail" size={16} color="#B87945" />
          </View>
        </View>

        <Text style={styles.copy}>© 2025 Gunungsari. All rights reserved.</Text>

        <View style={styles.linkRow}>
          <Text style={styles.linkText}>Wisata</Text>
          <Text style={styles.linkText}>Paket</Text>
          <Text style={styles.linkText}>Kontak</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#F3E4D3",
    paddingHorizontal: 18,
    paddingTop: 24,
    paddingBottom: 20,
    alignItems: "center",
    marginTop: 24,
    marginBottom: 34,
    borderWidth: 1,
    borderColor: "#D6B28A",
  },

  logoBox: {
    width: 54,
    height: 54,
    backgroundColor: "#FFF9F2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#D6A16D",
  },

  title: {
    fontSize: 22,
    fontWeight: "900",
    color: "#3B2415",
    marginBottom: 6,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 12,
    color: "#7A5A43",
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 18,
    paddingHorizontal: 8,
  },

  menuWrapper: {
    width: "100%",
    marginBottom: 14,
  },

  menuButton: {
    backgroundColor: "#E5D0BA",
    paddingVertical: 11,
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#D2B08C",
  },

  menuText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#3B2415",
  },

  searchBox: {
    width: "100%",
    height: 40,
    borderWidth: 1.4,
    borderColor: "#C8945F",
    backgroundColor: "#FFF9F2",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  searchText: {
    fontSize: 12,
    color: "#8B6A50",
  },

  socialBox: {
    width: "100%",
    backgroundColor: "#C98F55",
    paddingVertical: 20,
    paddingHorizontal: 18,
    alignItems: "center",
  },

  socialTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 12,
  },

  socialRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },

  socialIcon: {
    width: 30,
    height: 30,
    backgroundColor: "#FFF9F2",
    justifyContent: "center",
    alignItems: "center",
  },

  copy: {
    color: "#FFF7EF",
    fontSize: 10,
    marginBottom: 8,
  },

  linkRow: {
    flexDirection: "row",
    gap: 14,
  },

  linkText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
});