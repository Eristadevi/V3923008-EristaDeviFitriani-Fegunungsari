import React from "react";

import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";

import {
  Ionicons,
  Feather,
} from "@expo/vector-icons";

import { router } from "expo-router";

export default function WisataCard({
  item,
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.card}
      onPress={() =>
        router.push(
          `/detailwisata?id=${item.id}`
        )
      }
    >
      {/* IMAGE */}
      <Image
        source={item.image}
        style={styles.image}
      />

      {/* CONTENT */}
      <View style={styles.content}>
        {/* TOP */}
        <View style={styles.topRow}>
          {/* CATEGORY */}
          <View style={styles.categoryBox}>
            <Text style={styles.category}>
              {item.category}
            </Text>
          </View>

          {/* RATING */}
          <View style={styles.ratingBox}>
            <Ionicons
              name="star"
              size={15}
              color="#fff"
            />

            <Text style={styles.rating}>
              {item.rating}
            </Text>
          </View>
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

        {/* FOOTER */}
        <View style={styles.footer}>
          {/* PRICE */}
          <View>
            <Text
              style={styles.priceLabel}
            >
              Mulai dari
            </Text>

            <Text style={styles.price}>
              {item.price}
            </Text>
          </View>

          {/* BUTTON */}
          <TouchableOpacity
            style={styles.button}
          >
            <Text
              style={styles.buttonText}
            >
              Detail
            </Text>

            <Feather
              name="arrow-right"
              size={16}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",

    borderRadius: 28,

    overflow: "hidden",

    marginBottom: 28,

    elevation: 5,
  },

  /* IMAGE */
  image: {
    width: "100%",
    height: 240,
  },

  /* CONTENT */
  content: {
    padding: 22,
  },

  /* TOP */
  topRow: {
    flexDirection: "row",

    justifyContent:
      "space-between",

    alignItems: "center",

    marginBottom: 18,
  },

  categoryBox: {
    backgroundColor: "#B58B63",

    paddingVertical: 8,
    paddingHorizontal: 16,

    borderRadius: 30,
  },

  category: {
    color: "#fff",

    fontSize: 13,

    fontWeight: "700",
  },

  ratingBox: {
    backgroundColor: "#D4A373",

    flexDirection: "row",

    alignItems: "center",

    gap: 6,

    paddingVertical: 8,
    paddingHorizontal: 14,

    borderRadius: 30,
  },

  rating: {
    color: "#fff",

    fontWeight: "800",

    fontSize: 14,
  },

  /* TITLE */
  title: {
    fontSize: 28,

    fontWeight: "900",

    color: "#222",

    marginBottom: 14,
  },

  /* DESCRIPTION */
  description: {
    color: "#666",

    fontSize: 15,

    lineHeight: 27,

    marginBottom: 24,
  },

  /* FOOTER */
  footer: {
    flexDirection: "row",

    justifyContent:
      "space-between",

    alignItems: "center",
  },

  priceLabel: {
    color: "#777",

    fontSize: 13,

    fontWeight: "800",

    marginBottom: 6,
  },

  price: {
    color: "#B58B63",

    fontSize: 24,

    fontWeight: "900",
  },

  /* BUTTON */
  button: {
    backgroundColor: "#B58B63",

    flexDirection: "row",

    alignItems: "center",

    gap: 8,

    paddingVertical: 12,
    paddingHorizontal: 18,

    borderRadius: 30,
  },

  buttonText: {
    color: "#fff",

    fontWeight: "700",
  },
});