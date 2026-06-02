import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { API_URL } from "../src/config/api";

export default function RegisterScreen() {
  const [username, setUsername] = useState("");
  const [namaLengkap, setNamaLengkap] = useState("");
  const [nomorTelepon, setNomorTelepon] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [konfirmasiPassword, setKonfirmasiPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (
      !username.trim() ||
      !namaLengkap.trim() ||
      !nomorTelepon.trim() ||
      !email.trim() ||
      !password ||
      !konfirmasiPassword
    ) {
      Alert.alert("Validasi", "Semua data registrasi wajib diisi.");
      return;
    }

    if (password !== konfirmasiPassword) {
      Alert.alert("Validasi", "Password dan konfirmasi password tidak sama.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          namaLengkap: namaLengkap.trim(),
          nomorTelepon: nomorTelepon.trim(),
          email: email.trim(),
          password,
          konfirmasiPassword,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        Alert.alert("Registrasi gagal", result.message);
        return;
      }

      Alert.alert("Berhasil", "Registrasi berhasil. Silakan login.", [
        {
          text: "OK",
          onPress: () => router.replace("/login"),
        },
      ]);
    } catch (error) {
      console.log("REGISTER ERROR:", error);
      Alert.alert("Error", "Tidak dapat terhubung ke server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Registrasi</Text>
        <Text style={styles.subtitle}>Buat akun pengunjung Gunungsari</Text>

        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Nama Lengkap"
          value={namaLengkap}
          onChangeText={setNamaLengkap}
        />

        <TextInput
          style={styles.input}
          placeholder="Nomor Telepon"
          value={nomorTelepon}
          onChangeText={setNomorTelepon}
          keyboardType="phone-pad"
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TextInput
          style={styles.input}
          placeholder="Konfirmasi Password"
          value={konfirmasiPassword}
          onChangeText={setKonfirmasiPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Daftar</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Sudah punya akun?</Text>
          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text style={styles.link}> Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f8f5f0",
    justifyContent: "center",
    padding: 22,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    elevation: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#222",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: "#777",
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 14,
    backgroundColor: "#fafafa",
  },
  button: {
    backgroundColor: "#67b56f",
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "900",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 18,
  },
  footerText: {
    color: "#666",
    fontSize: 15,
  },
  link: {
    color: "#0A8FBF",
    fontSize: 15,
    fontWeight: "900",
  },
});