import React from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons, Feather } from "@expo/vector-icons";

import DetailWisataHeader from "../components/wisata/DetailWisataHeader";
import { getWisataById } from "../components/wisata/wisataData";

export default function DetailWisataScreen() {
  const params = useLocalSearchParams();
  const item = getWisataById(params.id);

  if (!item) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Wisata tidak ditemukan</Text>

        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.85}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Kembali</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const hasCoordinate =
    item.latitude !== undefined &&
    item.latitude !== null &&
    item.longitude !== undefined &&
    item.longitude !== null;

  const goToMainAction = () => {
    if (item.actionType === "coin") {
      router.push("/tukarkoin");
      return;
    }

    router.push({
      pathname: "/bookingwisata",
      params: {
        id: String(item.id),
        title: item.title,
        category: item.category || "",
        priceType: item.priceType || "free",
        priceLabel: item.priceLabel || "",
        nominalSatuan: String(item.nominalSatuan || 0),
      },
    });
  };

  const goToMaps = () => {
    if (!hasCoordinate) {
      router.push("/maps");
      return;
    }

    router.push({
      pathname: "/maps",
      params: {
        id: String(item.id),
        title: item.title,
        latitude: String(item.latitude),
        longitude: String(item.longitude),
        location: item.location || "",
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <DetailWisataHeader item={item} />

        <View style={styles.body}>
          <InfoBadge item={item} />

          <Section
            icon="information-circle-outline"
            title="Tentang Wisata"
            text={item.detailDescription}
          />

          <Section
            icon="sparkles-outline"
            title="Pengalaman yang Didapat"
            text={item.experience}
          />

          <Section
            icon="calendar-outline"
            title="Informasi Kunjungan"
            text={item.visitInfo}
          />

          <View style={styles.locationCard}>
            <View style={styles.locationHeader}>
              <View style={styles.locationIconBox}>
                <Ionicons
                  name="location-outline"
                  size={22}
                  color="#2E7D32"
                />
              </View>

              <View style={styles.locationTitleBox}>
                <Text style={styles.locationTitle}>Lokasi Wisata</Text>

                <Text style={styles.locationSubtitle}>
                  Arahkan maps sesuai destinasi
                </Text>
              </View>
            </View>

            <Text style={styles.locationText}>
              {item.location || "Desa Gunungsari, Kabupaten Madiun"}
            </Text>

            {hasCoordinate && (
              <View style={styles.coordinateBox}>
                <Text style={styles.coordinateText}>
                  Lat: {item.latitude}
                </Text>

                <Text style={styles.coordinateText}>
                  Lng: {item.longitude}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={[
                styles.mapsButton,
                !hasCoordinate && styles.mapsButtonDisabled,
              ]}
              activeOpacity={0.85}
              onPress={goToMaps}
            >
              <Text
                style={[
                  styles.mapsButtonText,
                  !hasCoordinate && styles.mapsButtonTextDisabled,
                ]}
              >
                {hasCoordinate
                  ? "Lihat Lokasi di Maps"
                  : "Buka Halaman Maps"}
              </Text>

              <Feather
                name="map-pin"
                size={16}
                color={hasCoordinate ? "#2E7D32" : "#888"}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.mainButton,
              item.actionType === "coin" && styles.coinMainButton,
            ]}
            activeOpacity={0.9}
            onPress={goToMainAction}
          >
            <Text style={styles.mainButtonText}>
              {item.actionLabel || "Ajukan Kunjungan"}
            </Text>

            <Ionicons
              name={
                item.actionType === "coin"
                  ? "cash-outline"
                  : "calendar-outline"
              }
              size={19}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoBadge({ item }) {
  const getIcon = () => {
    if (item.priceType === "paid") return "card-outline";
    if (item.priceType === "consult") return "help-circle-outline";
    if (item.priceType === "coin") return "cash-outline";
    return "checkmark-circle-outline";
  };

  const getColor = () => {
    if (item.priceType === "paid") return "#9A5A20";
    if (item.priceType === "consult") return "#7A4EAB";
    if (item.priceType === "coin") return "#8B5E34";
    return "#2E7D32";
  };

  const getBg = () => {
    if (item.priceType === "paid") return "#FFF1DF";
    if (item.priceType === "consult") return "#F1EAFE";
    if (item.priceType === "coin") return "#F5E9DC";
    return "#EAF6EE";
  };

  return (
    <View style={[styles.infoBadge, { backgroundColor: getBg() }]}>
      <Ionicons name={getIcon()} size={18} color={getColor()} />

      <Text style={[styles.infoBadgeText, { color: getColor() }]}>
        {item.priceLabel || "Informasi tiket belum tersedia"}
      </Text>
    </View>
  );
}

function Section({ icon, title, text }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIconBox}>
          <Ionicons name={icon} size={22} color="#C08B5C" />
        </View>

        <Text style={styles.sectionTitle}>{title}</Text>
      </View>

      <Text style={styles.sectionText}>
        {text || "Informasi belum tersedia."}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F5F0",
  },

  scrollContent: {
    paddingBottom: 120,
  },

  body: {
    backgroundColor: "#F8F5F0",
    marginTop: -28,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 22,
    paddingTop: 28,
  },

  infoBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 22,
    marginBottom: 22,
  },

  infoBadgeText: {
    fontSize: 13,
    fontWeight: "900",
  },

  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,

    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },

  sectionIconBox: {
    width: 38,
    height: 38,
    borderRadius: 15,
    backgroundColor: "#FFF4EA",
    justifyContent: "center",
    alignItems: "center",
  },

  sectionTitle: {
    color: "#222",
    fontSize: 17,
    fontWeight: "900",
    flex: 1,
  },

  sectionText: {
    color: "#666",
    fontSize: 14,
    lineHeight: 24,
  },

  locationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 18,
    marginBottom: 18,

    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  locationHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },

  locationIconBox: {
    width: 40,
    height: 40,
    borderRadius: 16,
    backgroundColor: "#EAF6EE",
    justifyContent: "center",
    alignItems: "center",
  },

  locationTitleBox: {
    flex: 1,
  },

  locationTitle: {
    color: "#222",
    fontSize: 17,
    fontWeight: "900",
  },

  locationSubtitle: {
    color: "#888",
    fontSize: 12,
    marginTop: 2,
  },

  locationText: {
    color: "#666",
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 12,
  },

  coordinateBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  coordinateText: {
    color: "#667085",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 2,
  },

  mapsButton: {
    borderWidth: 1.4,
    borderColor: "#2E7D32",
    borderRadius: 20,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 7,
  },

  mapsButtonDisabled: {
    borderColor: "#CCCCCC",
    backgroundColor: "#F3F4F6",
  },

  mapsButtonText: {
    color: "#2E7D32",
    fontSize: 14,
    fontWeight: "900",
  },

  mapsButtonTextDisabled: {
    color: "#888",
  },

  mainButton: {
    backgroundColor: "#2E7D32",
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    marginTop: 6,
  },

  coinMainButton: {
    backgroundColor: "#8B5E34",
  },

  mainButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },

  emptyContainer: {
    flex: 1,
    backgroundColor: "#F8F5F0",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#222",
    marginBottom: 16,
  },

  backButton: {
    backgroundColor: "#C08B5C",
    paddingVertical: 13,
    paddingHorizontal: 24,
    borderRadius: 22,
  },

  backButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "900",
  },
});