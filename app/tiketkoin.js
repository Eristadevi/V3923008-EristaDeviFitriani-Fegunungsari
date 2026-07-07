import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import QRCode from "react-native-qrcode-svg";

import { API_URL } from "../src/config/api";

export default function TiketKoin() {
  const router = useRouter();
  const { kodePesanan } = useLocalSearchParams();

  const qrRef = useRef(null);

  const [transaksi, setTransaksi] = useState(null);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    ambilDataAwal();
  }, []);

  const qrValue = transaksi
    ? JSON.stringify({
        jenis: "TIKET_KOIN_PUNDENSARI",
        kodePesanan: transaksi.kodePesanan,
        kodePenukaran: transaksi.kodePenukaran,
        nominal: transaksi.nominal,
        status: transaksi.status,
      })
    : "";

  const ambilDataAwal = async () => {
    try {
      const saved = await AsyncStorage.getItem("transaksiKoin");

      if (saved) {
        const parsed = JSON.parse(saved);
        setTransaksi(parsed);
      }

      if (kodePesanan) {
        await cekStatus(kodePesanan);
      }
    } catch (error) {
      console.log("AMBIL DATA TIKET ERROR:", error);
    }
  };

  const simpanTransaksi = async (data) => {
    setTransaksi(data);
    await AsyncStorage.setItem("transaksiKoin", JSON.stringify(data));
  };

  const cekStatus = async (kode = transaksi?.kodePesanan) => {
    try {
      if (!kode) {
        Alert.alert("Tidak Ada Transaksi", "Kode pesanan tidak ditemukan.");
        return;
      }

      setLoading(true);

      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert("Belum Login", "Silakan login terlebih dahulu.");
        return;
      }

      const response = await fetch(
        `${API_URL}/api/koin/sinkron-status/${kode}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        Alert.alert("Gagal", result.message || "Gagal mengecek status.");
        return;
      }

      await simpanTransaksi(result.data);

      if (result.data.status === "dibayar") {
        Alert.alert("Berhasil", "Pembayaran sudah berhasil.");
      } else {
        Alert.alert("Menunggu", "Pembayaran belum selesai.");
      }
    } catch (error) {
      console.log("CEK STATUS TIKET ERROR:", error);
      Alert.alert("Error", "Gagal mengecek status transaksi.");
    } finally {
      setLoading(false);
    }
  };

  const ambilQrBase64 = () => {
    return new Promise((resolve) => {
      if (!qrRef.current || !transaksi?.kodePenukaran) {
        resolve(null);
        return;
      }

      qrRef.current.toDataURL((data) => {
        resolve(data);
      });
    });
  };

  const exportPdf = async () => {
    try {
      if (!transaksi) {
        Alert.alert("Tidak Ada Data", "Data tiket tidak ditemukan.");
        return;
      }

      setExporting(true);

      const qrBase64 = await ambilQrBase64();

      const qrHtml =
        qrBase64 && transaksi.kodePenukaran
          ? `
            <div class="qr-box">
              <img src="data:image/png;base64,${qrBase64}" class="qr-image" />
              <div class="qr-note">Scan QR ini saat penukaran koin</div>
            </div>
          `
          : `
            <div class="qr-empty">
              QR belum tersedia karena pembayaran belum berhasil.
            </div>
          `;

      const html = `
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body {
                font-family: Arial, sans-serif;
                background: #f8f1ea;
                padding: 24px;
                color: #2b1b12;
              }

              .ticket {
                background: #ffffff;
                border: 2px solid #a66a3a;
                padding: 28px;
              }

              .title {
                font-size: 26px;
                font-weight: bold;
                text-align: center;
                margin-bottom: 4px;
              }

              .subtitle {
                font-size: 14px;
                text-align: center;
                color: #6b5a50;
                margin-bottom: 24px;
              }

              .line {
                height: 1px;
                background: #e7d6c5;
                margin-bottom: 18px;
              }

              .label {
                font-size: 12px;
                color: #7a6a60;
                margin-top: 14px;
              }

              .value {
                font-size: 16px;
                font-weight: bold;
                margin-top: 4px;
              }

              .status {
                display: inline-block;
                padding: 8px 12px;
                background: #f4e5d6;
                color: #8b5e34;
                font-weight: bold;
                margin-top: 4px;
              }

              .status-paid {
                background: #f0f8f1;
                color: #2e7d32;
              }

              .redeem {
                margin-top: 24px;
                background: #f0f8f1;
                border: 1px solid #bbddbf;
                padding: 18px;
                text-align: center;
              }

              .redeem-code {
                font-size: 30px;
                font-weight: bold;
                color: #2e7d32;
                letter-spacing: 2px;
                margin-top: 8px;
              }

              .qr-box {
                margin: 18px auto 0 auto;
                background: #ffffff;
                border: 1px solid #d8e8d9;
                padding: 14px;
                width: 170px;
                text-align: center;
              }

              .qr-image {
                width: 150px;
                height: 150px;
              }

              .qr-note {
                font-size: 11px;
                color: #4f7c55;
                margin-top: 8px;
              }

              .qr-empty {
                margin-top: 18px;
                font-size: 12px;
                color: #7a6a60;
              }

              .note {
                margin-top: 24px;
                font-size: 12px;
                color: #6b5a50;
                line-height: 18px;
              }
            </style>
          </head>

          <body>
            <div class="ticket">
              <div class="title">Tiket Koin Pundensari</div>
              <div class="subtitle">Wisata Gunungsari - Pasar Pundensari</div>
              <div class="line"></div>

              <div class="label">Kode Pesanan</div>
              <div class="value">${transaksi.kodePesanan || "-"}</div>

              <div class="label">Nominal</div>
              <div class="value">Rp ${Number(
                transaksi.nominal || 0
              ).toLocaleString("id-ID")}</div>

              <div class="label">Status</div>
              <div class="status ${
                transaksi.status === "dibayar" ? "status-paid" : ""
              }">${transaksi.status || "-"}</div>

              <div class="label">Jenis Pembayaran</div>
              <div class="value">${transaksi.jenisPembayaran || "-"}</div>

              <div class="redeem">
                <div class="label">Kode Penukaran</div>
                <div class="redeem-code">${
                  transaksi.kodePenukaran || "BELUM TERSEDIA"
                }</div>
                ${qrHtml}
              </div>

              <div class="note">
                Tunjukkan tiket digital ini kepada petugas Pasar Pundensari untuk mengambil koin bambu.
                Kode penukaran dan QR hanya berlaku jika status pembayaran sudah dibayar.
              </div>
            </div>
          </body>
        </html>
      `;

      const file = await Print.printToFileAsync({
        html,
        base64: false,
      });

      await Sharing.shareAsync(file.uri, {
        mimeType: "application/pdf",
        dialogTitle: "Bagikan Tiket Koin Pundensari",
        UTI: "com.adobe.pdf",
      });
    } catch (error) {
      console.log("EXPORT PDF ERROR:", error);
      Alert.alert("Error", "Gagal mengekspor tiket ke PDF.");
    } finally {
      setExporting(false);
    }
  };

  if (!transaksi) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="ticket-outline" size={52} color="#A66A3A" />

        <Text style={styles.emptyTitle}>Tiket belum tersedia</Text>

        <Text style={styles.emptyText}>
          Silakan buat pembayaran koin terlebih dahulu.
        </Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.replace("/tukarkoin")}
        >
          <Text style={styles.primaryButtonText}>Kembali ke Tukar Koin</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace("/tukarkoin")}
        >
          <Ionicons name="arrow-back" size={22} color="#2B1B12" />
        </TouchableOpacity>

        <Text style={styles.title}>Tiket Digital Koin</Text>

        <Text style={styles.subtitle}>
          Simpan tiket ini sebagai bukti pemesanan koin Pundensari.
        </Text>
      </View>

      <View style={styles.ticketCard}>
        <View style={styles.ticketTop}>
          <Ionicons name="ticket-outline" size={34} color="#A66A3A" />
          <Text style={styles.ticketTitle}>Koin Pundensari</Text>
          <Text style={styles.ticketSubtitle}>Pasar Pundensari</Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.label}>Kode Pesanan</Text>
        <Text style={styles.value}>{transaksi.kodePesanan}</Text>

        <Text style={styles.label}>Nominal</Text>
        <Text style={styles.value}>
          Rp {Number(transaksi.nominal).toLocaleString("id-ID")}
        </Text>

        <Text style={styles.label}>Status</Text>
        <Text
          style={[
            styles.status,
            transaksi.status === "dibayar" && styles.statusPaid,
          ]}
        >
          {transaksi.status}
        </Text>

        {transaksi.jenisPembayaran && (
          <>
            <Text style={styles.label}>Jenis Pembayaran</Text>
            <Text style={styles.value}>{transaksi.jenisPembayaran}</Text>
          </>
        )}

        <View style={styles.redeemBox}>
          <Text style={styles.redeemLabel}>Kode Penukaran</Text>

          <Text style={styles.redeemCode}>
            {transaksi.kodePenukaran || "Belum tersedia"}
          </Text>

          {transaksi.kodePenukaran && (
            <View style={styles.qrBox}>
              <QRCode
                value={qrValue}
                size={145}
                color="#000000"
                backgroundColor="#FFFFFF"
                getRef={(ref) => {
                  qrRef.current = ref;
                }}
              />
            </View>
          )}

          <Text style={styles.redeemNote}>
            {transaksi.kodePenukaran
              ? "Scan QR ini saat penukaran koin di lokasi."
              : "Kode akan muncul setelah pembayaran berhasil."}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => cekStatus()}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.primaryButtonText}>Cek Status Pembayaran</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.pdfButton}
        onPress={exportPdf}
        disabled={exporting}
      >
        {exporting ? (
          <ActivityIndicator color="#8B5E34" />
        ) : (
          <>
            <Ionicons name="document-text-outline" size={18} color="#8B5E34" />
            <Text style={styles.pdfButtonText}>Export Tiket ke PDF</Text>
          </>
        )}
      </TouchableOpacity>

      <View style={{ height: 120 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F1EA",
  },

  header: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 48,
    paddingBottom: 24,
  },

  backButton: {
    width: 42,
    height: 42,
    backgroundColor: "#F4E5D6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },

  title: {
    fontSize: 27,
    fontWeight: "900",
    color: "#2B1B12",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    color: "#6B5A50",
    lineHeight: 21,
  },

  ticketCard: {
    margin: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#A66A3A",
    padding: 20,
  },

  ticketTop: {
    alignItems: "center",
    marginBottom: 18,
  },

  ticketTitle: {
    fontSize: 23,
    fontWeight: "900",
    color: "#2B1B12",
    marginTop: 8,
  },

  ticketSubtitle: {
    fontSize: 13,
    color: "#6B5A50",
    marginTop: 4,
  },

  divider: {
    height: 1,
    backgroundColor: "#E7D6C5",
    marginBottom: 14,
  },

  label: {
    fontSize: 12,
    color: "#7A6A60",
    marginTop: 12,
    marginBottom: 4,
  },

  value: {
    fontSize: 15,
    color: "#2B1B12",
    fontWeight: "800",
  },

  status: {
    fontSize: 15,
    color: "#C47A1C",
    fontWeight: "900",
  },

  statusPaid: {
    color: "#2E7D32",
  },

  redeemBox: {
    backgroundColor: "#F0F8F1",
    borderWidth: 1,
    borderColor: "#BBDDBF",
    padding: 16,
    marginTop: 20,
    alignItems: "center",
  },

  redeemLabel: {
    fontSize: 12,
    color: "#2E7D32",
    fontWeight: "800",
    marginBottom: 6,
  },

  redeemCode: {
    fontSize: 24,
    color: "#2E7D32",
    fontWeight: "900",
    letterSpacing: 1,
    textAlign: "center",
  },

  qrBox: {
    marginTop: 16,
    marginBottom: 10,
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderWidth: 1,
    borderColor: "#D8E8D9",
    alignItems: "center",
    justifyContent: "center",
  },

  redeemNote: {
    fontSize: 12,
    color: "#4F7C55",
    lineHeight: 18,
    marginTop: 8,
    textAlign: "center",
  },

  primaryButton: {
    marginHorizontal: 20,
    backgroundColor: "#8B5E34",
    paddingVertical: 15,
    alignItems: "center",
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },

  pdfButton: {
    marginHorizontal: 20,
    marginTop: 12,
    borderWidth: 1.5,
    borderColor: "#8B5E34",
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    backgroundColor: "#FFFFFF",
  },

  pdfButtonText: {
    color: "#8B5E34",
    fontSize: 14,
    fontWeight: "900",
  },

  emptyContainer: {
    flex: 1,
    backgroundColor: "#F8F1EA",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#2B1B12",
    marginTop: 12,
    marginBottom: 8,
  },

  emptyText: {
    fontSize: 14,
    color: "#6B5A50",
    textAlign: "center",
    marginBottom: 20,
  },
});