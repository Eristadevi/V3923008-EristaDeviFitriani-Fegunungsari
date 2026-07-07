import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";

import { getRiwayatBookingWisata } from "../src/services/bookingWisataService";

const formatStatus = (value) => {
  const map = {
    menunggu_konfirmasi: "Menunggu Konfirmasi",
    menunggu_pembayaran: "Menunggu Pembayaran",
    dikonfirmasi: "Dikonfirmasi",
    selesai: "Selesai",
    dibatalkan: "Dibatalkan",

    tidak_perlu: "Tidak Perlu Bayar",
    bayar_di_lokasi: "Bayar di Lokasi",
    menunggu: "Menunggu Pembayaran",
    dibayar: "Dibayar",
    kedaluwarsa: "Kedaluwarsa",
  };

  return map[value] || value || "-";
};

const formatRupiah = (value) => {
  const nominal = Number(value || 0);

  if (nominal <= 0) return "Gratis";

  return `Rp ${nominal.toLocaleString("id-ID")}`;
};

const getStatusStyle = (status) => {
  if (status === "dikonfirmasi") return styles.badgeSuccess;
  if (status === "selesai") return styles.badgePrimary;
  if (status === "dibatalkan") return styles.badgeDanger;
  if (status === "menunggu_pembayaran") return styles.badgeWarning;
  if (status === "menunggu_konfirmasi") return styles.badgeWarning;

  return styles.badgeDefault;
};

export default function RiwayatBookingWisataScreen() {
  const [riwayat, setRiwayat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRiwayat = async () => {
    try {
      const result = await getRiwayatBookingWisata();

      const data = Array.isArray(result.data)
        ? result.data
        : result.data?.riwayat || [];

      setRiwayat(data);
    } catch (error) {
      Alert.alert(
        "Gagal",
        error?.message || "Gagal mengambil riwayat booking wisata."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchRiwayat();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchRiwayat();
  };

  const goToPayment = (item) => {
    if (!item.redirectUrl) {
      Alert.alert("Belum tersedia", "Link pembayaran belum tersedia.");
      return;
    }

    router.push({
      pathname: "/paymentwebview",
      params: {
        url: item.redirectUrl,
        kodePesanan: item.kodeBooking,
        jenis: "booking-wisata",
      },
    });
  };

  const renderItem = ({ item }) => {
    const canPay =
      item.paymentStatus === "menunggu" ||
      item.status_pembayaran === "menunggu";

    const hasPaymentUrl = Boolean(item.redirectUrl);

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.iconBox}>
            <Ionicons name="calendar" size={22} color="#2E7D32" />
          </View>

          <View style={styles.headerText}>
            <Text style={styles.title}>{item.namaWisata || item.paketTitle}</Text>
            <Text style={styles.kode}>{item.kodeBooking}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Tanggal</Text>
          <Text style={styles.value}>{item.date || "-"}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Jumlah Orang</Text>
          <Text style={styles.value}>{item.people || 0} orang</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Total</Text>
          <Text style={styles.value}>{formatRupiah(item.totalNominal)}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Status Booking</Text>
          <Text style={[styles.badge, getStatusStyle(item.bookingStatus)]}>
            {formatStatus(item.bookingStatus)}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Status Bayar</Text>
          <Text style={styles.value}>{formatStatus(item.paymentStatus)}</Text>
        </View>

        {item.priceType === "consult" && (
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              Admin akan menentukan harga dan metode pembayaran.
            </Text>
          </View>
        )}

        {item.bookingStatus === "menunggu_pembayaran" && hasPaymentUrl && (
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              Harga sudah ditentukan admin. Silakan lanjutkan pembayaran.
            </Text>
          </View>
        )}

        {item.paymentStatus === "bayar_di_lokasi" && (
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              Pembayaran dilakukan langsung di lokasi wisata.
            </Text>
          </View>
        )}

        {canPay && hasPaymentUrl && (
          <TouchableOpacity style={styles.payButton} onPress={() => goToPayment(item)}>
            <Text style={styles.payButtonText}>Bayar Sekarang</Text>
            <Feather name="arrow-right" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color="#222" />
        </TouchableOpacity>

        <Text style={styles.pageTitle}>Riwayat Wisata</Text>

        <View style={styles.placeholder} />
      </View>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color="#2E7D32" />
          <Text style={styles.loadingText}>Memuat riwayat...</Text>
        </View>
      ) : (
        <FlatList
          data={riwayat}
          keyExtractor={(item) => String(item.id || item.kodeBooking)}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Ionicons name="calendar-outline" size={48} color="#B9A99A" />
              <Text style={styles.emptyTitle}>Belum ada booking wisata</Text>
              <Text style={styles.emptyText}>
                Booking atau ajukan kunjungan wisata terlebih dahulu.
              </Text>
            </View>
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f5f0",
  },

  topBar: {
    height: 62,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  pageTitle: {
    color: "#222",
    fontSize: 19,
    fontWeight: "900",
  },

  placeholder: {
    width: 42,
  },

  listContent: {
    padding: 18,
    paddingBottom: 40,
  },

  loadingBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 10,
    color: "#777",
    fontWeight: "800",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,

    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },

  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#EAF6EE",
    alignItems: "center",
    justifyContent: "center",
  },

  headerText: {
    flex: 1,
  },

  title: {
    color: "#222",
    fontSize: 17,
    fontWeight: "900",
  },

  kode: {
    color: "#888",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 3,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 10,
  },

  label: {
    flex: 1,
    color: "#777",
    fontSize: 13,
    fontWeight: "800",
  },

  value: {
    flex: 1.3,
    color: "#222",
    fontSize: 13,
    fontWeight: "900",
    textAlign: "right",
  },

  badge: {
    overflow: "hidden",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 12,
    fontWeight: "900",
    textAlign: "center",
  },

  badgeDefault: {
    color: "#344054",
    backgroundColor: "#EEF2F7",
  },

  badgeWarning: {
    color: "#B54708",
    backgroundColor: "#FFF4D6",
  },

  badgeSuccess: {
    color: "#027A48",
    backgroundColor: "#D1FADF",
  },

  badgePrimary: {
    color: "#1D4ED8",
    backgroundColor: "#DBEAFE",
  },

  badgeDanger: {
    color: "#B42318",
    backgroundColor: "#FEE4E2",
  },

  infoBox: {
    backgroundColor: "#F5F0EA",
    padding: 12,
    borderRadius: 14,
    marginTop: 4,
    marginBottom: 10,
  },

  infoText: {
    color: "#6B4E35",
    fontSize: 13,
    fontWeight: "800",
    lineHeight: 19,
  },

  payButton: {
    minHeight: 48,
    borderRadius: 22,
    backgroundColor: "#2E7D32",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
  },

  payButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },

  emptyBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    paddingHorizontal: 24,
  },

  emptyTitle: {
    color: "#222",
    fontSize: 18,
    fontWeight: "900",
    marginTop: 12,
  },

  emptyText: {
    color: "#777",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginTop: 6,
  },
});