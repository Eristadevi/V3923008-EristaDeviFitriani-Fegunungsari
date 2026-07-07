import React from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";

import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "./paketTheme";

const fallbackImage = require("../../assets/images/hero1.jpeg");

const getImageSource = (image) => {
  if (!image) {
    return fallbackImage;
  }

  if (typeof image === "string") {
    return { uri: image };
  }

  return image;
};

const normalizeIconName = (icon) => {
  const iconMap = {
    leaf: "feather",
    home: "home",
    "map-pin": "map-pin",
    camera: "camera",
    coffee: "coffee",
    "shopping-bag": "shopping-bag",
    users: "users",
    "book-open": "book-open",
    music: "music",
    feather: "feather",
  };

  return iconMap[icon] || "map-pin";
};

export default function PaketCard({ paket, onPress }) {
  const imageSource = getImageSource(paket?.image || paket?.imageUrl);
  const iconName = normalizeIconName(paket?.icon);
  const priceText = paket?.price || paket?.priceLabel || "Menyesuaikan";

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.88}
      onPress={onPress}
    >
      <ImageBackground
        source={imageSource}
        style={styles.image}
        imageStyle={styles.imageStyle}
      >
        <LinearGradient
          colors={[
            "rgba(0,0,0,0.04)",
            "rgba(0,0,0,0.28)",
            "rgba(0,0,0,0.72)",
          ]}
          style={styles.overlay}
        >
          <View style={styles.topBadge}>
            <Feather name={iconName} size={14} color={COLORS.white} />

            <Text style={styles.topBadgeText}>
              {paket?.category || "Wisata"}
            </Text>
          </View>

          <Text style={styles.imageTitle}>
            {paket?.title || "Paket Wisata"}
          </Text>

          <Text style={styles.imageDesc} numberOfLines={2}>
            {paket?.desc || "Paket wisata Desa Gunungsari."}
          </Text>
        </LinearGradient>
      </ImageBackground>

      <View style={styles.content}>
        <View style={styles.infoRow}>
          <View style={styles.badge}>
            <Feather name="clock" size={13} color={COLORS.primary} />

            <Text style={styles.badgeText}>
              {paket?.duration || "-"}
            </Text>
          </View>

          <View style={styles.badge}>
            <Feather name="tag" size={13} color={COLORS.primary} />

            <Text style={styles.badgeText}>
              {priceText}
            </Text>
          </View>
        </View>

        <View style={styles.bottomRow}>
          <Text style={styles.suitableText}>
            Cocok untuk: {paket?.suitable || "-"}
          </Text>

          <View style={styles.detailLink}>
            <Text style={styles.detailText}>Detail</Text>

            <Feather
              name="chevron-right"
              size={17}
              color={COLORS.primary}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 26,
    overflow: "hidden",

    shadowColor: COLORS.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    elevation: 3,
  },

  image: {
    height: 185,
    backgroundColor: "#e5e7eb",
  },

  imageStyle: {
    resizeMode: "cover",
  },

  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 18,
  },

  topBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.22)",
    paddingVertical: 7,
    paddingHorizontal: 11,
    borderRadius: 16,
    marginBottom: 10,
  },

  topBadgeText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
  },

  imageTitle: {
    color: COLORS.white,
    fontSize: 21,
    fontWeight: "900",
    lineHeight: 27,
    marginBottom: 6,

    textShadowColor: "rgba(0,0,0,0.35)",
    textShadowOffset: {
      width: 0,
      height: 2,
    },
    textShadowRadius: 8,
  },

  imageDesc: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 13,
    lineHeight: 20,

    textShadowColor: "rgba(0,0,0,0.30)",
    textShadowOffset: {
      width: 0,
      height: 2,
    },
    textShadowRadius: 6,
  },

  content: {
    padding: 18,
  },

  infoRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 14,
  },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: COLORS.soft,
    paddingVertical: 7,
    paddingHorizontal: 11,
    borderRadius: 14,
  },

  badgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: COLORS.primary,
  },

  bottomRow: {
    gap: 12,
  },

  suitableText: {
    fontSize: 13,
    lineHeight: 20,
    color: COLORS.subtext,
  },

  detailLink: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
  },

  detailText: {
    fontSize: 13,
    fontWeight: "900",
    color: COLORS.primary,
  },
});