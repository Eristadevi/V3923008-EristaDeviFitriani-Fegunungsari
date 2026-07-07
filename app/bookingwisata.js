import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";

import { buatBookingWisata } from "../src/services/bookingWisataService";

const getParam = (value, fallback = "") => {
  if (Array.isArray(value)) return value[0] || fallback;
  return value || fallback;
};

const formatTanggalApi = (date) => {
  if (!date) return "";

  const tahun = date.getFullYear();
  const bulan = String(date.getMonth() + 1).padStart(2, "0");
  const hari = String(date.getDate()).padStart(2, "0");

  return `${tahun}-${bulan}-${hari}`;
};

const formatTanggalTampil = (date) => {
  if (!date) return "";

  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

export default function BookingWisataScreen() {
  const params = useLocalSearchParams();

  const wisataId = Number(getParam(params.id, "0"));
  const title = getParam(params.title, "Wisata Gunungsari");
  const category = getParam(params.category, "Wisata");
  const priceType = getParam(params.priceType, "free");
  const priceLabel = getParam(params.priceLabel, "Tiket masuk gratis");
  const nominalSatuan = Number(getParam(params.nominalSatuan, "0"));

  const isFree = priceType === "free";
  const isConsult = priceType === "consult";
  const isPaid = priceType === "paid";

  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: "",
    people: "1",
    note: "",
  });

  const totalNominal = useMemo(() => {
    if (!isPaid) return 0;

    const jumlahOrang = Number(form.people || 0);
    return nominalSatuan * jumlahOrang;
  }, [isPaid, nominalSatuan, form.people]);

  const handleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleDateChange = (event, date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }

    if (event?.type === "dismissed") return;

    if (date) {
      setSelectedDate(date);
      handleChange("date", formatTanggalApi(date));
    }
  };

  const getHeaderLabel = () => {
    if (isPaid) return "Booking Wisata";
    return "Ajukan Kunjungan";
  };

  const getInfoText = () => {
    if (isFree) {
      return "Wisata ini gratis. Kamu cukup mengisi data kunjungan dan menunggu konfirmasi admin.";
    }

    if (isConsult) {
      return "Wisata ini menyesuaikan kebutuhan. Admin akan menentukan harga dan metode pembayaran setelah pengajuan dikirim.";
    }

    return "Wisata ini berbayar. Setelah booking dibuat, kamu dapat melanjutkan pembayaran.";
  };

  const getPaymentText = () => {
    if (isFree) return "Tidak perlu bayar";
    if (isConsult) return "Menunggu harga dari admin";

    if (isPaid && totalNominal > 0) {
      return `Rp ${totalNominal.toLocaleString("id-ID")}`;
    }

    return "Berbayar";
  };

  const getStatusAwal = () => {
    if (isPaid) return "Menunggu pembayaran";
    if (isConsult) return "Menunggu admin set harga";
    return "Menunggu konfirmasi admin";
  };

  const validateForm = () => {
    if (!form.name.trim()) {
      Alert.alert("Data belum lengkap", "Nama rombongan wajib diisi.");
      return false;
    }

    if (!form.phone.trim()) {
      Alert.alert("Data belum lengkap", "Nomor HP wajib diisi.");
      return false;
    }

    if (!form.date.trim()) {
      Alert.alert("Data belum lengkap", "Tanggal kunjungan wajib dipilih.");
      return false;
    }

    if (!form.people.trim() || Number(form.people) <= 0) {
      Alert.alert("Data belum lengkap", "Jumlah orang harus lebih dari 0.");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const result = await buatBookingWisata({
        wisataId,
        namaWisata: title,
        kategori: category,

        name: form.name.trim(),
        phone: form.phone.trim(),
        date: form.date.trim(),
        people: Number(form.people),
        note: form.note.trim(),

        priceType,
        priceLabel,
        nominalSatuan,

        paymentMethod: isPaid ? "midtrans" : null,
      });

      const booking = result.data;

      if (booking?.redirectUrl) {
        Alert.alert(
          "Booking Berhasil",
          "Booking berhasil dibuat. Silakan lanjutkan pembayaran.",
          [
            {
              text: "Bayar Sekarang",
              onPress: () =>
                router.push({
                  pathname: "/paymentwebview",
                  params: {
                    url: booking.redirectUrl,
                    kodePesanan: booking.kodeBooking,
                    jenis: "booking-wisata",
                  },
                }),
            },
          ]
        );

        return;
      }

      Alert.alert(
        "Berhasil",
        `${result.message}\n\nSilakan cek status di halaman Profil bagian Riwayat Wisata.`,
        [
          {
            text: "OK",
            onPress: () => router.replace("/(tabs)/profil"),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        "Gagal",
        error?.message || "Booking wisata gagal dibuat. Silakan coba lagi."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={22} color="#222" />
            <Text style={styles.backText}>Kembali</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.label}>{getHeaderLabel()}</Text>

            <Text style={styles.title}>{title}</Text>

            <Text style={styles.description}>{getInfoText()}</Text>
          </View>

          <View style={styles.infoBox}>
            <InfoRow label="Kategori" value={category} />
            <InfoRow label="Harga" value={priceLabel} />
            <InfoRow label="Pembayaran" value={getPaymentText()} />
            <InfoRow label="Status Awal" value={getStatusAwal()} />
          </View>

          <Input
            label="Nama Rombongan / Pengunjung"
            value={form.name}
            placeholder="Contoh: Rombongan Yuki Kato"
            onChangeText={(value) => handleChange("name", value)}
          />

          <Input
            label="Nomor HP"
            value={form.phone}
            placeholder="Contoh: 08123456789"
            keyboardType="phone-pad"
            onChangeText={(value) => handleChange("phone", value)}
          />

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Tanggal Kunjungan</Text>

            <Pressable
              style={styles.dateInput}
              onPress={() => setShowDatePicker(true)}
            >
              <Text
                style={[
                  styles.dateText,
                  !selectedDate && styles.placeholderText,
                ]}
              >
                {selectedDate
                  ? formatTanggalTampil(selectedDate)
                  : "Pilih tanggal kunjungan"}
              </Text>

              <Ionicons name="calendar-outline" size={21} color="#2E7D32" />
            </Pressable>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={selectedDate || new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              minimumDate={new Date()}
              onChange={handleDateChange}
            />
          )}

          <Input
            label="Jumlah Orang"
            value={form.people}
            placeholder="Contoh: 10"
            keyboardType="numeric"
            onChangeText={(value) => handleChange("people", value)}
          />

          <Input
            label="Catatan"
            value={form.note}
            placeholder="Contoh: Rombongan sekolah ingin datang pagi hari."
            multiline
            onChangeText={(value) => handleChange("note", value)}
          />

          <TouchableOpacity
            style={[styles.submitButton, loading && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.submitText}>
                  {isPaid ? "Booking Sekarang" : "Kirim Pengajuan"}
                </Text>
                <Ionicons name="send" size={18} color="#FFFFFF" />
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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

function Input({ label, multiline = false, ...props }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        {...props}
        multiline={multiline}
        placeholderTextColor="#A99C8F"
        textAlignVertical={multiline ? "top" : "center"}
        style={[styles.input, multiline && styles.textarea]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  container: {
    flex: 1,
    backgroundColor: "#f8f5f0",
  },

  content: {
    padding: 20,
    paddingBottom: 180,
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 8,
    marginBottom: 18,
  },

  backText: {
    color: "#222",
    fontSize: 15,
    fontWeight: "800",
  },

  header: {
    marginBottom: 18,
  },

  label: {
    color: "#2E7D32",
    fontSize: 13,
    fontWeight: "900",
    marginBottom: 6,
  },

  title: {
    color: "#222",
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 8,
  },

  description: {
    color: "#666",
    fontSize: 14,
    lineHeight: 22,
  },

  infoBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
    gap: 10,

    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },

  infoLabel: {
    flex: 1,
    color: "#777",
    fontSize: 13,
    fontWeight: "800",
  },

  infoValue: {
    flex: 1.35,
    color: "#222",
    fontSize: 13,
    fontWeight: "900",
    textAlign: "right",
  },

  field: {
    marginBottom: 14,
  },

  fieldLabel: {
    color: "#222",
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 8,
  },

  input: {
    minHeight: 52,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0D6CC",
    borderRadius: 15,
    paddingHorizontal: 14,
    color: "#222",
    fontSize: 14,
    fontWeight: "700",
  },

  dateInput: {
    minHeight: 52,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0D6CC",
    borderRadius: 15,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  dateText: {
    color: "#222",
    fontSize: 14,
    fontWeight: "700",
  },

  placeholderText: {
    color: "#A99C8F",
  },

  textarea: {
    minHeight: 120,
    paddingTop: 14,
    paddingBottom: 14,
  },

  submitButton: {
    minHeight: 54,
    borderRadius: 24,
    backgroundColor: "#2E7D32",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 6,
  },

  disabledButton: {
    opacity: 0.7,
  },

  submitText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },
});