import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

import { API_URL } from "../src/config/api";

const nominalData = [5000, 10000, 20000, 30000, 50000, 100000];

export default function TukarKoin() {
  const router = useRouter();

  const [nominal, setNominal] = useState(50000);
  const [loading, setLoading] = useState(false);

  const buatPembayaran = async () => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert("Belum Login", "Silakan login terlebih dahulu.");
        return;
      }

      const response = await fetch(`${API_URL}/api/koin/buat-pembayaran`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nominal }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        Alert.alert("Gagal", result.message || "Gagal membuat pembayaran.");
        return;
      }

      await AsyncStorage.setItem("transaksiKoin", JSON.stringify(result.data));

      if (result.data.redirectUrl) {
        router.push({
          pathname: "/paymentwebview",
          params: {
            url: encodeURIComponent(result.data.redirectUrl),
            kodePesanan: result.data.kodePesanan,
          },
        });
      }
    } catch (error) {
      console.log("ERROR BUAT PEMBAYARAN:", error);
      Alert.alert("Error", "Tidak dapat terhubung ke server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#2B1B12" />
        </TouchableOpacity>

        <Text style={styles.title}>Tukar Koin Pundensari</Text>
        <Text style={styles.subtitle}>
          Pilih nominal koin, lakukan pembayaran, lalu dapatkan tiket digital
          untuk ditunjukkan kepada petugas Pasar Pundensari.
        </Text>
      </View>

      <View style={styles.infoBox}>
        <Ionicons name="wallet-outline" size={28} color="#A66A3A" />

        <View style={styles.infoTextBox}>
          <Text style={styles.infoTitle}>Booking Koin Bambu</Text>
          <Text style={styles.infoText}>
            Setelah pembayaran berhasil, aplikasi akan membuat tiket digital
            berisi kode penukaran koin.
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Pilih Nominal</Text>

      <View style={styles.nominalWrapper}>
        {nominalData.map((item) => {
          const active = nominal === item;

          return (
            <TouchableOpacity
              key={item}
              style={[styles.nominalCard, active && styles.nominalCardActive]}
              onPress={() => setNominal(item)}
            >
              <View>
                <Text
                  style={[
                    styles.nominalText,
                    active && styles.nominalTextActive,
                  ]}
                >
                  Rp {item.toLocaleString("id-ID")}
                </Text>

                <Text
                  style={[
                    styles.nominalSubText,
                    active && styles.nominalSubTextActive,
                  ]}
                >
                  Koin Pundensari senilai Rp {item.toLocaleString("id-ID")}
                </Text>
              </View>

              {active && (
                <Ionicons name="checkmark-circle" size={22} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        style={styles.payButton}
        onPress={buatPembayaran}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <>
            <Text style={styles.payButtonText}>Bayar Sekarang</Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
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

  infoBox: {
    margin: 20,
    backgroundColor: "#FFFFFF",
    padding: 18,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#E7D6C5",
  },

  infoTextBox: {
    flex: 1,
    marginLeft: 14,
  },

  infoTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: "#2B1B12",
    marginBottom: 5,
  },

  infoText: {
    fontSize: 13,
    color: "#6B5A50",
    lineHeight: 20,
  },

  sectionTitle: {
    marginHorizontal: 20,
    marginBottom: 14,
    fontSize: 19,
    fontWeight: "900",
    color: "#2B1B12",
  },

  nominalWrapper: {
    marginHorizontal: 20,
  },

  nominalCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E4D4C5",
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  nominalCardActive: {
    backgroundColor: "#A66A3A",
    borderColor: "#A66A3A",
  },

  nominalText: {
    fontSize: 20,
    fontWeight: "900",
    color: "#2B1B12",
  },

  nominalTextActive: {
    color: "#FFFFFF",
  },

  nominalSubText: {
    fontSize: 12,
    color: "#7A6A60",
    marginTop: 4,
  },

  nominalSubTextActive: {
    color: "#FBE9D7",
  },

  payButton: {
    marginHorizontal: 20,
    marginTop: 18,
    backgroundColor: "#8B5E34",
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  payButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },
});