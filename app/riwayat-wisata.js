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
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { getRiwayatPemesananWisata } from "../src/services/pemesananWisataService";

export default function RiwayatWisataScreen() {
  const [riwayat, setRiwayat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRiwayat = async () => {
    try {
      const result = await getRiwayatPemesananWisata();

      const data = Array.isArray(result.data)
        ? result.data
        : result.data?.riwayat || result.data?.pemesanan || [];

      setRiwayat(data);
    } catch (error) {
      Alert.alert("Gagal", error.message || "Gagal mengambil riwayat wisata.");
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

  const formatRupiah = (value) => {
    return `Rp ${Number(value || 0).toLocaleString("id-ID")}`;
  };

  const getKodePesanan = (item) => {
    return item.kode_pesanan || item.kodePesanan || "-";
  };

  const getNamaPaket = (item) => {
    return item.nama_paket || item.paketTitle || item.title || "-";
  };

  const getTanggalKunjungan = (item) => {
    return item.tanggal_kunjungan || item.date || "-";
  };

  const getJumlahOrang = (item) => {
    return item.jumlah_orang || item.people || 0;
  };

  const getTotalNominal = (item) => {
    return item.total_nominal || item.totalNominal || 0;
  };

  const getStatusPesanan = (item) => {
    return item.status_pesanan || item.bookingStatus || "-";
  };

  const getStatusPembayaran = (item) => {
    return item.status_pembayaran || item.paymentStatus || "-";
  };

  const getRedirectUrl = (item) => {
    return item.redirect_url || item.redirectUrl || "";
  };

  const getPriceType = (item) => {
    return item.price_type || item.priceType || "";
  };

  const getStatusText = (item) => {
    const statusPesanan = getStatusPesanan(item);
    const statusPembayaran = getStatusPembayaran(item);

    if (statusPesanan === "menunggu_konfirmasi") {
      return "Menunggu Admin";
    }

    if (
      statusPesanan === "menunggu_pembayaran" ||
      statusPembayaran === "menunggu"
    ) {
      return "Menunggu Pembayaran";
    }

    if (statusPesanan === "selesai") {
      return "Selesai";
    }

    if (statusPesanan === "dibatalkan") {
      return "Dibatalkan";
    }

    if (
      statusPesanan === "dikonfirmasi" ||
      statusPembayaran === "dibayar" ||
      statusPembayaran === "tidak_perlu"
    ) {
      return "Dikonfirmasi";
    }

    return statusPesanan || "-";
  };

  const getStatusStyle = (item) => {
    const statusPesanan = getStatusPesanan(item);
    const statusPembayaran = getStatusPembayaran(item);

    if (statusPesanan === "menunggu_konfirmasi") {
      return styles.statusWaiting;
    }

    if (
      statusPesanan === "menunggu_pembayaran" ||
      statusPembayaran === "menunggu"
    ) {
      return styles.statusPayment;
    }

    if (statusPesanan === "selesai") {
      return styles.statusDone;
    }

    if (
      statusPesanan === "dikonfirmasi" ||
      statusPembayaran === "dibayar" ||
      statusPembayaran === "tidak_perlu"
    ) {
      return styles.statusConfirmed;
    }

    return styles.statusCanceled;
  };

  const getTotalLabel = (item) => {
    const totalNominal = Number(getTotalNominal(item));
    const priceType = getPriceType(item);
    const statusPesanan = getStatusPesanan(item);

    if (priceType === "consult" && statusPesanan === "menunggu_konfirmasi") {
      return "Menunggu harga admin";
    }

    if (totalNominal <= 0) {
      return "Gratis";
    }

    return formatRupiah(totalNominal);
  };

  const renderItem = ({ item }) => {
    const kodePesanan = getKodePesanan(item);
    const redirectUrl = getRedirectUrl(item);
    const statusPesanan = getStatusPesanan(item);
    const statusPembayaran = getStatusPembayaran(item);

    const menungguAdmin = statusPesanan === "menunggu_konfirmasi";

    const menungguPembayaran =
      statusPesanan === "menunggu_pembayaran" ||
      statusPembayaran === "menunggu";

    const bisaLihatTiket =
      statusPesanan === "dikonfirmasi" ||
      statusPesanan === "selesai" ||
      statusPembayaran === "dibayar" ||
      statusPembayaran === "tidak_perlu";

    return (
      <View style={styles.card}>
        <View style={styles.cardTop}>
          <View style={styles.cardTitleBox}>
            <Text style={styles.smallLabel}>Kode Pesanan</Text>
            <Text style={styles.code}>{kodePesanan}</Text>
          </View>

          <View style={[styles.statusBadge, getStatusStyle(item)]}>
            <Text style={styles.statusText}>{getStatusText(item)}</Text>
          </View>
        </View>

        <InfoRow label="Paket Wisata" value={getNamaPaket(item)} />
        <InfoRow label="Tanggal Kunjungan" value={getTanggalKunjungan(item)} />
        <InfoRow
          label="Jumlah Orang"
          value={`${getJumlahOrang(item)} orang`}
        />
        <InfoRow label="Total Pembayaran" value={getTotalLabel(item)} />

        {menungguAdmin && (
          <View style={styles.infoBox}>
            <Feather name="clock" size={18} color="#b45309" />
            <Text style={styles.infoBoxText}>
              Pesanan sedang menunggu konfirmasi admin. Jika harga menyesuaikan
              kebutuhan, admin akan menentukan harga terlebih dahulu.
            </Text>
          </View>
        )}

        {menungguPembayaran && (
          <TouchableOpacity
            style={styles.payButton}
            onPress={() => {
              if (!redirectUrl) {
                Alert.alert(
                  "Link pembayaran belum tersedia",
                  "Silakan tunggu admin menentukan harga atau coba refresh halaman."
                );
                return;
              }

              router.push({
                pathname: "/paymentwebview",
                params: {
                  url: redirectUrl,
                  kodePesanan,
                  jenis: "wisata",
                },
              });
            }}
          >
            <Feather name="credit-card" size={18} color="#fff" />
            <Text style={styles.payButtonText}>Bayar Sekarang</Text>
          </TouchableOpacity>
        )}

        {bisaLihatTiket && (
          <TouchableOpacity
            style={styles.ticketButton}
            onPress={() =>
              router.push({
                pathname: "/pemesananwisata",
                params: {
                  kodePesanan,
                },
              })
            }
          >
            <Feather name="file-text" size={18} color="#fff" />
            <Text style={styles.ticketButtonText}>Lihat Tiket</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#67b56f" />
        <Text style={styles.loadingText}>Mengambil riwayat wisata...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color="#111827" />
        </TouchableOpacity>

        <Text style={styles.title}>Riwayat Wisata</Text>
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
            <Feather name="map" size={34} color="#67b56f" />
            <Text style={styles.emptyTitle}>Belum ada riwayat wisata</Text>
            <Text style={styles.emptyText}>
              Pemesanan wisata kamu akan tampil di sini.
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
  header: {
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
  code: {
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
  statusWaiting: {
    backgroundColor: "#fef3c7",
  },
  statusPayment: {
    backgroundColor: "#ffedd5",
  },
  statusConfirmed: {
    backgroundColor: "#dcfce7",
  },
  statusDone: {
    backgroundColor: "#dbeafe",
  },
  statusCanceled: {
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
  infoBox: {
    marginTop: 14,
    backgroundColor: "#fff7ed",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    gap: 8,
  },
  infoBoxText: {
    flex: 1,
    color: "#b45309",
    fontWeight: "700",
    fontSize: 13,
    lineHeight: 19,
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