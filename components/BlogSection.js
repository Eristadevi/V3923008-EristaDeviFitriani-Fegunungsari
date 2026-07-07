import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
} from "react-native";

import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

import { getImageUrl } from "../src/config/api";

const fallbackImages = [
  require("../assets/images/kategori2.jpeg"),
  require("../assets/images/herooo2.jpeg"),
  require("../assets/images/kategori1.jpeg"),
];

export default function BlogSection() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (dateValue) => {
    if (!dateValue) return "Agenda Desa";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return String(dateValue);
    }

    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const getEventImage = (item, index) => {
    const imagePath = item.imageUrl || item.image_url;

    const imageUrl = getImageUrl(imagePath);

    if (imageUrl) {
      return {
        uri: imageUrl,
      };
    }

    return fallbackImages[index % fallbackImages.length];
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${getImageUrl("/api/events")}`);
      const result = await response.json();

      if (response.ok && result.success) {
        setEvents(result.data || []);
      } else {
        setEvents([]);
      }
    } catch (error) {
      console.log("Gagal mengambil data event:", error.message);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const goToPaket = (event) => {
    if (!event.paketId) {
      router.push("/paket");
      return;
    }

    router.push({
      pathname: "/paket",
      params: {
        eventId: String(event.id),
        paketId: String(event.paketId),
        paketTitle: event.paketTitle || "",
      },
    });
  };

  const goToAllPaket = () => {
    router.push("/paket");
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <Text style={styles.kicker}>AGENDA DESA</Text>

          <Text style={styles.title}>Event Terdekat</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={goToAllPaket}
          style={styles.seeAllButton}
        >
          <Text style={styles.seeAllText}>Lihat Paket</Text>

          <Feather name="arrow-right" size={15} color="#8B5E34" />
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>
        Temukan agenda budaya, edukasi, dan kegiatan wisata terbaru di Desa
        Gunungsari. Setiap event terhubung langsung dengan paket wisata terkait.
      </Text>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#8B5E34" />

          <Text style={styles.loadingText}>Memuat event...</Text>
        </View>
      ) : events.length === 0 ? (
        <View style={styles.emptyBox}>
          <View style={styles.emptyIconBox}>
            <Feather name="calendar" size={26} color="#8B5E34" />
          </View>

          <Text style={styles.emptyTitle}>Belum ada event</Text>

          <Text style={styles.emptyText}>
            Event desa akan tampil di sini setelah ditambahkan oleh admin.
          </Text>

          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.emptyButton}
            onPress={fetchEvents}
          >
            <Text style={styles.emptyButtonText}>Muat Ulang</Text>
          </TouchableOpacity>
        </View>
      ) : (
        events.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.9}
            style={styles.card}
            onPress={() => goToPaket(item)}
          >
            <ImageBackground
              source={getEventImage(item, index)}
              style={styles.image}
              imageStyle={styles.imageStyle}
            >
              <LinearGradient
                colors={[
                  "rgba(0,0,0,0.05)",
                  "rgba(0,0,0,0.32)",
                  "rgba(0,0,0,0.78)",
                ]}
                style={styles.overlay}
              >
                <View style={styles.badge}>
                  <Feather name="calendar" size={13} color="#fff" />

                  <Text style={styles.badgeText}>
                    {formatDate(item.eventDate || item.date)}
                  </Text>
                </View>

                <Text style={styles.cardCategory}>
                  {item.category || "Agenda Desa"}
                </Text>

                <Text style={styles.cardTitle} numberOfLines={2}>
                  {item.title}
                </Text>

                <Text style={styles.cardDesc} numberOfLines={2}>
                  {item.desc || item.description || "-"}
                </Text>
              </LinearGradient>
            </ImageBackground>

            <View style={styles.cardBottom}>
              <View style={styles.locationRow}>
                <Feather name="map-pin" size={15} color="#C49A6C" />

                <Text style={styles.locationText} numberOfLines={1}>
                  {item.location || "Desa Gunungsari"}
                </Text>
              </View>

              <View style={styles.packageBox}>
                <View style={styles.packageIconBox}>
                  <Feather name="package" size={16} color="#8B5E34" />
                </View>

                <View style={styles.packageTextBox}>
                  <Text style={styles.packageLabel}>Paket terkait</Text>

                  <Text style={styles.packageName} numberOfLines={1}>
                    {item.paketTitle || "Lihat paket wisata"}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                activeOpacity={0.88}
                style={styles.visitButton}
                onPress={() => goToPaket(item)}
              >
                <Text style={styles.visitText}>Lihat Paket Ini</Text>

                <Feather name="arrow-right" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F8F5F1",
    paddingHorizontal: 22,
    paddingTop: 36,
    paddingBottom: 48,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
    gap: 14,
  },

  headerText: {
    flex: 1,
  },

  kicker: {
    color: "#C49A6C",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 2.5,
    marginBottom: 8,
  },

  title: {
    color: "#1F2937",
    fontSize: 28,
    fontWeight: "900",
  },

  seeAllButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,

    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  seeAllText: {
    color: "#8B5E34",
    fontSize: 12,
    fontWeight: "900",
  },

  subtitle: {
    color: "#666",
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 22,
  },

  loadingBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 26,
    paddingVertical: 38,
    justifyContent: "center",
    alignItems: "center",

    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 5,
    },
  },

  loadingText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "800",
    marginTop: 12,
  },

  emptyBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 26,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",

    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 5,
    },
  },

  emptyIconBox: {
    width: 58,
    height: 58,
    borderRadius: 22,
    backgroundColor: "#F5E9DC",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  emptyTitle: {
    color: "#1F2937",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 7,
  },

  emptyText: {
    color: "#666",
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 16,
  },

  emptyButton: {
    backgroundColor: "#8B5E34",
    borderRadius: 20,
    paddingVertical: 11,
    paddingHorizontal: 18,
  },

  emptyButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    overflow: "hidden",
    marginBottom: 22,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 7,
    },
    elevation: 3,
  },

  image: {
    height: 220,
    backgroundColor: "#000",
  },

  imageStyle: {
    resizeMode: "cover",
  },

  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 18,
  },

  badge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.22)",
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },

  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "900",
  },

  cardCategory: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.5,
    marginBottom: 6,
  },

  cardTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "900",
    lineHeight: 31,
    marginBottom: 8,
  },

  cardDesc: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 14,
    lineHeight: 22,
  },

  cardBottom: {
    padding: 18,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },

  locationText: {
    flex: 1,
    color: "#555",
    fontSize: 14,
    fontWeight: "700",
  },

  packageBox: {
    backgroundColor: "#F8F5F1",
    borderRadius: 18,
    padding: 13,
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    marginBottom: 16,
  },

  packageIconBox: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: "#F5E9DC",
    justifyContent: "center",
    alignItems: "center",
  },

  packageTextBox: {
    flex: 1,
  },

  packageLabel: {
    color: "#8A7A6B",
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 3,
  },

  packageName: {
    color: "#1F2937",
    fontSize: 15,
    fontWeight: "900",
  },

  visitButton: {
    backgroundColor: "#8B5E34",
    borderRadius: 22,
    paddingVertical: 14,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },

  visitText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "900",
  },
});