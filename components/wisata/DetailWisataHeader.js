import React from "react";

import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";

import {
  Feather,
  Ionicons,
} from "@expo/vector-icons";

import { router } from "expo-router";

export default function DetailWisataHeader({
  item,
}) {
  return (
    <ImageBackground
      source={item.image}
      style={styles.container}
    >
      {/* OVERLAY */}
      <View style={styles.overlay} />

      {/* TOP BAR */}
      <View style={styles.topBar}>
        {/* BACK */}
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() =>
            router.back()
          }
        >
          <Feather
            name="arrow-left"
            size={22}
            color="#fff"
          />
        </TouchableOpacity>

        {/* MAP */}
        <TouchableOpacity
          style={styles.iconButton}
        >
          <Ionicons
            name="map-outline"
            size={22}
            color="#fff"
          />
        </TouchableOpacity>
      </View>

      {/* CONTENT */}
      <View style={styles.content}>
        {/* CATEGORY */}
        <View style={styles.categoryBox}>
          <Text style={styles.category}>
            {item.category}
          </Text>
        </View>

        {/* TITLE */}
        <Text style={styles.title}>
          {item.title}
        </Text>

        {/* DESCRIPTION */}
        <Text
          style={styles.description}
          numberOfLines={2}
        >
          {item.description}
        </Text>

        {/* BOTTOM */}
        <View style={styles.bottomRow}>
          {/* RATING */}
          <View style={styles.ratingBox}>
            <Ionicons
              name="star"
              size={18}
              color="#FFD700"
            />

            <Text style={styles.rating}>
              {item.rating}
            </Text>
          </View>

          {/* PRICE */}
          <Text style={styles.price}>
            {item.price}
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 480,

    justifyContent: "space-between",
  },

  /* OVERLAY */
  overlay: {
    ...StyleSheet.absoluteFillObject,

    backgroundColor:
      "rgba(0,0,0,0.38)",
  },

  /* TOP BAR */
  topBar: {
    marginTop: 60,

    paddingHorizontal: 24,

    flexDirection: "row",

    justifyContent:
      "space-between",

    zIndex: 10,
  },

  iconButton: {
    width: 48,
    height: 48,

    borderRadius: 24,

    backgroundColor:
      "rgba(255,255,255,0.22)",

    justifyContent: "center",
    alignItems: "center",
  },

  /* CONTENT */
  content: {
    paddingHorizontal: 24,

    paddingBottom: 42,
  },

  categoryBox: {
    alignSelf: "flex-start",

    backgroundColor: "#B58B63",

    paddingVertical: 8,
    paddingHorizontal: 16,

    borderRadius: 30,

    marginBottom: 18,
  },

  category: {
    color: "#fff",

    fontSize: 13,

    fontWeight: "700",
  },

  title: {
    fontSize: 40,

    fontWeight: "900",

    color: "#fff",

    lineHeight: 48,

    marginBottom: 16,
  },

  description: {
    color: "#F2F2F2",

    fontSize: 15,

    lineHeight: 28,

    marginBottom: 26,
  },

  /* BOTTOM */
  bottomRow: {
    flexDirection: "row",

    justifyContent:
      "space-between",

    alignItems: "center",
  },

  ratingBox: {
    flexDirection: "row",

    alignItems: "center",

    gap: 8,
  },

  rating: {
    color: "#fff",

    fontSize: 16,

    fontWeight: "700",
  },

  price: {
    color: "#fff",

    fontSize: 22,

    fontWeight: "900",
  },
});