import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { API_URL } from "../src/config/api";

export default function LoginScreen() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!login || !password) {
      Alert.alert("Validasi", "Username/email dan password wajib diisi.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login,
          password,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        Alert.alert("Login gagal", result.message);
        return;
      }

      await AsyncStorage.setItem("token", result.data.token);
      await AsyncStorage.setItem("user", JSON.stringify(result.data.user));

      if (result.data.user.role === "admin") {
        Alert.alert("Admin", "Login admin berhasil.");
        // nanti bisa diarahkan ke dashboard admin
        // router.replace("/admin");
      } else {
        router.replace("/");
      }
    } catch (error) {
      Alert.alert("Error", "Tidak dapat terhubung ke server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>Masuk ke Desa Wisata Gunungsari</Text>

        <TextInput
          style={styles.input}
          placeholder="Username atau Email"
          value={login}
          onChangeText={setLogin}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Belum punya akun?</Text>
          <TouchableOpacity onPress={() => router.push("/register")}>
            <Text style={styles.link}> Registrasi</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => router.replace("/")}>
          <Text style={styles.skipText}>Masuk sebagai Guest</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  skipText: {
    textAlign: "center",
    color: "#777",
    marginTop: 20,
    fontWeight: "700",
  },
});