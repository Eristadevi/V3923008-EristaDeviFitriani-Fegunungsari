import React from "react";

import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function WisataCard({ item }) {
  const router = useRouter();

  const priceType = item.priceType || "free";

  const isPundensari = item.isPundensari;
  const isPaid = priceType === "paid";
  const isConsult = priceType === "consult";
  const isCoin = priceType === "coin";
  const isFree = priceType === "free";

  const goToDetail = () => {
    router.push({
      pathname: "/detailwisata",
      params: {
        id: String(item.id),
        title: item.title,
      },
    });
  };

  const goToTukarKoin = () => {
    router.push("/tukarkoin");
  };

  const goToBookingWisata = () => {
    router.push({
      pathname: "/bookingwisata",
      params: {
        id: String(item.id),
        title: item.title,
        category: item.category || "",
        priceType: priceType,
        priceLabel: item.priceLabel || getDefaultPriceLabel(),
        nominalSatuan: String(item.nominalSatuan || item.nominal || 0),
      },
    });
  };

  const getDefaultPriceLabel = () => {
    if (isPaid) return "Berbayar";
    if (isConsult) return "Menyesuaikan kebutuhan";
    if (isCoin) return "Menggunakan koin bambu";
    return "Tiket masuk gratis";
  };

  const getPriceIcon = () => {
    if (isPaid) return "card";
    if (isConsult) return "help-circle";
    if (isCoin) return "cash";
    return "checkmark-circle";
  };

  const getPriceColor = () => {
    if (isPaid) return "#9A5A20";
    if (isConsult) return "#7A4EAB";
    if (isCoin) return "#8B5E34";
    return "#2E7D32";
  };

  const getPriceBoxStyle = () => {
    if (isPaid) return styles.paidBox;
    if (isConsult) return styles.consultBox;
    if (isCoin) return styles.coinBox;
    return styles.freeBox;
  };

  const getPriceTextStyle = () => {
    if (isPaid) return styles.paidText;
    if (isConsult) return styles.consultText;
    if (isCoin) return styles.coinText;
    return styles.freeText;
  };

  const getActionText = () => {
    if (isPaid) return "Booking";
    return "Ajukan Kunjungan";
  };

  return (
    <View style={styles.card}>
      <Image source={item.image} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.name}>{item.title}</Text>

        <Text style={styles.description}>{item.description}</Text>

        <View style={[styles.priceBox, getPriceBoxStyle()]}>
          <Ionicons
            name={getPriceIcon()}
            size={17}
            color={getPriceColor()}
          />

          <Text
            style={[styles.priceText, getPriceTextStyle()]}
            numberOfLines={1}
          >
            {item.priceLabel || getDefaultPriceLabel()}
          </Text>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.detailButton} onPress={goToDetail}>
            <Text style={styles.detailButtonText}>Detail</Text>
            <Ionicons name="arrow-forward" size={17} color="#FFFFFF" />
          </TouchableOpacity>

          {isPundensari ? (
            <TouchableOpacity style={styles.coinButton} onPress={goToTukarKoin}>
              <Text style={styles.coinButtonText}>Tukar Koin</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.visitButton}
              onPress={goToBookingWisata}
            >
              <Text style={styles.visitButtonText} numberOfLines={1}>
                {getActionText()}
              </Text>
              <Ionicons name="calendar" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    marginHorizontal: 20,
    marginBottom: 28,
    overflow: "hidden",

    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  image: {
    width: "100%",
    height: 205,
    resizeMode: "cover",
  },

  content: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 18,
  },

  name: {
    fontSize: 22,
    fontWeight: "900",
    color: "#222222",
    marginBottom: 8,
  },

  description: {
    fontSize: 14,
    color: "#666666",
    lineHeight: 22,
    marginBottom: 14,
  },

  priceBox: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    marginBottom: 18,
    maxWidth: "100%",
  },

  freeBox: {
    backgroundColor: "#EAF6EE",
  },

  paidBox: {
    backgroundColor: "#FFF1DF",
  },

  consultBox: {
    backgroundColor: "#F1EAFE",
  },

  coinBox: {
    backgroundColor: "#F5E9DC",
  },

  priceText: {
    fontSize: 13,
    fontWeight: "800",
  },

  freeText: {
    color: "#2E7D32",
  },

  paidText: {
    color: "#9A5A20",
  },

  consultText: {
    color: "#7A4EAB",
  },

  coinText: {
    color: "#8B5E34",
  },

  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },

  detailButton: {
    flex: 0.9,
    backgroundColor: "#C08B5C",
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
  },

  detailButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  coinButton: {
    flex: 1.1,
    backgroundColor: "#8B5E34",
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  coinButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  visitButton: {
    flex: 1.35,
    backgroundColor: "#2E7D32",
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 5,
  },

  visitButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
  },
});