import { useCallback, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

export default function ProfilScreen({ navigation }) {
  const [user, setUser] = useState(null);

  const getUser = async () => {
    const savedUser = await AsyncStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      setUser(null);
    }
  };

  const goToLogin = () => {
    navigation.getParent()?.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  const handleLogout = () => {
    if (!user) {
      goToLogin();
      return;
    }

    Alert.alert("Keluar", "Apakah Anda yakin ingin keluar dari akun?", [
      {
        text: "Batal",
        style: "cancel",
      },
      {
        text: "Keluar",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.removeItem("token");
          await AsyncStorage.removeItem("user");

          navigation.getParent()?.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
        },
      },
    ]);
  };

  useFocusEffect(
    useCallback(() => {
      getUser();
    }, [])
  );

  const initialName = user?.namaLengkap
    ? user.namaLengkap.charAt(0).toUpperCase()
    : "G";

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.pageTitle}>Profil</Text>

      <View style={styles.profileBox}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initialName}</Text>
        </View>

        <View>
          <Text style={styles.name}>{user?.namaLengkap || "Guest User"}</Text>
          <Text style={styles.email}>{user?.email || "Belum login"}</Text>
        </View>
      </View>

      {!user ? (
        <TouchableOpacity style={styles.verifyButton} onPress={goToLogin}>
          <Text style={styles.verifyText}>Login / Daftar Akun</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.verifyButton}>
          <Text style={styles.verifyText}>Akun Pengunjung Aktif</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.sectionTitle}>Akun</Text>

      <MenuItem icon="user" title="Informasi Akun" />
      <MenuItem icon="shield" title="Ketentuan & Privasi" />
      <MenuItem icon="lock" title="Keamanan Akun" />
      <MenuItem icon="bell" title="Notifikasi" />
      <MenuItem icon="help-circle" title="Bantuan & Laporan Saya" />

      <TouchableOpacity style={styles.logoutItem} onPress={handleLogout}>
        <Text style={styles.logoutText}>Keluar</Text>
        <Feather name="log-out" size={22} color="#777" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function MenuItem({ icon, title }) {
  return (
    <TouchableOpacity style={styles.menuItem}>
      <View style={styles.menuLeft}>
        <Feather name={icon} size={20} color="#4f8f5a" />
        <Text style={styles.menuText}>{title}</Text>
      </View>
      <Ionicons name="chevron-forward" size={22} color="#999" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 22,
    paddingTop: 10,
  },

  pageTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#67b56f",
    marginBottom: 28,
  },

  profileBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 14,
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#8bd08f",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    fontSize: 22,
    fontWeight: "900",
    color: "#14532d",
  },

  name: {
    fontSize: 20,
    fontWeight: "900",
    color: "#111827",
  },

  email: {
    fontSize: 13,
    color: "#777",
    marginTop: 2,
  },

  verifyButton: {
    backgroundColor: "#67b56f",
    paddingVertical: 12,
    borderRadius: 22,
    alignItems: "center",
    marginBottom: 24,
  },

  verifyText: {
    color: "#fff",
    fontWeight: "800",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#333",
    marginBottom: 10,
  },

  menuItem: {
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  menuText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
  },

  logoutItem: {
    paddingVertical: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logoutText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#333",
  },
});