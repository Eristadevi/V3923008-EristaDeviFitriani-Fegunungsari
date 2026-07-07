import React, { useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
} from "react-native";

import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";

const logoImage = require("../assets/images/logo.jpg");

export default function Header() {
  const [showMenu, setShowMenu] = useState(false);

  const goTo = (path) => {
    setShowMenu(false);
    router.push(path);
  };

  const goToLogin = () => {
    setShowMenu(false);
    router.push("/login");
  };

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.logoWrapper}
          activeOpacity={0.8}
          onPress={() => router.push("/")}
        >
          <View style={styles.logoImageBox}>
            <Image
              source={logoImage}
              style={styles.logoImage}
              resizeMode="cover"
            />
          </View>

          <View style={styles.logoTextBox}>
            <Text style={styles.logoSmall}>DESA WISATA</Text>
            <Text style={styles.logoMain}>Gunungsari</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.loginButton}
            activeOpacity={0.85}
            onPress={goToLogin}
          >
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            activeOpacity={0.85}
            onPress={() => setShowMenu(true)}
          >
            <Feather name="menu" size={23} color="#5C3A21" />
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={showMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <View style={styles.modalWrapper}>
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowMenu(false)}
          />

          <View style={styles.menuBox}>
            <View style={styles.menuHeader}>
              <View style={styles.menuLogoRow}>
                <View style={styles.menuLogoBox}>
                  <Image
                    source={logoImage}
                    style={styles.menuLogoImage}
                    resizeMode="cover"
                  />
                </View>

                <View>
                  <Text style={styles.menuSmall}>MENU</Text>
                  <Text style={styles.menuTitle}>Gunungsari</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.closeButton}
                activeOpacity={0.85}
                onPress={() => setShowMenu(false)}
              >
                <Feather name="x" size={22} color="#5C3A21" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.menuItem}
              activeOpacity={0.85}
              onPress={() => goTo("/")}
            >
              <View style={styles.menuIconBox}>
                <Feather name="home" size={19} color="#8B5E34" />
              </View>
              <Text style={styles.menuText}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              activeOpacity={0.85}
              onPress={() => goTo("/wisata")}
            >
              <View style={styles.menuIconBox}>
                <Feather name="map" size={19} color="#8B5E34" />
              </View>
              <Text style={styles.menuText}>Wisata</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              activeOpacity={0.85}
              onPress={() => goTo("/paket")}
            >
              <View style={styles.menuIconBox}>
                <Feather name="gift" size={19} color="#8B5E34" />
              </View>
              <Text style={styles.menuText}>Paket Wisata</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              activeOpacity={0.85}
              onPress={() => goTo("/maps")}
            >
              <View style={styles.menuIconBox}>
                <Feather name="map-pin" size={19} color="#8B5E34" />
              </View>
              <Text style={styles.menuText}>Maps</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              activeOpacity={0.85}
              onPress={() => goTo("/profil")}
            >
              <View style={styles.menuIconBox}>
                <Feather name="user" size={19} color="#8B5E34" />
              </View>
              <Text style={styles.menuText}>Profil</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuLoginButton}
              activeOpacity={0.88}
              onPress={goToLogin}
            >
              <Text style={styles.menuLoginText}>Masuk ke Akun</Text>
              <Feather name="arrow-right" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#F8F5F0",
    paddingTop: 46,
    paddingHorizontal: 14,
    paddingBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  logoWrapper: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 6,
  },

  logoImageBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",

    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  logoImage: {
    width: 96,
    height: 64,
  },

  logoTextBox: {
    flex: 1,
    marginLeft: 9,
  },

  logoSmall: {
    fontSize: 9,
    letterSpacing: 2.2,
    color: "#9A8F84",
    fontWeight: "900",
    marginBottom: 4,
  },

  logoMain: {
    fontSize: 21,
    color: "#222222",
    fontWeight: "900",
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  loginButton: {
    backgroundColor: "#8B5E34",
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",

    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  loginText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },

  iconButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",

    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  modalWrapper: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },

  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  menuBox: {
    width: 300,
    backgroundColor: "#FFFFFF",
    borderRadius: 26,
    padding: 20,
    marginTop: 82,
    marginRight: 18,

    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: {
      width: 0,
      height: 8,
    },
  },

  menuHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },

  menuLogoRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  menuLogoBox: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#F8F5F0",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginRight: 10,
  },

  menuLogoImage: {
    width: 88,
    height: 58,
  },

  menuSmall: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2,
    color: "#9A8F84",
    marginBottom: 4,
  },

  menuTitle: {
    fontSize: 21,
    fontWeight: "900",
    color: "#222222",
  },

  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 20,
    backgroundColor: "#F8F5F0",
    justifyContent: "center",
    alignItems: "center",
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F1F1",
  },

  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: 14,
    backgroundColor: "#F5E9DC",
    justifyContent: "center",
    alignItems: "center",
  },

  menuText: {
    fontSize: 15,
    color: "#222222",
    fontWeight: "800",
  },

  menuLoginButton: {
    marginTop: 18,
    backgroundColor: "#8B5E34",
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  menuLoginText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },
});