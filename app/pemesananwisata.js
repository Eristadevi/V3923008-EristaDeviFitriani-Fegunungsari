import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import QRCode from "react-native-qrcode-svg";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { Ionicons } from "@expo/vector-icons";
import { getDetailPemesananWisata } from "../src/services/pemesananWisataService";

export default function PemesananWisataScreen() {
  const router = useRouter();
  const { kodePesanan } = useLocalSearchParams();

  const qrRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [pemesanan, setPemesanan] = useState(null);
  const [qrBase64, setQrBase64] = useState("");

  const fetchDetail = useCallback(async () => {
    try {
      setLoading(true);

      const result = await getDetailPemesananWisata(kodePesanan);

      const data =
        result?.data?.data ||
        result?.data?.pemesanan ||
        result?.data?.detail ||
        result?.data ||
        result?.pemesanan ||
        result?.detail ||
        result;

      console.log("DETAIL TIKET USER:", data);
      console.log("STATUS PESANAN:", data?.status_pesanan || data?.bookingStatus);
console.log("STATUS PEMBAYARAN:", data?.status_pembayaran || data?.paymentStatus);

      setPemesanan(data);
    } catch (error) {
      console.log("ERROR DETAIL PEMESANAN:", error);

      Alert.alert(
        "Gagal",
        error.message || "Gagal mengambil detail pemesanan wisata."
      );
    } finally {
      setLoading(false);
    }
  }, [kodePesanan]);

  useFocusEffect(
    useCallback(() => {
      fetchDetail();
    }, [fetchDetail])
  );

  useEffect(() => {
    if (pemesanan && tiketBisaDigunakan()) {
      setTimeout(() => {
        generateQrBase64();
      }, 700);
    } else {
      setQrBase64("");
    }
  }, [pemesanan]);

  const generateQrBase64 = () => {
    try {
      if (qrRef.current) {
        qrRef.current.toDataURL((value) => {
          setQrBase64(value);
        });
      }
    } catch (error) {
      console.log("ERROR GENERATE QR:", error);
    }
  };

  const normalizeStatus = (status) => {
    return String(status || "")
      .trim()
      .toLowerCase();
  };

  const formatStatus = (status) => {
    if (!status || status === "-") return "-";

    return String(status).replace(/_/g, " ").toUpperCase();
  };

  const formatRupiah = (value) => {
    const numberValue = Number(value || 0);

    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(numberValue);
  };

  const getKode = () => {
    return (
      pemesanan?.kode_pesanan ||
      pemesanan?.kodePesanan ||
      kodePesanan ||
      "-"
    );
  };

  const getStatusBayar = () => {
  return normalizeStatus(
    pemesanan?.status_pembayaran ||
      pemesanan?.paymentStatus ||
      pemesanan?.statusBayar ||
      pemesanan?.payment_status ||
      "-"
  );
};

  const getStatusPesanan = () => {
  const statusPesanan = normalizeStatus(
    pemesanan?.status_pesanan ||
      pemesanan?.bookingStatus ||
      pemesanan?.statusPesanan ||
      pemesanan?.status_pemesanan ||
      pemesanan?.statusPemesanan ||
      pemesanan?.booking_status ||
      pemesanan?.status
  );

  if (statusPesanan) {
    return statusPesanan;
  }

  const statusBayar = getStatusBayar();

  if (statusBayar === "tidak_perlu") {
    return "menunggu_konfirmasi";
  }

  if (statusBayar === "dibayar") {
    return "dikonfirmasi";
  }

  if (statusBayar === "menunggu") {
    return "menunggu_pembayaran";
  }

  if (statusBayar === "dibatalkan") {
    return "dibatalkan";
  }

  if (statusBayar === "kedaluwarsa") {
    return "kedaluwarsa";
  }

  return "menunggu_konfirmasi";
};

  const getNamaPaket = () => {
    return (
      pemesanan?.nama_paket ||
      pemesanan?.paketTitle ||
      pemesanan?.title ||
      pemesanan?.paket_wisata?.nama_paket ||
      "-"
    );
  };

  const getNamaPemesan = () => {
    return (
      pemesanan?.nama_pemesan ||
      pemesanan?.nama_pengunjung ||
      pemesanan?.name ||
      pemesanan?.namaLengkap ||
      "-"
    );
  };

  const getTanggalKunjungan = () => {
    return (
      pemesanan?.tanggal_kunjungan ||
      pemesanan?.date ||
      pemesanan?.tanggal ||
      "-"
    );
  };

  const getJumlahOrang = () => {
    return (
      pemesanan?.jumlah_orang ||
      pemesanan?.people ||
      pemesanan?.jumlahOrang ||
      0
    );
  };

  const getNominalSatuan = () => {
    return (
      pemesanan?.nominalSatuan ||
      pemesanan?.nominal_satuan ||
      pemesanan?.harga ||
      pemesanan?.price ||
      0
    );
  };

  const getTotalHarga = () => {
    const total =
      pemesanan?.totalNominal ||
      pemesanan?.total_nominal ||
      pemesanan?.totalHarga ||
      pemesanan?.total_harga ||
      pemesanan?.gross_amount ||
      pemesanan?.harga_total ||
      0;

    const totalAngka = Number(total);

    if (!Number.isNaN(totalAngka) && totalAngka > 0) {
      return totalAngka;
    }

    const nominalSatuan = Number(getNominalSatuan());
    const jumlahOrang = Number(getJumlahOrang());
    const hasil = nominalSatuan * jumlahOrang;

    if (!Number.isNaN(hasil) && hasil > 0) {
      return hasil;
    }

    return 0;
  };

  const getTotalHargaLabel = () => {
    const statusPesanan = getStatusPesanan();
    const priceType = pemesanan?.price_type || pemesanan?.priceType;
    const total = getTotalHarga();

    if (priceType === "consult" && statusPesanan === "menunggu_konfirmasi") {
      return "Menunggu harga dari admin";
    }

    if (total <= 0) {
      return "Gratis";
    }

    return formatRupiah(total);
  };

  const getRedirectUrl = () => {
    return pemesanan?.redirect_url || pemesanan?.redirectUrl || "";
  };

  const tiketBisaDigunakan = () => {
    const statusPesanan = getStatusPesanan();

    return statusPesanan === "dikonfirmasi" || statusPesanan === "selesai";
  };

  const sedangMenungguKonfirmasi = () => {
    return getStatusPesanan() === "menunggu_konfirmasi";
  };

  const sedangMenungguPembayaran = () => {
    return (
      getStatusPesanan() === "menunggu_pembayaran" ||
      getStatusBayar() === "menunggu"
    );
  };

  const getStatusInfoText = () => {
    if (sedangMenungguKonfirmasi()) {
      return "Pesanan sedang menunggu konfirmasi admin. Barcode akan muncul setelah admin mengonfirmasi pesanan.";
    }

    if (sedangMenungguPembayaran()) {
      return "Pesanan sudah dibuat. Silakan selesaikan pembayaran agar tiket bisa digunakan.";
    }

    if (getStatusPesanan() === "selesai") {
      return "Kunjungan wisata sudah selesai.";
    }

    if (tiketBisaDigunakan()) {
      return "Tiket sudah aktif. Tunjukkan barcode ini kepada petugas saat kunjungan.";
    }

    return "Tiket belum bisa digunakan.";
  };

  const getQrValue = () => {
    return JSON.stringify({
      kodePesanan: getKode(),
      namaPemesan: getNamaPemesan(),
      paketWisata: getNamaPaket(),
      tanggalKunjungan: getTanggalKunjungan(),
      jumlahOrang: getJumlahOrang(),
      totalPembayaran: getTotalHarga(),
      statusPesanan: getStatusPesanan(),
      statusPembayaran: getStatusBayar(),
    });
  };

  const createHtml = () => {
    const qrImage = qrBase64
      ? `<img src="data:image/png;base64,${qrBase64}" style="width:180px;height:180px;" />`
      : `<div style="width:180px;height:180px;border:1px solid #ccc;display:flex;align-items:center;justify-content:center;margin:auto;">QR tidak tersedia</div>`;

    return `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 24px;
              color: #2B1B12;
              background: #F8F1EA;
            }

            .card {
              background: #FFFFFF;
              border: 1px solid #E7D6C5;
              border-radius: 16px;
              padding: 20px;
            }

            .title {
              font-size: 22px;
              font-weight: bold;
              margin-bottom: 6px;
              text-align: center;
            }

            .subtitle {
              color: #6B5A50;
              margin-bottom: 20px;
              text-align: center;
            }

            .qr {
              text-align: center;
              margin: 20px 0;
            }

            .kode {
              font-weight: bold;
              margin-top: 10px;
              font-size: 14px;
            }

            .row {
              margin-bottom: 12px;
            }

            .label {
              font-size: 12px;
              color: #7A6A5E;
            }

            .value {
              font-size: 15px;
              font-weight: bold;
              margin-top: 3px;
            }

            .status {
              display: inline-block;
              background: #8B5E34;
              color: white;
              padding: 8px 12px;
              border-radius: 12px;
              font-weight: bold;
              text-transform: uppercase;
            }

            .note {
              margin-top: 18px;
              font-size: 12px;
              color: #6B5A50;
              line-height: 18px;
            }
          </style>
        </head>

        <body>
          <div class="card">
            <div class="title">Tiket Pemesanan Wisata</div>
            <div class="subtitle">Desa Wisata Gunungsari</div>

            <div class="qr">
              ${qrImage}
              <div class="kode">${getKode()}</div>
            </div>

            <div class="row">
              <div class="label">Kode Pesanan</div>
              <div class="value">${getKode()}</div>
            </div>

            <div class="row">
              <div class="label">Nama Pemesan</div>
              <div class="value">${getNamaPemesan()}</div>
            </div>

            <div class="row">
              <div class="label">Paket Wisata</div>
              <div class="value">${getNamaPaket()}</div>
            </div>

            <div class="row">
              <div class="label">Tanggal Kunjungan</div>
              <div class="value">${getTanggalKunjungan()}</div>
            </div>

            <div class="row">
              <div class="label">Jumlah Orang</div>
              <div class="value">${getJumlahOrang()} orang</div>
            </div>

            <div class="row">
              <div class="label">Total Pembayaran</div>
              <div class="value">${getTotalHargaLabel()}</div>
            </div>

            <div class="row">
              <div class="label">Status Pesanan</div>
              <div class="value">
                <span class="status">${formatStatus(getStatusPesanan())}</span>
              </div>
            </div>

            <div class="row">
              <div class="label">Status Pembayaran</div>
              <div class="value">
                <span class="status">${formatStatus(getStatusBayar())}</span>
              </div>
            </div>

            <div class="note">
              Tunjukkan barcode ini kepada petugas saat kunjungan.
              Tiket ini sah apabila pesanan sudah dikonfirmasi oleh admin.
            </div>
          </div>
        </body>
      </html>
    `;
  };

  const cetakPDF = async () => {
    if (!tiketBisaDigunakan()) {
      Alert.alert(
        "Tiket belum aktif",
        "Tunggu konfirmasi admin terlebih dahulu."
      );
      return;
    }

    try {
      generateQrBase64();

      await Print.printAsync({
        html: createHtml(),
      });
    } catch (error) {
      console.log("ERROR CETAK PDF:", error);
      Alert.alert("Gagal", "Gagal mencetak tiket.");
    }
  };

  const exportPDF = async () => {
    if (!tiketBisaDigunakan()) {
      Alert.alert(
        "Tiket belum aktif",
        "Tunggu konfirmasi admin terlebih dahulu."
      );
      return;
    }

    try {
      generateQrBase64();

      const file = await Print.printToFileAsync({
        html: createHtml(),
      });

      await Sharing.shareAsync(file.uri);
    } catch (error) {
      console.log("ERROR EXPORT PDF:", error);
      Alert.alert("Gagal", "Gagal export PDF.");
    }
  };

  const bayarSekarang = () => {
    const redirectUrl = getRedirectUrl();

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
        kodePesanan: getKode(),
        jenis: "wisata",
      },
    });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#8B5E34" />
        <Text style={styles.loadingText}>Memuat pemesanan...</Text>
      </View>
    );
  }

  if (!pemesanan) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Data pemesanan tidak ditemukan.</Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.back()}
        >
          <Text style={styles.primaryButtonText}>Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={22} color="#2B1B12" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Pemesanan Wisata</Text>

        <TouchableOpacity style={styles.iconButton} onPress={fetchDetail}>
          <Ionicons name="refresh" size={21} color="#2B1B12" />
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Tiket Pemesanan Wisata</Text>
        <Text style={styles.subtitle}>Desa Wisata Gunungsari</Text>

        {tiketBisaDigunakan() ? (
          <View style={styles.qrBox}>
            <QRCode
              value={getQrValue()}
              size={190}
              getRef={(ref) => {
                qrRef.current = ref;
              }}
            />

            <Text style={styles.kodeText}>{getKode()}</Text>
          </View>
        ) : (
          <View style={styles.pendingQrBox}>
            <Ionicons name="time-outline" size={58} color="#8B5E34" />
            <Text style={styles.pendingQrTitle}>Tiket Belum Aktif</Text>
            <Text style={styles.pendingQrText}>{getStatusInfoText()}</Text>
          </View>
        )}

        <View style={styles.infoRow}>
          <Text style={styles.label}>Kode Pesanan</Text>
          <Text style={styles.value}>{getKode()}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Nama Pemesan</Text>
          <Text style={styles.value}>{getNamaPemesan()}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Paket Wisata</Text>
          <Text style={styles.value}>{getNamaPaket()}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Tanggal Kunjungan</Text>
          <Text style={styles.value}>{getTanggalKunjungan()}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Jumlah Orang</Text>
          <Text style={styles.value}>{getJumlahOrang()} orang</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Total Pembayaran</Text>
          <Text style={styles.value}>{getTotalHargaLabel()}</Text>
        </View>

        <View style={styles.statusGrid}>
          <View style={styles.statusBox}>
            <Text style={styles.statusLabel}>Status Pesanan</Text>
            <Text style={styles.statusValue}>
              {formatStatus(getStatusPesanan())}
            </Text>
          </View>

          <View style={styles.statusBox}>
            <Text style={styles.statusLabel}>Status Pembayaran</Text>
            <Text style={styles.statusValue}>
              {formatStatus(getStatusBayar())}
            </Text>
          </View>
        </View>

        {sedangMenungguPembayaran() && (
          <TouchableOpacity style={styles.payButton} onPress={bayarSekarang}>
            <Ionicons name="card-outline" size={18} color="#FFFFFF" />
            <Text style={styles.payButtonText}>Bayar Sekarang</Text>
          </TouchableOpacity>
        )}

        {tiketBisaDigunakan() ? (
          <>
            <TouchableOpacity style={styles.primaryButton} onPress={cetakPDF}>
              <Ionicons name="print-outline" size={18} color="#FFFFFF" />
              <Text style={styles.primaryButtonText}>
                Cetak Barcode / Tiket
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={exportPDF}>
              <Ionicons
                name="document-text-outline"
                size={18}
                color="#8B5E34"
              />
              <Text style={styles.secondaryButtonText}>Export PDF</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.waitingBox}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color="#8B5E34"
            />
            <Text style={styles.waitingText}>{getStatusInfoText()}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F1EA",
  },

  content: {
    paddingBottom: 30,
  },

  header: {
    paddingTop: 48,
    paddingHorizontal: 18,
    paddingBottom: 16,
    backgroundColor: "#F8F1EA",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#F4E5D6",
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#2B1B12",
  },

  card: {
    margin: 18,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E7D6C5",
  },

  title: {
    fontSize: 22,
    fontWeight: "900",
    color: "#2B1B12",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 13,
    color: "#6B5A50",
    textAlign: "center",
    marginTop: 4,
  },

  qrBox: {
    alignItems: "center",
    marginVertical: 24,
  },

  pendingQrBox: {
    alignItems: "center",
    marginVertical: 24,
    backgroundColor: "#FFF7ED",
    borderRadius: 20,
    padding: 20,
  },

  pendingQrTitle: {
    marginTop: 10,
    fontSize: 17,
    fontWeight: "900",
    color: "#2B1B12",
  },

  pendingQrText: {
    marginTop: 6,
    fontSize: 13,
    color: "#8B5E34",
    textAlign: "center",
    fontWeight: "700",
    lineHeight: 19,
  },

  kodeText: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: "900",
    color: "#2B1B12",
  },

  infoRow: {
    marginBottom: 14,
  },

  label: {
    fontSize: 12,
    color: "#7A6A5E",
    marginBottom: 4,
    fontWeight: "700",
  },

  value: {
    fontSize: 15,
    color: "#2B1B12",
    fontWeight: "900",
  },

  statusGrid: {
    gap: 10,
    marginTop: 4,
    marginBottom: 18,
  },

  statusBox: {
    backgroundColor: "#F4E5D6",
    borderRadius: 16,
    padding: 14,
  },

  statusLabel: {
    fontSize: 12,
    color: "#7A6A5E",
    fontWeight: "700",
    marginBottom: 4,
  },

  statusValue: {
    fontSize: 16,
    color: "#8B5E34",
    fontWeight: "900",
  },

  payButton: {
    backgroundColor: "#F59E0B",
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
    marginBottom: 4,
  },

  payButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 14,
  },

  primaryButton: {
    backgroundColor: "#8B5E34",
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 14,
  },

  secondaryButton: {
    borderWidth: 1,
    borderColor: "#8B5E34",
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },

  secondaryButtonText: {
    color: "#8B5E34",
    fontWeight: "900",
    fontSize: 14,
  },

  waitingBox: {
    backgroundColor: "#FFF7ED",
    borderRadius: 16,
    padding: 14,
    marginTop: 12,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },

  waitingText: {
    flex: 1,
    color: "#8B5E34",
    fontWeight: "800",
    fontSize: 13,
    lineHeight: 19,
  },

  center: {
    flex: 1,
    backgroundColor: "#F8F1EA",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: "#6B5A50",
  },

  emptyText: {
    fontSize: 15,
    color: "#2B1B12",
    marginBottom: 18,
    textAlign: "center",
  },
});