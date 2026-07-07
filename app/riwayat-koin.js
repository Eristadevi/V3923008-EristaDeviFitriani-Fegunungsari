import { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { API_URL } from "../src/config/api";

export default function RiwayatKoinScreen() {
  const [riwayat, setRiwayat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const getRiwayatKoin = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        router.replace("/login");
        return;
      }

      const response = await fetch(`${API_URL}/api/koin/riwayat-saya`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!result.success) {
        Alert.alert("Gagal", result.message || "Gagal mengambil riwayat koin");
        return;
      }

      const data = Array.isArray(result.data)
        ? result.data
        : result.data?.riwayat || result.data?.transaksi || [];

      setRiwayat(data);
    } catch (error) {
      Alert.alert("Error", "Tidak bisa terhubung ke server");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      getRiwayatKoin();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    getRiwayatKoin();
  };

  const formatRupiah = (value) => {
    return `Rp ${Number(value || 0).toLocaleString("id-ID")}`;
  };

  const getStatusLabel = (item) => {
    if (item.status === "ditukar" || item.sudah_ditukar || item.sudahDitukar) {
      return "Sudah Ditukar";
    }

    if (item.status === "dibayar") return "Siap Ditukar";
    if (item.status === "menunggu") return "Menunggu Pembayaran";
    if (item.status === "kedaluwarsa") return "Kedaluwarsa";
    if (item.status === "dibatalkan") return "Dibatalkan";

    return item.status || "-";
  };

  const getStatusStyle = (item) => {
    if (item.status === "ditukar" || item.sudah_ditukar || item.sudahDitukar) {
      return styles.statusDitukar;
    }

    if (item.status === "dibayar") return styles.statusDibayar;
    if (item.status === "menunggu") return styles.statusMenunggu;

    return styles.statusGagal;
  };

  const handleBayarSekarang = (item) => {
    const redirectUrl = item.redirect_url || item.redirectUrl;

    if (!redirectUrl) {
      Alert.alert(
        "Link pembayaran tidak tersedia",
        "Silakan buat transaksi ulang atau hubungi admin."
      );
      return;
    }

    router.push({
      pathname: "/paymentwebview",
      params: {
        redirect_url: redirectUrl,
        kode_pesanan: item.kode_pesanan || item.kodePesanan,
        jenis: "koin",
      },
    });
  };

  const renderItem = ({ item }) => {
    const kodePesanan = item.kode_pesanan || item.kodePesanan || "-";
    const kodePenukaran = item.kode_penukaran || item.kodePenukaran || "-";
    const redirectUrl = item.redirect_url || item.redirectUrl;

    const sudahDitukar =
      item.status === "ditukar" || item.sudah_ditukar || item.sudahDitukar;

    const siapDitukar = item.status === "dibayar" && !sudahDitukar;
    const menungguPembayaran = item.status === "menunggu";

    return (
      <View style={styles.card}>
        <View style={styles.cardTop}>
          <View style={styles.cardTitleBox}>
            <Text style={styles.smallLabel}>Kode Pesanan</Text>
            <Text style={styles.kodePesanan}>{kodePesanan}</Text>
          </View>

          <View style={[styles.statusBadge, getStatusStyle(item)]}>
            <Text style={styles.statusText}>{getStatusLabel(item)}</Text>
          </View>
        </View>

        <InfoRow label="Nominal" value={formatRupiah(item.nominal)} />
        <InfoRow label="Kode Penukaran" value={kodePenukaran} />
        <InfoRow
          label="Status Penukaran"
          value={sudahDitukar ? "Sudah diambil" : "Belum diambil"}
        />

        {menungguPembayaran && (
          <>
            <TouchableOpacity
              style={styles.payButton}
              onPress={() => handleBayarSekarang(item)}
            >
              <Feather name="credit-card" size={18} color="#fff" />
              <Text style={styles.payButtonText}>Bayar Sekarang</Text>
            </TouchableOpacity>

            {!redirectUrl && (
              <Text style={styles.warningText}>
                Link pembayaran belum tersedia untuk transaksi ini.
              </Text>
            )}
          </>
        )}

        {siapDitukar && (
          <TouchableOpacity
            style={styles.ticketButton}
            onPress={() =>
              router.push({
                pathname: "/tiketkoin",
                params: {
                  kode_pesanan: kodePesanan,
                },
              })
            }
          >
            <Feather name="file-text" size={18} color="#fff" />
            <Text style={styles.ticketButtonText}>Lihat Tiket PDF</Text>
          </TouchableOpacity>
        )}

        {sudahDitukar && (
          <View style={styles.successBox}>
            <Feather name="check-circle" size={18} color="#2563eb" />
            <Text style={styles.successText}>Koin sudah ditukar di lokasi.</Text>
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#67b56f" />
        <Text style={styles.loadingText}>Mengambil riwayat koin...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.customHeader}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color="#111827" />
        </TouchableOpacity>

        <Text style={styles.title}>Riwayat Koin</Text>
      </View>

      <FlatList
        data={riwayat}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <Feather name="credit-card" size={34} color="#67b56f" />
            <Text style={styles.emptyTitle}>Belum ada riwayat koin</Text>
            <Text style={styles.emptyText}>
              Pembelian dan status penukaran koin akan tampil di sini.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

function InfoRow({ label, value }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 22,
    paddingTop: 10,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#64748b",
    fontWeight: "700",
  },
  customHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 22,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#67b56f",
  },
  listContent: {
    paddingBottom: 28,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 14,
  },
  cardTitleBox: {
    flex: 1,
  },
  smallLabel: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "700",
    marginBottom: 4,
  },
  kodePesanan: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "900",
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  statusDibayar: {
    backgroundColor: "#dcfce7",
  },
  statusDitukar: {
    backgroundColor: "#dbeafe",
  },
  statusMenunggu: {
    backgroundColor: "#fef3c7",
  },
  statusGagal: {
    backgroundColor: "#fee2e2",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#111827",
  },
  infoRow: {
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  infoLabel: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "700",
    marginBottom: 3,
  },
  infoValue: {
    fontSize: 15,
    color: "#111827",
    fontWeight: "800",
  },
  payButton: {
    marginTop: 14,
    backgroundColor: "#f59e0b",
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  payButtonText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 14,
  },
  warningText: {
    marginTop: 10,
    color: "#b45309",
    fontSize: 13,
    fontWeight: "700",
  },
  ticketButton: {
    marginTop: 14,
    backgroundColor: "#67b56f",
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  ticketButtonText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 14,
  },
  successBox: {
    marginTop: 14,
    backgroundColor: "#eff6ff",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  successText: {
    color: "#2563eb",
    fontWeight: "800",
    flex: 1,
  },
  emptyCard: {
    marginTop: 20,
    backgroundColor: "#f8fafc",
    borderRadius: 18,
    padding: 22,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#111827",
    marginTop: 12,
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 14,
    lineHeight: 21,
    color: "#64748b",
    textAlign: "center",
  },
});