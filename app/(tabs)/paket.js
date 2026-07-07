import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { API_URL, getImageUrl } from "../../src/config/api";

import PaketHero from "../../components/paket/PaketHero";
import PaketIntro from "../../components/paket/PaketIntro";
import PaketCard from "../../components/paket/PaketCard";
import PaketDetailModal from "../../components/paket/PaketDetailModal";
import Footer from "../../components/Footer";

import { COLORS } from "../../components/paket/paketTheme";

const parseFacilities = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const mapPaketFromApi = (item) => {
  const imageSource =
    item.image || item.imageUrl || item.gambarUrl || item.gambar_url;

  return {
    id: item.id,
    kodePaket: item.kodePaket || item.kode_paket,
    title: item.title || item.namaPaket || item.nama_paket || "Paket Wisata",
    category: item.category || item.kategori || "Wisata",
    icon: item.icon || item.ikon || "map-pin",
    image: getImageUrl(imageSource),
    imageUrl: getImageUrl(imageSource),
    priceType: item.priceType || item.price_type || "consult",
    priceLabel: item.priceLabel || item.price_label || "Menyesuaikan",
    nominal: Number(item.nominal || item.priceAmount || 0),
    paymentRequired: Boolean(item.paymentRequired || item.payment_required),
    duration: item.duration || item.durasi || "-",
    desc:
      item.desc ||
      item.shortDescription ||
      item.deskripsiSingkat ||
      item.deskripsi_singkat ||
      "",
    detail:
      item.detail ||
      item.deskripsiDetail ||
      item.deskripsi_detail ||
      "",
    suitable:
      item.suitable ||
      item.cocokUntuk ||
      item.cocok_untuk ||
      "",
    facilities: parseFacilities(item.facilities || item.fasilitas),
  };
};

export default function PaketScreen() {
  const [selectedPaket, setSelectedPaket] = useState(null);
  const [paketList, setPaketList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPaketWisata = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await fetch(`${API_URL}/api/paket-wisata`);
      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(result.message || "Gagal mengambil paket wisata.");
      }

      const data = Array.isArray(result.data) ? result.data : [];
      setPaketList(data.map(mapPaketFromApi));
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPaketWisata();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchPaketWisata(true)}
            colors={[COLORS.primary]}
          />
        }
      >
        <PaketHero />

        <View style={styles.contentWrapper}>
          <PaketIntro />

          <View style={styles.list}>
            {loading ? (
              <View style={styles.loadingBox}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Memuat paket wisata...</Text>
              </View>
            ) : paketList.length === 0 ? (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyTitle}>Belum ada paket wisata.</Text>
                <Text style={styles.emptyText}>
                  Paket yang aktif dari admin akan tampil di sini.
                </Text>
              </View>
            ) : (
              paketList.map((paket) => (
                <PaketCard
                  key={paket.id}
                  paket={paket}
                  onPress={() => setSelectedPaket(paket)}
                />
              ))
            )}
          </View>

          <View style={styles.footerWrapper}>
            <Footer />
          </View>
        </View>
      </ScrollView>

      <PaketDetailModal
        visible={selectedPaket !== null}
        paket={selectedPaket}
        onClose={() => setSelectedPaket(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  container: {
    paddingBottom: 130,
  },

  contentWrapper: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  list: {
    gap: 16,
  },

  loadingBox: {
    paddingVertical: 28,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 10,
    color: COLORS.textMuted || "#667085",
    fontWeight: "600",
  },

  emptyBox: {
    padding: 18,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    alignItems: "center",
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text || "#142033",
    textAlign: "center",
  },

  emptyText: {
    marginTop: 6,
    fontSize: 13,
    color: COLORS.textMuted || "#667085",
    textAlign: "center",
  },

  footerWrapper: {
    marginTop: 36,
  },
});