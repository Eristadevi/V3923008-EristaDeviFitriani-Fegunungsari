import React, { useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";

import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";

export default function Header() {
  const [showMenu, setShowMenu] =
    useState(false);

  const [showSearch, setShowSearch] =
    useState(false);

  const goTo = (path) => {
    setShowMenu(false);
    router.push(path);
  };

  return (
    <>
      {/* HEADER */}
      <View style={styles.header}>
        {/* LOGO */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push("/")}
        >
          <Text style={styles.logoSmall}>
            DESA WISATA
          </Text>

          <Text style={styles.logoMain}>
            Gunungsari
          </Text>
        </TouchableOpacity>

        {/* ACTION */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() =>
              setShowSearch(!showSearch)
            }
          >
            <Feather
              name="search"
              size={19}
              color="#222"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setShowMenu(true)}
          >
            <Feather
              name="menu"
              size={21}
              color="#222"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* SEARCH */}
      {showSearch && (
        <View style={styles.searchWrapper}>
          <Feather
            name="search"
            size={18}
            color="#888"
          />

          <TextInput
            placeholder="Cari wisata..."
            placeholderTextColor="#999"
            style={styles.searchInput}
          />
        </View>
      )}

      {/* DRAWER */}
      <Modal
        visible={showMenu}
        transparent
        animationType="slide"
      >
        <View style={styles.overlay}>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() =>
              setShowMenu(false)
            }
          />

          <View style={styles.drawer}>
            {/* CLOSE */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() =>
                setShowMenu(false)
              }
            >
              <Feather
                name="x"
                size={28}
                color="#222"
              />
            </TouchableOpacity>

            {/* MENU */}
            <Text style={styles.drawerLabel}>
              MENU
            </Text>

            <TouchableOpacity
              onPress={() => goTo("/")}
            >
              <Text style={styles.menuItem}>
                Home
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                goTo("/wisata")
              }
            >
              <Text style={styles.menuItem}>
                Wisata
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                goTo("/paket")
              }
            >
              <Text style={styles.menuItem}>
                Paket
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                goTo("/profil")
              }
            >
              <Text style={styles.menuItem}>
                Profil
              </Text>
            </TouchableOpacity>

            {/* CONTACT */}
            <View style={styles.contactBox}>
              <Text style={styles.contactTitle}>
                Contact
              </Text>

              <Text style={styles.contactText}>
                gunungsari@madiun.id
              </Text>

              <Text style={styles.contactText}>
                +62 812-0000-0000
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#F8F5F1",

    paddingTop: 60,
    paddingBottom: 18,
    paddingHorizontal: 22,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logoSmall: {
    color: "#888",
    fontSize: 11,
    letterSpacing: 2,
    marginBottom: 4,
  },

  logoMain: {
    color: "#222",
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  actions: {
    flexDirection: "row",
    gap: 10,
  },

  iconButton: {
    width: 40,
    height: 40,

    borderRadius: 30,

    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "#fff",

    borderWidth: 1,
    borderColor: "#eee",
  },

  searchWrapper: {
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 15,

    backgroundColor: "#fff",

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 16,
    paddingVertical: 14,

    borderRadius: 30,

    borderWidth: 1,
    borderColor: "#eee",
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: "#222",
  },

  overlay: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  drawer: {
    width: "78%",
    backgroundColor: "#fff",

    paddingTop: 70,
    paddingHorizontal: 28,
  },

  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 25,
  },

  drawerLabel: {
    fontSize: 12,
    letterSpacing: 3,
    color: "#999",
    marginBottom: 25,
  },

  menuItem: {
    fontSize: 30,
    fontWeight: "800",
    color: "#222",
    marginBottom: 22,
  },

  contactBox: {
    marginTop: 45,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 25,
  },

  contactTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#222",
    marginBottom: 12,
  },

  contactText: {
    color: "#666",
    marginBottom: 6,
    fontSize: 14,
  },
});