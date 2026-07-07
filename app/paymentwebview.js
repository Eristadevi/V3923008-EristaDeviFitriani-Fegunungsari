import React, { useRef, useState } from "react";

import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { WebView } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

import { sinkronStatusPemesananWisata } from "../src/services/pemesananWisataService";
import { sinkronStatusBookingWisata } from "../src/services/bookingWisataService";

const getParam = (value, fallback = "") => {
  if (Array.isArray(value)) return value[0] || fallback;
  return value || fallback;
};

const safeDecode = (value) => {
  try {
    return decodeURIComponent(String(value || ""));
  } catch (error) {
    return String(value || "");
  }
};

const delay = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const normalisasiJenisPembayaran = (jenis) => {
  const value = String(jenis || "").toLowerCase();

  if (
    value === "wisata" ||
    value === "pemesanan-wisata" ||
    value === "paket-wisata"
  ) {
    return "wisata";
  }

  if (
    value === "booking-wisata" ||
    value === "bookingwisata" ||
    value === "booking"
  ) {
    return "booking-wisata";
  }

  if (
    value === "koin" ||
    value === "coin" ||
    value === "tiket" ||
    value === "tiket-koin"
  ) {
    return "koin";
  }

  return "koin";
};

const ambilDataResponse = (result) => {
  return (
    result?.data?.data ||
    result?.data?.pemesanan ||
    result?.data ||
    result?.pemesanan ||
    result ||
    null
  );
};

const ambilStatusPembayaran = (result) => {
  const data = ambilDataResponse(result);

  return String(
    data?.paymentStatus ||
      data?.statusPembayaran ||
      data?.status_pembayaran ||
      data?.payment_status ||
      ""
  ).toLowerCase();
};

const statusSudahDibayar = (status) => {
  return [
    "dibayar",
    "sudah_dibayar",
    "paid",
    "settlement",
    "capture",
    "success",
    "berhasil",
  ].includes(String(status || "").toLowerCase());
};

export default function PaymentWebView() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const sudahDiprosesRef = useRef(false);
  const [sedangMemproses, setSedangMemproses] = useState(false);

  const rawUrl =
    getParam(params.url) ||
    getParam(params.redirect_url) ||
    getParam(params.redirectUrl) ||
    getParam(params.paymentUrl);

  const rawKodePesanan =
    getParam(params.kodePesanan) ||
    getParam(params.kode_pesanan) ||
    getParam(params.kodeBooking) ||
    getParam(params.kode_booking) ||
    getParam(params.orderId) ||
    getParam(params.kode_pemesanan);

  const rawJenis = getParam(params.jenis, "koin");

  const paymentUrl = rawUrl ? safeDecode(rawUrl) : "";
  const kodePesanan = rawKodePesanan ? String(rawKodePesanan) : "";
  const jenisPembayaran = normalisasiJenisPembayaran(rawJenis);

  const pergiKeRiwayatWisata = () => {
    router.replace({
      pathname: "/riwayat-wisata",
      params: {
        kodePesanan,
        refresh: String(Date.now()),
      },
    });
  };

  const pergiKeRiwayatBookingWisata = () => {
    router.replace({
      pathname: "/riwayat-booking-wisata",
      params: {
        kodePesanan,
        refresh: String(Date.now()),
      },
    });
  };

  const pergiKeTiketKoin = () => {
    router.replace({
      pathname: "/tiketkoin",
      params: {
        kodePesanan,
        kode_pesanan: kodePesanan,
        refresh: String(Date.now()),
      },
    });
  };

  const sinkronStatusDenganRetry = async () => {
    if (!kodePesanan) return null;

    let lastResult = null;

    for (let attempt = 1; attempt <= 6; attempt += 1) {
      try {
        let result = null;

        if (jenisPembayaran === "wisata") {
          result = await sinkronStatusPemesananWisata(kodePesanan);
        }

        if (jenisPembayaran === "booking-wisata") {
          result = await sinkronStatusBookingWisata(kodePesanan);
        }

        lastResult = result;

        const statusPembayaran = ambilStatusPembayaran(result);

        console.log(
          `SYNC STATUS ${attempt}:`,
          statusPembayaran || "status kosong"
        );

        if (statusSudahDibayar(statusPembayaran)) {
          return result;
        }
      } catch (error) {
        console.log(`GAGAL SINKRON STATUS KE-${attempt}:`, error?.message);
      }

      await delay(1500);
    }

    return lastResult;
  };

  const masukKeHalamanHasil = async () => {
    if (sudahDiprosesRef.current) return;

    sudahDiprosesRef.current = true;
    setSedangMemproses(true);

    await delay(1000);

    if (jenisPembayaran === "wisata") {
      await sinkronStatusDenganRetry();
      pergiKeRiwayatWisata();
      return;
    }

    if (jenisPembayaran === "booking-wisata") {
      await sinkronStatusDenganRetry();
      pergiKeRiwayatBookingWisata();
      return;
    }

    pergiKeTiketKoin();
  };

  const cekUrlPembayaran = (url) => {
    const currentUrl = String(url || "").toLowerCase();

    const pembayaranSelesai =
      currentUrl.includes("finish") ||
      currentUrl.includes("success") ||
      currentUrl.includes("#/success") ||
      currentUrl.includes("status_code=200") ||
      currentUrl.includes("transaction_status=settlement") ||
      currentUrl.includes("transaction_status=capture");

    const pembayaranGagal =
      currentUrl.includes("expire") ||
      currentUrl.includes("cancel") ||
      currentUrl.includes("deny") ||
      currentUrl.includes("failure") ||
      currentUrl.includes("status_code=202") ||
      currentUrl.includes("transaction_status=expire") ||
      currentUrl.includes("transaction_status=cancel") ||
      currentUrl.includes("transaction_status=deny");

    if (pembayaranSelesai || pembayaranGagal) {
      masukKeHalamanHasil();
    }
  };

  const handleNavigationChange = (navState) => {
    const currentUrl = navState.url || "";

    console.log("MIDTRANS URL:", currentUrl);

    cekUrlPembayaran(currentUrl);
  };

  const handleShouldStartLoad = (request) => {
    cekUrlPembayaran(request?.url);
    return true;
  };

  const tutupManual = async () => {
    if (sudahDiprosesRef.current) return;

    sudahDiprosesRef.current = true;
    setSedangMemproses(true);

    if (jenisPembayaran === "wisata") {
      await sinkronStatusDenganRetry();
      pergiKeRiwayatWisata();
      return;
    }

    if (jenisPembayaran === "booking-wisata") {
      await sinkronStatusDenganRetry();
      pergiKeRiwayatBookingWisata();
      return;
    }

    pergiKeTiketKoin();
  };

  const getJudulHalaman = () => {
    if (jenisPembayaran === "wisata") return "Pembayaran Wisata";
    if (jenisPembayaran === "booking-wisata") {
      return "Pembayaran Booking Wisata";
    }

    return "Pembayaran Koin";
  };

  if (!paymentUrl) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>URL pembayaran tidak ditemukan.</Text>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={tutupManual}>
          <Ionicons name="close" size={24} color="#2B1B12" />
        </TouchableOpacity>

        <Text style={styles.title}>{getJudulHalaman()}</Text>

        <View style={styles.iconPlaceholder} />
      </View>

      <WebView
        source={{ uri: paymentUrl }}
        onNavigationStateChange={handleNavigationChange}
        onShouldStartLoadWithRequest={handleShouldStartLoad}
        startInLoadingState
        javaScriptEnabled
        domStorageEnabled
        renderLoading={() => (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#8B5E34" />
            <Text style={styles.loadingText}>Memuat pembayaran...</Text>
          </View>
        )}
      />

      {sedangMemproses && (
        <View style={styles.processingOverlay}>
          <ActivityIndicator size="large" color="#8B5E34" />

          <Text style={styles.processingText}>
            Memproses status pembayaran...
          </Text>

          <Text style={styles.processingSubText}>
            Mohon tunggu sebentar sampai pembayaran tersinkron.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  header: {
    height: 58,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E7D6C5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F4E5D6",
    justifyContent: "center",
    alignItems: "center",
  },

  iconPlaceholder: {
    width: 40,
    height: 40,
  },

  title: {
    fontSize: 16,
    fontWeight: "900",
    color: "#2B1B12",
  },

  loading: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: "#6B5A50",
  },

  processingOverlay: {
    position: "absolute",
    top: 58,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.94)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  processingText: {
    marginTop: 12,
    fontSize: 15,
    color: "#2B1B12",
    fontWeight: "900",
    textAlign: "center",
  },

  processingSubText: {
    marginTop: 6,
    fontSize: 13,
    color: "#6B5A50",
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 20,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#F8F1EA",
  },

  emptyText: {
    fontSize: 15,
    color: "#2B1B12",
    marginBottom: 18,
    textAlign: "center",
  },

  backButton: {
    backgroundColor: "#8B5E34",
    paddingHorizontal: 24,
    paddingVertical: 13,
    borderRadius: 20,
  },

  backButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
  },
});