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
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../config/api";

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [namaLengkap, setNamaLengkap] = useState("");
  const [nomorTelepon, setNomorTelepon] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [konfirmasiPassword, setKonfirmasiPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (
      !username ||
      !namaLengkap ||
      !nomorTelepon ||
      !email ||
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
          username,
          namaLengkap,
          nomorTelepon,
          email,
          password,
          konfirmasiPassword,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        Alert.alert("Registrasi gagal", result.message);
        return;
      }

      await AsyncStorage.setItem("token", result.data.token);
      await AsyncStorage.setItem("user", JSON.stringify(result.data.user));

      Alert.alert("Berhasil", "Registrasi berhasil.");
      navigation.replace("UserTabs");
    } catch (error) {
      Alert.alert("Error", "Tidak dapat terhubung ke server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
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
            style={styles.button}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Daftar</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Sudah punya akun?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.link}> Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#F7F1EA",
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 22,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 24,
    borderRadius: 24,
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
    borderColor: "#DDDDDD",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 14,
    backgroundColor: "#FAFAFA",
  },
  button: {
    backgroundColor: "#D6A267",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
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
    fontWeight: "800",
  },
});