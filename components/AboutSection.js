import React, { useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";

import { Feather } from "@expo/vector-icons";
import { MotiView } from "moti";
import { LinearGradient } from "expo-linear-gradient";

export default function AboutSection() {
  const [showDetail, setShowDetail] = useState(false);

  const toggleDetail = () => {
    setShowDetail((prev) => !prev);
  };

  return (
    <View style={styles.container}>
      <MotiView
        from={{
          opacity: 0,
          translateY: 24,
        }}
        animate={{
          opacity: 1,
          translateY: 0,
        }}
        transition={{
          type: "timing",
          duration: 850,
        }}
        style={styles.header}
      >
        <View style={styles.kickerBox}>
          <Feather name="map-pin" size={14} color="#8B5E34" />
          <Text style={styles.kicker}>TENTANG DESA</Text>
        </View>

        <Text style={styles.heading}>
          Mengenal Desa Wisata{"\n"}Gunungsari
        </Text>

        <Text style={styles.subheading}>
          Desa wisata budaya yang menghadirkan pengalaman lokal, tradisi Jawa,
          kuliner desa, dan suasana pedesaan yang autentik.
        </Text>
      </MotiView>

      <MotiView
        from={{
          opacity: 0,
          scale: 0.96,
          translateY: 22,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          translateY: 0,
        }}
        transition={{
          type: "timing",
          duration: 950,
          delay: 180,
        }}
        style={styles.card}
      >
        <TouchableOpacity activeOpacity={0.9} onPress={toggleDetail}>
          <ImageBackground
            source={require("../assets/images/about.jpeg")}
            style={styles.image}
            imageStyle={styles.imageStyle}
          >
            <LinearGradient
              colors={[
                "rgba(0,0,0,0.04)",
                "rgba(0,0,0,0.28)",
                "rgba(0,0,0,0.72)",
              ]}
              style={styles.imageOverlay}
            >
              <View style={styles.imageBadge}>
                <Feather name="star" size={14} color="#FFFFFF" />
                <Text style={styles.imageBadgeText}>Desa Wisata Budaya</Text>
              </View>

              <Text style={styles.imageTitle}>Gunungsari</Text>

              <Text style={styles.imageDesc}>
                Budaya, tradisi, kuliner, dan kehidupan desa dalam satu
                pengalaman wisata.
              </Text>
            </LinearGradient>
          </ImageBackground>
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={styles.desc}>
            Desa Gunungsari merupakan desa wisata budaya berbasis kearifan lokal
            Jawa di Kabupaten Madiun. Desa ini menghadirkan pengalaman wisata
            yang dekat dengan kehidupan masyarakat, mulai dari tradisi lokal,
            kuliner desa, festival budaya, hingga aktivitas edukasi yang dapat
            dinikmati oleh wisatawan.
          </Text>

          <View style={styles.highlightGrid}>
            <View style={styles.highlightItem}>
              <View style={styles.iconBox}>
                <Feather name="users" size={18} color="#8B5E34" />
              </View>

              <View style={styles.highlightTextBox}>
                <Text style={styles.highlightTitle}>Budaya Lokal</Text>
                <Text style={styles.highlightText}>
                  Mengenal tradisi masyarakat desa.
                </Text>
              </View>
            </View>

            <View style={styles.highlightItem}>
              <View style={styles.iconBox}>
                <Feather name="coffee" size={18} color="#8B5E34" />
              </View>

              <View style={styles.highlightTextBox}>
                <Text style={styles.highlightTitle}>Kuliner Desa</Text>
                <Text style={styles.highlightText}>
                  Menikmati jajanan dan produk UMKM.
                </Text>
              </View>
            </View>

            <View style={styles.highlightItem}>
              <View style={styles.iconBox}>
                <Feather name="calendar" size={18} color="#8B5E34" />
              </View>

              <View style={styles.highlightTextBox}>
                <Text style={styles.highlightTitle}>Event Budaya</Text>
                <Text style={styles.highlightText}>
                  Agenda desa dan kegiatan wisata.
                </Text>
              </View>
            </View>
          </View>

          {showDetail && (
            <MotiView
              from={{
                opacity: 0,
                translateY: 14,
              }}
              animate={{
                opacity: 1,
                translateY: 0,
              }}
              transition={{
                type: "timing",
                duration: 450,
              }}
              style={styles.detailBox}
            >
              <Text style={styles.detailTitle}>Keunikan Desa Gunungsari</Text>

              <Text style={styles.detailText}>
                Gunungsari menawarkan pengalaman wisata yang tidak hanya
                menampilkan tempat, tetapi juga menghadirkan interaksi langsung
                dengan masyarakat desa. Wisatawan dapat menikmati suasana desa,
                mengenal potensi lokal, mengikuti kegiatan budaya, serta
                menjelajahi berbagai layanan wisata seperti Pasar Pundensari,
                Museum Purabaya, dan edukasi Batik DemunG.
              </Text>
            </MotiView>
          )}

          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.9}
            onPress={toggleDetail}
          >
            <Text style={styles.buttonText}>
              {showDetail ? "Tutup Detail" : "Tentang Desa"}
            </Text>

            <View style={styles.buttonIcon}>
              <Feather
                name={showDetail ? "chevron-up" : "arrow-right"}
                size={18}
                color="#8B5E34"
              />
            </View>
          </TouchableOpacity>
        </View>
      </MotiView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    paddingTop: 58,
    paddingBottom: 70,
    paddingHorizontal: 22,
  },

  header: {
    alignItems: "center",
    marginBottom: 28,
  },

  kickerBox: {
    backgroundColor: "#F5E9DC",
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginBottom: 16,
  },

  kicker: {
    color: "#8B5E34",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.8,
  },

  heading: {
    color: "#1F2937",
    fontSize: 31,
    fontWeight: "900",
    lineHeight: 40,
    textAlign: "center",
    marginBottom: 13,
  },

  subheading: {
    color: "#666666",
    fontSize: 15,
    lineHeight: 24,
    textAlign: "center",
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 32,
    overflow: "hidden",

    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.09,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 8,
    },
  },

  image: {
    height: 270,
    backgroundColor: "#000",
  },

  imageStyle: {
    resizeMode: "cover",
  },

  imageOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 22,
  },

  imageBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.22)",
    borderRadius: 22,
    paddingVertical: 8,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginBottom: 13,
  },

  imageBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
  },

  imageTitle: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "900",
    marginBottom: 8,
  },

  imageDesc: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 14,
    lineHeight: 22,
  },

  content: {
    padding: 22,
  },

  desc: {
    color: "#555555",
    fontSize: 15,
    lineHeight: 27,
    textAlign: "justify",
    marginBottom: 20,
  },

  highlightGrid: {
    gap: 12,
    marginBottom: 22,
  },

  highlightItem: {
    backgroundColor: "#F8F5F1",
    borderRadius: 20,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 16,
    backgroundColor: "#F5E9DC",
    justifyContent: "center",
    alignItems: "center",
  },

  highlightTextBox: {
    flex: 1,
  },

  highlightTitle: {
    color: "#1F2937",
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 4,
  },

  highlightText: {
    color: "#666666",
    fontSize: 13,
    lineHeight: 19,
  },

  detailBox: {
    backgroundColor: "#FFF7ED",
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F5E9DC",
    marginBottom: 22,
  },

  detailTitle: {
    color: "#8B5E34",
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 8,
  },

  detailText: {
    color: "#555555",
    fontSize: 14,
    lineHeight: 25,
    textAlign: "justify",
  },

  button: {
    backgroundColor: "#8B5E34",
    borderRadius: 26,
    paddingVertical: 15,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },

  buttonIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
});