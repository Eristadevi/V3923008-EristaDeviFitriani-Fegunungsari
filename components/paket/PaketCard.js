import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";

export default function PaketCard({ title, type, price, desc, duration }) {
  const [open, setOpen] = useState(false);

  const handleBooking = () => {
    const phone = "6285233613596"; // GANTI dengan nomor WhatsApp admin
    const message = `Halo, saya ingin booking paket wisata:
    
Paket: ${title}
Jenis: ${type}
Harga: ${price}
Durasi: ${duration}

Mohon info lebih lanjut.`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.iconBox}>
          <Feather name="map-pin" size={22} color="#fff" />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.type}>{type}</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.price}>{price}</Text>
        </View>
      </View>

      <Text style={styles.desc}>{desc}</Text>

      <View style={styles.infoRow}>
        <Feather name="clock" size={16} color="#7a4f2b" />
        <Text style={styles.infoText}>{duration}</Text>
      </View>

      <TouchableOpacity style={styles.detailButton} onPress={() => setOpen(!open)}>
        <Text style={styles.detailButtonText}>
          {open ? "Tutup Detail" : "Lihat Detail"}
        </Text>
      </TouchableOpacity>

      {open && (
        <View style={styles.detailBox}>
          <Text style={styles.detailTitle}>Fasilitas / Kegiatan</Text>
          <Text style={styles.detailText}>• Pendamping lokal</Text>
          <Text style={styles.detailText}>• Edukasi budaya Gunungsari</Text>
          <Text style={styles.detailText}>• Interaksi dengan warga</Text>
          <Text style={styles.detailText}>• Pengalaman khas desa wisata</Text>
        </View>
      )}

      <TouchableOpacity style={styles.bookingButton} onPress={handleBooking}>
        <Ionicons name="logo-whatsapp" size={18} color="#fff" />
        <Text style={styles.bookingText}>Booking Sekarang</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 18,
    elevation: 4,
  },
  topRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#c29a78",
    justifyContent: "center",
    alignItems: "center",
  },
  type: {
    color: "#c29a78",
    fontWeight: "800",
    marginBottom: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "900",
    color: "#111827",
  },
  price: {
    marginTop: 5,
    color: "#2e7d32",
    fontWeight: "900",
  },
  desc: {
    marginTop: 12,
    color: "#555",
    lineHeight: 20,
  },
  infoRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  infoText: {
    color: "#7a4f2b",
    fontWeight: "700",
  },
  detailButton: {
    marginTop: 14,
    backgroundColor: "#111827",
    paddingVertical: 11,
    borderRadius: 20,
    alignItems: "center",
  },
  detailButtonText: {
    color: "#fff",
    fontWeight: "800",
  },
  detailBox: {
    marginTop: 14,
    backgroundColor: "#f8f1e8",
    borderRadius: 14,
    padding: 14,
  },
  detailTitle: {
    fontWeight: "900",
    color: "#7a4f2b",
    marginBottom: 8,
  },
  detailText: {
    color: "#444",
    marginBottom: 5,
  },
  bookingButton: {
    marginTop: 12,
    backgroundColor: "#25D366",
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  bookingText: {
    color: "#fff",
    fontWeight: "900",
  },
});