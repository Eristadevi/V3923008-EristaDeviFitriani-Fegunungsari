import React from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";

const kulinerData = [
  {
    id: 1,
    name: "Warung Prasmanan Mbak Susy",
    category: "Restoran Jawa",
    address: "Desa Gunungsari, Kabupaten Madiun",
    price: "Rp1.000 - Rp25.000",
    latitude: -7.5780898,
    longitude: 111.5435426,
    image: require("../assets/images/susy.jpg"),
  },
  {
    id: 2,
    name: "Kuliner Pasar Pundensari",
    category: "Kuliner Tradisional",
    address: "Pasar Pundensari, Desa Gunungsari",
    price: "Menggunakan koin bambu",
    latitude: -7.5769933,
    longitude: 111.5418063,
    image: require("../assets/images/k1.jpg"),
  },
  {
    id: 3,
    name: "Soto Ndeso Ayam Kampung Bu Wartinah",
    category: "Restoran Soto Ayam",
    address: "Area Pasar Pundensari",
    price: "Mulai Rp15.000",
    latitude: -7.5833519,
    longitude: 111.5176497,
    image: require("../assets/images/soto.jpg"),
  },
  {
    id: 4,
    name: "Rumah Makan Padang Salero Bundo",
    category: "Kuliner Masakan Padang",
    address: "Kawasan Tiron, Kec. Madiun",
    price: "Rp15.000 - Rp50.000",
    latitude: -7.5890764,
    longitude: 111.5394423,
    image: require("../assets/images/selero.jpg"),
  },
  {
    id: 5,
    name: "Dapur Bu Sri Sawahan",
    category: "Rumah Makan Prasmanan",
    address: "Area Sidomulyo, Kec. Sawahan",
    price: "Mulai Rp 7.000",
    latitude: -7.5933983,
    longitude: 111.5268717,
    image: require("../assets/images/busri.jpg"),
  },
];

const penginapanData = [
  {
    id: 1,
    name: "Artayya Puri Homestay",
    category: "Homestay",
    address: "Jl. Kb. Pisang, Nglames, Kec. Madiun, Kabupaten Madiun, Jawa Timur 63151",
    price: "Mulai Rp107.000/malam",
    latitude: -7.599761,
    longitude: 111.5357251,
    image: require("../assets/images/arrtaya.jpg"),
  },
  {
    id: 2,
    name: "Icha Homestay Madiun",
    category: "Penginapan",
    address: "Jl. Kalasan No.17, Patihan, Kec. Manguharjo, Kota Madiun, Jawa Timur 63123",
    price: "Mulai Rp150.000/malam",
    latitude: -7.6027411,
    longitude: 111.5312769,
    image: require("../assets/images/icha.jpg"),
  },
  {
    id: 3,
    name: "Sky In Homestay Madiun",
    category: "Penginapan Lokal",
    address: "Jl. Mojopahit No.2, Winongo, Kec. Manguharjo, Kota Madiun, Jawa Timur 63135",
    price: "Harga menyesuaikan",
    latitude: -7.6110378,
    longitude: 111.5170834,
    image: require("../assets/images/sky.jpg"),
  },
  {
    id: 4,
    name: "Hotel Mataram Baru",
    category: "Guest House",
    address: "Jl. Dr. Sutomo No.2, Madiun Lor, Kec. Manguharjo, Kota Madiun, Jawa Timur 63122",
    price: "Mulai Rp270.000/malam",
    latitude: -7.6198634,
    longitude: 111.5240057,
    image: require("../assets/images/mataram.jpg"),
  },
  {
    id: 5,
    name: "Hotel Sarangan Permai",
    category: "Penginapan",
    address: "Jl. Yos Sudarso No.80, Patihan, Kec. Manguharjo, Kota Madiun, Jawa Timur 63122",
    price: "Menyesuaikan kebutuhan",
    latitude: -7.6107691,
    longitude:  111.5278217,
    image: require("../assets/images/permai.jpg"),
  },
];

export default function FasilitasScreen() {
  const params = useLocalSearchParams();

  const type = params.type === "penginapan" ? "penginapan" : "kuliner";

  const data = type === "penginapan" ? penginapanData : kulinerData;

  const title = type === "penginapan" ? "Penginapan" : "Kuliner";

  const subtitle =
    type === "penginapan"
      ? "Pilihan homestay, rumah singgah, dan penginapan sekitar Desa Wisata Gunungsari."
      : "Pilihan kuliner lokal, makanan tradisional, dan produk UMKM Desa Gunungsari.";

  const iconName = type === "penginapan" ? "bed-outline" : "restaurant-outline";

  const goToMaps = (item) => {
    router.push({
      pathname: "/maps",
      params: {
        title: item.name,
        latitude: String(item.latitude),
        longitude: String(item.longitude),
        location: item.address,
        category: item.category,
      },
    });
  };

  const changeType = (nextType) => {
    router.setParams({
      type: nextType,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Feather name="arrow-left" size={22} color="#1F2937" />
          </TouchableOpacity>

          <View style={styles.headerTextBox}>
            <View style={styles.kickerBox}>
              <Ionicons name={iconName} size={15} color="#8B5E34" />
              <Text style={styles.kicker}>FASILITAS WISATA</Text>
            </View>

            <Text style={styles.title}>{title}</Text>

            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>
        </View>

        <View style={styles.tabWrapper}>
          <TouchableOpacity
            activeOpacity={0.85}
            style={[
              styles.tabButton,
              type === "kuliner" && styles.tabButtonActive,
            ]}
            onPress={() => changeType("kuliner")}
          >
            <Ionicons
              name="restaurant-outline"
              size={17}
              color={type === "kuliner" ? "#FFFFFF" : "#8B5E34"}
            />
            <Text
              style={[
                styles.tabText,
                type === "kuliner" && styles.tabTextActive,
              ]}
            >
              Kuliner
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            style={[
              styles.tabButton,
              type === "penginapan" && styles.tabButtonActive,
            ]}
            onPress={() => changeType("penginapan")}
          >
            <Ionicons
              name="bed-outline"
              size={17}
              color={type === "penginapan" ? "#FFFFFF" : "#8B5E34"}
            />
            <Text
              style={[
                styles.tabText,
                type === "penginapan" && styles.tabTextActive,
              ]}
            >
              Penginapan
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.listWrapper}>
          {data.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.9}
              style={styles.card}
              onPress={() => goToMaps(item)}
            >
              <ImageBackground
                source={item.image}
                style={styles.image}
                imageStyle={styles.imageStyle}
              >
                <LinearGradient
                  colors={[
                    "rgba(0,0,0,0.04)",
                    "rgba(0,0,0,0.25)",
                    "rgba(0,0,0,0.78)",
                  ]}
                  style={styles.imageOverlay}
                >
                  <View style={styles.categoryBadge}>
                    <Ionicons name={iconName} size={14} color="#FFFFFF" />

                    <Text style={styles.categoryBadgeText}>
                      {item.category}
                    </Text>
                  </View>

                  <Text style={styles.cardTitle} numberOfLines={2}>
                    {item.name}
                  </Text>
                </LinearGradient>
              </ImageBackground>

              <View style={styles.cardContent}>
                <View style={styles.infoRow}>
                  <Feather name="map-pin" size={15} color="#8B5E34" />

                  <Text style={styles.infoText} numberOfLines={2}>
                    {item.address}
                  </Text>
                </View>

                <View style={styles.priceBox}>
                  <Feather name="tag" size={14} color="#8B5E34" />

                  <Text style={styles.priceText}>{item.price}</Text>
                </View>

                <TouchableOpacity
                  activeOpacity={0.88}
                  style={styles.mapsButton}
                  onPress={() => goToMaps(item)}
                >
                  <Text style={styles.mapsButtonText}>Lihat di Maps</Text>

                  <Feather name="navigation" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FAF7F2",
  },

  scrollContent: {
    paddingBottom: 100,
  },

  header: {
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 26,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,

    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 5,
    },
  },

  headerTextBox: {
    alignItems: "center",
  },

  kickerBox: {
    backgroundColor: "#F5EBDD",
    borderWidth: 1,
    borderColor: "#E7D5BF",
    borderRadius: 24,
    paddingVertical: 9,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginBottom: 16,
  },

  kicker: {
    color: "#8B5E34",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.8,
  },

  title: {
    color: "#1F2937",
    fontSize: 34,
    fontWeight: "900",
    marginBottom: 10,
  },

  subtitle: {
    color: "#666",
    fontSize: 15,
    lineHeight: 24,
    textAlign: "center",
  },

  tabWrapper: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 22,
    marginBottom: 22,
  },

  tabButton: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    paddingVertical: 13,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,

    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  tabButtonActive: {
    backgroundColor: "#8B5E34",
  },

  tabText: {
    color: "#8B5E34",
    fontSize: 14,
    fontWeight: "900",
  },

  tabTextActive: {
    color: "#FFFFFF",
  },

  listWrapper: {
    paddingHorizontal: 22,
    gap: 22,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    overflow: "hidden",

    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 7,
    },
  },

  image: {
    height: 215,
    backgroundColor: "#DDD",
  },

  imageStyle: {
    resizeMode: "cover",
  },

  imageOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 18,
  },

  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.22)",
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 11,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },

  categoryBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
  },

  cardTitle: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "900",
    lineHeight: 31,
  },

  cardContent: {
    padding: 18,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 12,
  },

  infoText: {
    flex: 1,
    color: "#666",
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "600",
  },

  priceBox: {
    alignSelf: "flex-start",
    backgroundColor: "#FFF7ED",
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginBottom: 16,
  },

  priceText: {
    color: "#8B5E34",
    fontSize: 13,
    fontWeight: "900",
  },

  mapsButton: {
    backgroundColor: "#8B5E34",
    borderRadius: 22,
    paddingVertical: 13,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  mapsButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },
});