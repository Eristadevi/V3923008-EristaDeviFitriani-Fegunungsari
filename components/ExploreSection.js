import React, { useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Modal,
  ScrollView,
} from "react-native";

import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

const exploreItems = [
  {
    icon: "award",
    image: require("../assets/images/hero1.jpeg"),
    title: "Desa Digital",
    category: "PRESTASI DESA",
    desc: "Peraih Juara 1 kategori Desa Digital pada ajang ADWI 2024.",
    detail:
      "Desa Wisata Gunungsari dikenal sebagai desa wisata yang mengembangkan konsep digital dalam pengelolaan wisata. Digitalisasi digunakan untuk memperkuat informasi wisata, promosi desa, agenda budaya, dan kemudahan akses layanan bagi wisatawan.",
    points: [
      "Juara 1 kategori Desa Digital ADWI 2024",
      "Pengembangan informasi wisata berbasis digital",
      "Menggabungkan teknologi dengan budaya lokal",
    ],
  },
  {
    icon: "music",
    image: require("../assets/images/herooo2.jpeg"),
    title: "Budaya & Seni",
    category: "KEARIFAN LOKAL",
    desc: "Festival budaya, seni tradisional, dan pengenalan aksara Jawa.",
    detail:
      "Gunungsari mengangkat kebudayaan dan kearifan lokal sebagai daya tarik utama. Wisatawan dapat mengenal seni tradisional, kegiatan budaya, aksara Jawa, dan nilai-nilai lokal masyarakat desa.",
    points: [
      "Pertunjukan seni tradisional",
      "Festival budaya bulanan",
      "Workshop atau pengenalan aksara Jawa",
    ],
  },
  {
    icon: "book-open",
    image: require("../assets/images/hero1.jpeg"),
    title: "Wisata Edukasi",
    category: "EDUKASI DESA",
    desc: "Belajar kebun kopi, budidaya padi, dan pengelolaan magot BSF.",
    detail:
      "Wisata edukasi Gunungsari cocok untuk pelajar, komunitas, maupun keluarga. Pengunjung dapat belajar langsung tentang aktivitas desa, pertanian, kebun kopi, budidaya padi, dan pengelolaan lingkungan berbasis masyarakat.",
    points: [
      "Edukasi kebun kopi lokal",
      "Budidaya padi",
      "Pengenalan magot BSF",
    ],
  },
  {
    icon: "coffee",
    image: require("../assets/images/herooo2.jpeg"),
    title: "Kuliner Lokal",
    category: "UMKM & KULINER",
    desc: "Makanan lokal, festival kuliner, dan produk UMKM desa.",
    detail:
      "Kuliner lokal menjadi bagian dari pengalaman wisata Gunungsari. Wisatawan dapat mengenal cita rasa desa, produk UMKM, serta kegiatan festival kuliner yang mengangkat potensi masyarakat.",
    points: [
      "Festival makanan lokal",
      "Produk UMKM masyarakat",
      "Pengalaman kuliner khas desa",
    ],
  },
  {
    icon: "home",
    image: require("../assets/images/hero1.jpeg"),
    title: "Live In Desa",
    category: "PENGALAMAN DESA",
    desc: "Pengalaman hidup bersama masyarakat desa secara langsung.",
    detail:
      "Program live in memberikan kesempatan kepada pengunjung untuk merasakan kehidupan desa secara lebih dekat. Wisatawan dapat berinteraksi dengan warga dan mengikuti aktivitas masyarakat lokal.",
    points: [
      "Tinggal dan berinteraksi dengan masyarakat",
      "Mengikuti aktivitas desa",
      "Mengenal kehidupan lokal secara langsung",
    ],
  },
  {
    icon: "feather",
    image: require("../assets/images/herooo2.jpeg"),
    title: "Pariwisata Hijau",
    category: "WISATA BERKELANJUTAN",
    desc: "Wisata berbasis alam, budaya, dan keberlanjutan lingkungan.",
    detail:
      "Desa Wisata Gunungsari mengusung semangat pariwisata hijau dengan menjaga keseimbangan antara pengembangan wisata, pelestarian lingkungan, budaya lokal, dan pemberdayaan masyarakat.",
    points: [
      "Suasana desa yang asri",
      "Konsep wisata berkelanjutan",
      "Melibatkan masyarakat lokal",
    ],
  },
];

export default function ExploreSection({ onClose }) {
  const [selectedItem, setSelectedItem] = useState(null);

  const previewItems = exploreItems.slice(0, 4);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <Text style={styles.label}>
            JELAJAHI WISATA
          </Text>

          <Text style={styles.title}>
            Kenali Desa Wisata Gunungsari
          </Text>
        </View>

        <TouchableOpacity
          style={styles.closeButton}
          activeOpacity={0.8}
          onPress={onClose}
        >
          <Feather
            name="x"
            size={20}
            color="#1F2937"
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.description}>
        Desa Wisata Gunungsari berada di Kecamatan Madiun, Kabupaten
        Madiun, Jawa Timur. Desa ini mengusung wisata budaya, edukasi,
        kuliner lokal, pengalaman hidup di desa, serta pariwisata hijau
        yang berpadu dengan digitalisasi.
      </Text>

      <ImageBackground
        source={require("../assets/images/hero1.jpeg")}
        style={styles.featuredImage}
        imageStyle={styles.featuredImageStyle}
      >
        <LinearGradient
          colors={[
            "rgba(0,0,0,0.05)",
            "rgba(0,0,0,0.25)",
            "rgba(0,0,0,0.72)",
          ]}
          style={styles.featuredOverlay}
        >
          <View style={styles.badge}>
            <Feather
              name="award"
              size={14}
              color="#fff"
            />

            <Text style={styles.badgeText}>
              ADWI 2024
            </Text>
          </View>

          <Text style={styles.featuredTitle}>
            Desa Digital Berbasis Budaya Lokal
          </Text>

          <Text style={styles.featuredDesc}>
            Gunungsari memadukan teknologi, budaya, edukasi, kuliner,
            dan pelestarian lingkungan dalam pengalaman wisata desa.
          </Text>
        </LinearGradient>
      </ImageBackground>

      <View style={styles.infoBox}>
        <View style={styles.infoItem}>
          <Text style={styles.infoNumber}>
            12 KM
          </Text>

          <Text style={styles.infoLabel}>
            dari Kota Madiun
          </Text>
        </View>

        <View style={styles.infoDivider} />

        <View style={styles.infoItem}>
          <Text style={styles.infoNumber}>
            6
          </Text>

          <Text style={styles.infoLabel}>
            daya tarik
          </Text>
        </View>

        <View style={styles.infoDivider} />

        <View style={styles.infoItem}>
          <Text style={styles.infoNumber}>
            2024
          </Text>

          <Text style={styles.infoLabel}>
            Desa Digital
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>
        Daya Tarik Utama
      </Text>

      <View style={styles.grid}>
        {previewItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            activeOpacity={0.88}
            onPress={() => setSelectedItem(item)}
          >
            <ImageBackground
              source={item.image}
              style={styles.cardImage}
              imageStyle={styles.cardImageStyle}
            >
              <LinearGradient
                colors={[
                  "rgba(0,0,0,0.02)",
                  "rgba(0,0,0,0.30)",
                  "rgba(0,0,0,0.76)",
                ]}
                style={styles.cardOverlay}
              >
                <View style={styles.cardIconBox}>
                  <Feather
                    name={item.icon}
                    size={18}
                    color="#fff"
                  />
                </View>

                <Text style={styles.cardCategory}>
                  {item.category}
                </Text>

                <Text style={styles.cardTitle}>
                  {item.title}
                </Text>

                <Text style={styles.cardDesc}>
                  {item.desc}
                </Text>

                <View style={styles.cardFooter}>
                  <Text style={styles.cardDetailText}>
                    Lihat Detail
                  </Text>

                  <Feather
                    name="chevron-right"
                    size={17}
                    color="#fff"
                  />
                </View>
              </LinearGradient>
            </ImageBackground>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.mainButton}
        activeOpacity={0.88}
        onPress={() => router.push("/paket")}
      >
        <Text style={styles.mainButtonText}>
          Lihat Paket Wisata
        </Text>

        <Feather
          name="arrow-right"
          size={18}
          color="#fff"
        />
      </TouchableOpacity>

      <Modal
        visible={selectedItem !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedItem(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <TouchableOpacity
              style={styles.modalClose}
              activeOpacity={0.8}
              onPress={() => setSelectedItem(null)}
            >
              <Feather
                name="x"
                size={20}
                color="#1F2937"
              />
            </TouchableOpacity>

            {selectedItem && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <ImageBackground
                  source={selectedItem.image}
                  style={styles.modalImage}
                  imageStyle={styles.modalImageStyle}
                >
                  <LinearGradient
                    colors={[
                      "rgba(0,0,0,0.05)",
                      "rgba(0,0,0,0.30)",
                      "rgba(0,0,0,0.75)",
                    ]}
                    style={styles.modalImageOverlay}
                  >
                    <View style={styles.modalIconBox}>
                      <Feather
                        name={selectedItem.icon}
                        size={22}
                        color="#fff"
                      />
                    </View>

                    <Text style={styles.modalCategory}>
                      {selectedItem.category}
                    </Text>

                    <Text style={styles.modalTitle}>
                      {selectedItem.title}
                    </Text>
                  </LinearGradient>
                </ImageBackground>

                <Text style={styles.modalDesc}>
                  {selectedItem.detail}
                </Text>

                <View style={styles.pointBox}>
                  <Text style={styles.pointTitle}>
                    Daya Tarik Utama
                  </Text>

                  {selectedItem.points.map((point, index) => (
                    <View key={index} style={styles.pointRow}>
                      <Feather
                        name="check-circle"
                        size={17}
                        color="#0E7490"
                      />

                      <Text style={styles.pointText}>
                        {point}
                      </Text>
                    </View>
                  ))}
                </View>

                <TouchableOpacity
                  style={styles.modalButton}
                  activeOpacity={0.88}
                  onPress={() => {
                    setSelectedItem(null);
                    router.push("/paket");
                  }}
                >
                  <Text style={styles.modalButtonText}>
                    Lihat Paket Terkait
                  </Text>

                  <Feather
                    name="arrow-right"
                    size={18}
                    color="#fff"
                  />
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 22,
    paddingTop: 36,
    paddingBottom: 70,
    backgroundColor: "#F8F5F1",
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 14,
    marginBottom: 14,
  },

  headerText: {
    flex: 1,
  },

  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 2,
  },

  label: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 3,
    color: "#0E7490",
    marginBottom: 10,
  },

  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#1F2937",
    lineHeight: 34,
  },

  description: {
    fontSize: 15,
    lineHeight: 25,
    color: "#5B5B5B",
    marginBottom: 22,
  },

  featuredImage: {
    height: 240,
    borderRadius: 28,
    overflow: "hidden",
    marginBottom: 18,
    backgroundColor: "#000",
  },

  featuredImageStyle: {
    resizeMode: "cover",
  },

  featuredOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 20,
  },

  badge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.22)",
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 18,
    marginBottom: 12,
  },

  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
  },

  featuredTitle: {
    color: "#fff",
    fontSize: 23,
    fontWeight: "900",
    lineHeight: 30,
    marginBottom: 8,
  },

  featuredDesc: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 14,
    lineHeight: 22,
  },

  infoBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    elevation: 2,
  },

  infoItem: {
    flex: 1,
    alignItems: "center",
  },

  infoNumber: {
    fontSize: 17,
    fontWeight: "900",
    color: "#0E7490",
    marginBottom: 4,
  },

  infoLabel: {
    fontSize: 11,
    color: "#666",
    textAlign: "center",
  },

  infoDivider: {
    width: 1,
    height: 34,
    backgroundColor: "#E5E7EB",
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#1F2937",
    marginBottom: 14,
  },

  grid: {
    gap: 16,
  },

  card: {
    height: 185,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#000",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    elevation: 3,
  },

  cardImage: {
    flex: 1,
  },

  cardImageStyle: {
    resizeMode: "cover",
  },

  cardOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 16,
  },

  cardIconBox: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.22)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  cardCategory: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.5,
    marginBottom: 5,
  },

  cardTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 5,
  },

  cardDesc: {
    color: "rgba(255,255,255,0.90)",
    fontSize: 13,
    lineHeight: 19,
  },

  cardFooter: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  cardDetailText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "900",
  },

  mainButton: {
    marginTop: 24,
    backgroundColor: "#0E7490",
    paddingVertical: 16,
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 9,
  },

  mainButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },

  modalBox: {
    maxHeight: "88%",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 34,
  },

  modalClose: {
    alignSelf: "flex-end",
    width: 38,
    height: 38,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  modalImage: {
    height: 250,
    borderRadius: 28,
    overflow: "hidden",
    marginBottom: 18,
    backgroundColor: "#000",
  },

  modalImageStyle: {
    resizeMode: "cover",
  },

  modalImageOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 20,
  },

  modalIconBox: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.22)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  modalCategory: {
    color: "rgba(255,255,255,0.82)",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.5,
    marginBottom: 7,
  },

  modalTitle: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "900",
    lineHeight: 34,
  },

  modalDesc: {
    fontSize: 15,
    lineHeight: 25,
    color: "#555",
    marginBottom: 18,
  },

  pointBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 18,
  },

  pointTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#1F2937",
    marginBottom: 12,
  },

  pointRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 9,
    marginBottom: 10,
  },

  pointText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 21,
    color: "#555",
  },

  modalButton: {
    backgroundColor: "#0E7490",
    paddingVertical: 15,
    borderRadius: 18,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  modalButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "900",
  },
});