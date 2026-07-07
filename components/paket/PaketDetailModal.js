import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { COLORS } from "./paketTheme";
import { buatPemesananWisata } from "../../src/services/pemesananWisataService";

const RIWAYAT_PAKET_WISATA_TEXT = "Profil bagian Riwayat Paket Wisata";

const paymentMethods = [
  {
    id: "qris",
    icon: "grid",
    title: "QRIS",
    desc: "Bayar cepat dengan QRIS.",
  },
  {
    id: "bank_transfer",
    icon: "credit-card",
    title: "Transfer Bank",
    desc: "Pembayaran melalui rekening bank.",
  },
  {
    id: "ewallet",
    icon: "smartphone",
    title: "E-Wallet",
    desc: "Bayar melalui dompet digital.",
  },
  {
    id: "pay_at_location",
    icon: "map-pin",
    title: "Bayar di Lokasi",
    desc: "Konfirmasi dulu, bayar saat datang.",
  },
];

const formatDateForApi = (date) => {
  if (!date) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatDateForDisplay = (date) => {
  if (!date) return "";

  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

export default function PaketDetailModal({ visible, paket, onClose }) {
  const [showForm, setShowForm] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("qris");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: "",
    people: "",
    note: "",
  });

  useEffect(() => {
    if (paket) {
      setShowForm(false);
      setSelectedPayment("qris");
      setIsSubmitting(false);
      setShowDatePicker(false);
      setSelectedDate(null);

      setForm({
        name: "",
        phone: "",
        date: "",
        people: "",
        note: `Saya ingin mengajukan kunjungan untuk ${paket.title}.`,
      });
    }
  }, [paket]);

  const priceLabel = paket?.priceLabel || paket?.price || "Menyesuaikan";

  const isPaidPackage = paket?.priceType === "paid";
  const isFreePackage = paket?.priceType === "free";
  const isConsultPackage = paket?.priceType === "consult";

  const getSubmitButtonText = () => {
    if (isSubmitting) return "Mengirim...";
    if (isPaidPackage) return "Lanjutkan Pembayaran";
    if (isFreePackage) return "Daftar Kunjungan";
    if (isConsultPackage) return "Kirim Pengajuan";
    return "Kirim Pengajuan";
  };

  const getSubmitIcon = () => {
    if (isPaidPackage) return "credit-card";
    if (isFreePackage) return "check-circle";
    return "send";
  };

  const resetForm = () => {
    setShowForm(false);
    setSelectedPayment("qris");
    setShowDatePicker(false);
    setSelectedDate(null);

    setForm({
      name: "",
      phone: "",
      date: "",
      people: "",
      note: paket
        ? `Saya ingin mengajukan kunjungan untuk ${paket.title}.`
        : "",
    });
  };

  const handleClose = () => {
    if (isSubmitting) return;

    resetForm();
    onClose();
  };

  const bukaRiwayatPaketWisata = () => {
    router.push("/riwayat-wisata");
  };

  const handleDateChange = (event, date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }

    if (event?.type === "dismissed") {
      return;
    }

    if (date) {
      setSelectedDate(date);

      setForm((prev) => ({
        ...prev,
        date: formatDateForApi(date),
      }));
    }
  };

  const submitForm = async () => {
    if (!form.name || !form.phone || !form.date || !form.people) {
      Alert.alert(
        "Data belum lengkap",
        "Nama, nomor HP, tanggal kunjungan, dan jumlah orang wajib diisi."
      );
      return;
    }

    if (!paket?.id) {
      Alert.alert("Gagal", "Data paket tidak ditemukan.");
      return;
    }

    const jumlahOrang = Number(form.people);

    if (Number.isNaN(jumlahOrang) || jumlahOrang <= 0) {
      Alert.alert(
        "Jumlah orang tidak valid",
        "Jumlah orang harus berupa angka lebih dari 0."
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const payload = {
        paketId: paket.id,
        name: form.name,
        phone: form.phone,
        date: form.date,
        people: jumlahOrang,
        note: form.note,
      };

      if (isPaidPackage) {
        payload.paymentMethod = selectedPayment;
      }

      const result = await buatPemesananWisata(payload);

      const data =
        result?.data?.data ||
        result?.data?.pemesanan ||
        result?.data ||
        result?.pemesanan ||
        result;

      const redirectUrl = data?.redirectUrl || data?.redirect_url || "";
      const kodePesanan = data?.kodePesanan || data?.kode_pesanan || "";

      resetForm();
      onClose();

      if (redirectUrl) {
        Alert.alert(
          "Pemesanan Berhasil",
          `Pemesanan paket wisata berhasil dibuat. Silakan lanjutkan pembayaran sekarang, atau lihat kembali pesanan kamu di ${RIWAYAT_PAKET_WISATA_TEXT}.`,
          [
            {
              text: "Bayar Sekarang",
              onPress: () =>
                router.push({
                  pathname: "/paymentwebview",
                  params: {
                    url: encodeURIComponent(redirectUrl),
                    kodePesanan,
                    jenis: "wisata",
                  },
                }),
            },
            {
              text: "Lihat Riwayat",
              onPress: bukaRiwayatPaketWisata,
            },
          ]
        );

        return;
      }

      Alert.alert(
        "Pengajuan Berhasil",
        result?.message ||
          `Pengajuan kunjungan berhasil dibuat. Kamu bisa melihat perkembangan pesanan di ${RIWAYAT_PAKET_WISATA_TEXT}.`,
        [
          {
            text: "Lihat Riwayat",
            onPress: bukaRiwayatPaketWisata,
          },
          {
            text: "OK",
          },
        ]
      );
    } catch (error) {
      console.log("ERROR PEMESANAN:", error);

      Alert.alert(
        "Gagal",
        error.message ||
          error.error ||
          "Gagal membuat pengajuan kunjungan."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.keyboardView}
        >
          <View style={styles.modalBox}>
            <TouchableOpacity
              style={styles.modalClose}
              activeOpacity={0.8}
              onPress={handleClose}
              disabled={isSubmitting}
            >
              <Feather name="x" size={20} color={COLORS.text} />
            </TouchableOpacity>

            {paket && (
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
              >
                <View style={styles.topSection}>
                  <View style={styles.modalIconBox}>
                    <Feather
                      name={paket.icon}
                      size={30}
                      color={COLORS.primary}
                    />
                  </View>

                  <View style={styles.titleBox}>
                    <Text style={styles.modalCategory}>{paket.category}</Text>
                    <Text style={styles.modalTitle}>{paket.title}</Text>
                  </View>
                </View>

                <Text style={styles.modalDesc}>{paket.detail}</Text>

                <View style={styles.quickInfoRow}>
                  <View style={styles.quickInfoCard}>
                    <Feather
                      name="clock"
                      size={18}
                      color={COLORS.primary}
                    />
                    <Text style={styles.quickInfoLabel}>Durasi</Text>
                    <Text style={styles.quickInfoValue}>{paket.duration}</Text>
                  </View>

                  <View style={styles.quickInfoCard}>
                    <Feather name="tag" size={18} color={COLORS.primary} />
                    <Text style={styles.quickInfoLabel}>Harga</Text>
                    <Text style={styles.quickInfoValue}>{priceLabel}</Text>
                  </View>
                </View>

                <View style={styles.infoBox}>
                  <View style={styles.infoHeader}>
                    <Feather name="users" size={18} color={COLORS.primary} />
                    <Text style={styles.infoTitle}>Cocok Untuk</Text>
                  </View>

                  <Text style={styles.infoText}>{paket.suitable}</Text>
                </View>

                <View style={styles.infoBox}>
                  <View style={styles.infoHeader}>
                    <Feather
                      name="check-square"
                      size={18}
                      color={COLORS.primary}
                    />
                    <Text style={styles.infoTitle}>Fasilitas</Text>
                  </View>

                  {(paket.facilities || []).map((item, index) => (
                    <View key={index} style={styles.facilityRow}>
                      <Feather
                        name="check-circle"
                        size={16}
                        color={COLORS.primary}
                      />
                      <Text style={styles.facilityText}>{item}</Text>
                    </View>
                  ))}
                </View>

                {!showForm ? (
                  <TouchableOpacity
                    style={styles.mainButton}
                    activeOpacity={0.88}
                    onPress={() => setShowForm(true)}
                  >
                    <Feather
                      name="calendar"
                      size={18}
                      color={COLORS.white}
                    />
                    <Text style={styles.mainButtonText}>Ajukan Kunjungan</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.formBox}>
                    <Text style={styles.formTitle}>
                      Form Pengajuan Kunjungan
                    </Text>

                    <Text style={styles.formDesc}>
                      Lengkapi data berikut untuk membuat pengajuan kunjungan.
                    </Text>

                    <TextInput
                      style={styles.input}
                      placeholder="Nama lengkap"
                      placeholderTextColor="#9A8B7E"
                      value={form.name}
                      onChangeText={(value) =>
                        setForm({ ...form, name: value })
                      }
                      editable={!isSubmitting}
                    />

                    <TextInput
                      style={styles.input}
                      placeholder="Nomor HP"
                      placeholderTextColor="#9A8B7E"
                      keyboardType="phone-pad"
                      value={form.phone}
                      onChangeText={(value) =>
                        setForm({ ...form, phone: value })
                      }
                      editable={!isSubmitting}
                    />

                    <TouchableOpacity
                      activeOpacity={0.85}
                      style={styles.dateInput}
                      onPress={() => {
                        if (!isSubmitting) {
                          setShowDatePicker(true);
                        }
                      }}
                      disabled={isSubmitting}
                    >
                      <View style={styles.dateInputContent}>
                        <Text
                          style={[
                            styles.dateText,
                            !selectedDate && styles.datePlaceholder,
                          ]}
                        >
                          {selectedDate
                            ? formatDateForDisplay(selectedDate)
                            : "Pilih tanggal kunjungan"}
                        </Text>

                        <Feather
                          name="calendar"
                          size={18}
                          color={COLORS.primary}
                        />
                      </View>
                    </TouchableOpacity>

                    {showDatePicker && (
                      <DateTimePicker
                        value={selectedDate || new Date()}
                        mode="date"
                        display={Platform.OS === "ios" ? "spinner" : "default"}
                        minimumDate={new Date()}
                        onChange={handleDateChange}
                      />
                    )}

                    {Platform.OS === "ios" && showDatePicker && (
                      <TouchableOpacity
                        style={styles.dateDoneButton}
                        activeOpacity={0.85}
                        onPress={() => setShowDatePicker(false)}
                      >
                        <Text style={styles.dateDoneText}>Selesai</Text>
                      </TouchableOpacity>
                    )}

                    <TextInput
                      style={styles.input}
                      placeholder="Jumlah orang"
                      placeholderTextColor="#9A8B7E"
                      keyboardType="numeric"
                      value={form.people}
                      onChangeText={(value) =>
                        setForm({ ...form, people: value })
                      }
                      editable={!isSubmitting}
                    />

                    <TextInput
                      style={[styles.input, styles.textArea]}
                      placeholder="Catatan tambahan"
                      placeholderTextColor="#9A8B7E"
                      multiline
                      textAlignVertical="top"
                      value={form.note}
                      onChangeText={(value) =>
                        setForm({ ...form, note: value })
                      }
                      editable={!isSubmitting}
                    />

                    {isPaidPackage && (
                      <View style={styles.paymentBox}>
                        <Text style={styles.paymentTitle}>Pembayaran</Text>

                        <Text style={styles.paymentDesc}>
                          Pilih metode pembayaran untuk paket berbayar ini.
                          Pembayaran akan dibuka di dalam aplikasi.
                        </Text>

                        <View style={styles.paymentSummary}>
                          <View>
                            <Text style={styles.paymentSummaryLabel}>
                              Total / Estimasi Harga
                            </Text>

                            <Text style={styles.paymentSummaryValue}>
                              {priceLabel}
                            </Text>
                          </View>

                          <View style={styles.paymentStatusBadge}>
                            <Text style={styles.paymentStatusText}>
                              Belum Dibayar
                            </Text>
                          </View>
                        </View>

                        <View style={styles.paymentList}>
                          {paymentMethods.map((method) => {
                            const isActive = selectedPayment === method.id;

                            return (
                              <TouchableOpacity
                                key={method.id}
                                activeOpacity={0.85}
                                style={[
                                  styles.paymentMethod,
                                  isActive && styles.paymentMethodActive,
                                  isSubmitting && styles.paymentMethodDisabled,
                                ]}
                                onPress={() => setSelectedPayment(method.id)}
                                disabled={isSubmitting}
                              >
                                <View
                                  style={[
                                    styles.paymentIconBox,
                                    isActive && styles.paymentIconBoxActive,
                                  ]}
                                >
                                  <Feather
                                    name={method.icon}
                                    size={18}
                                    color={COLORS.primary}
                                  />
                                </View>

                                <View style={styles.paymentTextBox}>
                                  <Text
                                    style={[
                                      styles.paymentMethodTitle,
                                      isActive &&
                                        styles.paymentMethodTitleActive,
                                    ]}
                                  >
                                    {method.title}
                                  </Text>

                                  <Text
                                    style={[
                                      styles.paymentMethodDesc,
                                      isActive &&
                                        styles.paymentMethodDescActive,
                                    ]}
                                  >
                                    {method.desc}
                                  </Text>
                                </View>

                                {isActive && (
                                  <Feather
                                    name="check-circle"
                                    size={19}
                                    color={COLORS.white}
                                  />
                                )}
                              </TouchableOpacity>
                            );
                          })}
                        </View>
                      </View>
                    )}

                    {isFreePackage && (
                      <View style={styles.noticeBox}>
                        <View style={styles.noticeIconBox}>
                          <Feather
                            name="info"
                            size={18}
                            color={COLORS.primary}
                          />
                        </View>

                        <Text style={styles.noticeText}>
                          Paket ini gratis. Tidak ada pembayaran untuk
                          pengajuan kunjungan ini. Setelah dikonfirmasi admin,
                          tiket dapat dilihat di {RIWAYAT_PAKET_WISATA_TEXT}.
                        </Text>
                      </View>
                    )}

                    {isConsultPackage && (
                      <View style={styles.noticeBox}>
                        <View style={styles.noticeIconBox}>
                          <Feather
                            name="message-circle"
                            size={18}
                            color={COLORS.primary}
                          />
                        </View>

                        <Text style={styles.noticeText}>
                          Harga paket ini akan dikonfirmasi oleh admin setelah
                          pengajuan dikirim. Perkembangan pesanan dapat dilihat
                          di {RIWAYAT_PAKET_WISATA_TEXT}.
                        </Text>
                      </View>
                    )}

                    <TouchableOpacity
                      style={[
                        styles.mainButton,
                        isSubmitting && styles.mainButtonDisabled,
                      ]}
                      activeOpacity={0.88}
                      onPress={submitForm}
                      disabled={isSubmitting}
                    >
                      <Feather
                        name={getSubmitIcon()}
                        size={18}
                        color={COLORS.white}
                      />

                      <Text style={styles.mainButtonText}>
                        {getSubmitButtonText()}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.cancelButton}
                      activeOpacity={0.85}
                      onPress={() => setShowForm(false)}
                      disabled={isSubmitting}
                    >
                      <Text style={styles.cancelButtonText}>Batal</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </ScrollView>
            )}
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(47,42,37,0.48)",
    justifyContent: "flex-end",
  },

  keyboardView: {
    flex: 1,
    justifyContent: "flex-end",
  },

  modalBox: {
    maxHeight: "90%",
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    paddingHorizontal: 24,
    paddingTop: 22,
    paddingBottom: 24,

    shadowColor: COLORS.shadow,
    shadowOpacity: 0.18,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: -6,
    },
    elevation: 8,
  },

  scrollContent: {
    paddingBottom: 14,
  },

  modalClose: {
    alignSelf: "flex-end",
    width: 38,
    height: 38,
    borderRadius: 20,
    backgroundColor: COLORS.soft,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  topSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 16,
  },

  modalIconBox: {
    width: 64,
    height: 64,
    borderRadius: 24,
    backgroundColor: COLORS.soft,
    justifyContent: "center",
    alignItems: "center",
  },

  titleBox: {
    flex: 1,
  },

  modalCategory: {
    fontSize: 11,
    fontWeight: "900",
    color: COLORS.primary,
    letterSpacing: 1.4,
    marginBottom: 7,
    textTransform: "uppercase",
  },

  modalTitle: {
    fontSize: 25,
    fontWeight: "900",
    color: COLORS.text,
    lineHeight: 32,
  },

  modalDesc: {
    fontSize: 15,
    lineHeight: 25,
    color: COLORS.subtext,
    marginBottom: 18,
  },

  quickInfoRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 14,
  },

  quickInfoCard: {
    flex: 1,
    backgroundColor: COLORS.soft,
    borderRadius: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: COLORS.softDark,
  },

  quickInfoLabel: {
    fontSize: 12,
    fontWeight: "900",
    color: COLORS.primaryDark,
    marginTop: 8,
    marginBottom: 4,
  },

  quickInfoValue: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "800",
    color: COLORS.text,
  },

  infoBox: {
    backgroundColor: "#FFF9F4",
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 14,
  },

  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },

  infoTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: COLORS.text,
  },

  infoText: {
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.subtext,
  },

  facilityRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 9,
    marginBottom: 9,
  },

  facilityText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.subtext,
  },

  mainButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 18,
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 6,

    shadowColor: COLORS.primaryDark,
    shadowOpacity: 0.22,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    elevation: 3,
  },

  mainButtonDisabled: {
    opacity: 0.65,
  },

  mainButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "900",
  },

  formBox: {
    marginTop: 6,
    backgroundColor: "#FFF9F4",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  formTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: COLORS.text,
    marginBottom: 6,
  },

  formDesc: {
    fontSize: 13,
    lineHeight: 20,
    color: COLORS.subtext,
    marginBottom: 14,
  },

  input: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 12,
  },

  dateInput: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
  },

  dateInputContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  dateText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
  },

  datePlaceholder: {
    color: "#9A8B7E",
  },

  dateDoneButton: {
    alignSelf: "flex-end",
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 9,
    paddingHorizontal: 16,
    marginBottom: 12,
  },

  dateDoneText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "900",
  },

  textArea: {
    height: 105,
  },

  paymentBox: {
    backgroundColor: COLORS.surface,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 14,
  },

  paymentTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: COLORS.text,
    marginBottom: 6,
  },

  paymentDesc: {
    fontSize: 13,
    lineHeight: 20,
    color: COLORS.subtext,
    marginBottom: 14,
  },

  paymentSummary: {
    backgroundColor: COLORS.soft,
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    gap: 12,
  },

  paymentSummaryLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.primaryDark,
    marginBottom: 4,
  },

  paymentSummaryValue: {
    fontSize: 15,
    fontWeight: "900",
    color: COLORS.text,
  },

  paymentStatusBadge: {
    backgroundColor: COLORS.primary,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 14,
  },

  paymentStatusText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: "900",
  },

  paymentList: {
    gap: 10,
  },

  paymentMethod: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  paymentMethodActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  paymentMethodDisabled: {
    opacity: 0.65,
  },

  paymentIconBox: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: COLORS.soft,
    justifyContent: "center",
    alignItems: "center",
  },

  paymentIconBoxActive: {
    backgroundColor: COLORS.white,
  },

  paymentTextBox: {
    flex: 1,
  },

  paymentMethodTitle: {
    fontSize: 14,
    fontWeight: "900",
    color: COLORS.text,
    marginBottom: 3,
  },

  paymentMethodTitleActive: {
    color: COLORS.white,
  },

  paymentMethodDesc: {
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.subtext,
  },

  paymentMethodDescActive: {
    color: "rgba(255,255,255,0.86)",
  },

  noticeBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: COLORS.soft,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.softDark,
    marginBottom: 14,
  },

  noticeIconBox: {
    width: 34,
    height: 34,
    borderRadius: 13,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
  },

  noticeText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    color: COLORS.subtext,
  },

  cancelButton: {
    paddingVertical: 14,
    alignItems: "center",
  },

  cancelButtonText: {
    fontSize: 14,
    fontWeight: "900",
    color: COLORS.primaryDark,
  },
});