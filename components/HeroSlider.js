import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";

import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView } from "moti";
import { router } from "expo-router";

const slides = [
  {
    image: require("../assets/images/desaa.jpeg"),
    title: "Wisata Gunungsari",
    desc: "Menjelajah budaya dan kearifan lokal desa",
  },
  {
    image: require("../assets/images/sari.jpeg"),
    title: "Pasar Pundensari",
    desc: "Nikmati kuliner tradisional dan suasana khas desa",
  },
];

export default function HeroSlider({ onExplorePress }) {
  const [index, setIndex] = useState(0);

  const item = slides[index];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const next = () => {
    setIndex((prev) => (prev + 1) % slides.length);
  };

  const prev = () => {
    setIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleExplorePress = () => {
    if (onExplorePress) {
      onExplorePress();
      return;
    }

    router.push("/wisata");
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={item.image}
        style={styles.image}
        imageStyle={styles.imageStyle}
      >
        <LinearGradient
          colors={[
            "rgba(0,0,0,0.24)",
            "rgba(0,0,0,0.34)",
            "rgba(0,0,0,0.76)",
          ]}
          locations={[0, 0.45, 1]}
          style={styles.overlay}
        >
          <MotiView
            key={index}
            from={{
              opacity: 0,
              translateY: 20,
            }}
            animate={{
              opacity: 1,
              translateY: 0,
            }}
            transition={{
              type: "timing",
              duration: 700,
            }}
            style={styles.content}
          >
            <Text style={styles.title} numberOfLines={2}>
              {item.title}
            </Text>

            <Text style={styles.desc} numberOfLines={3}>
              {item.desc}
            </Text>
          </MotiView>

          <View style={styles.bottomWrapper}>
            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.9}
              onPress={handleExplorePress}
            >
              <Text style={styles.buttonText}>Jelajahi Wisata</Text>

              <Feather name="arrow-right" size={18} color="#fff" />
            </TouchableOpacity>

            <View style={styles.bottom}>
              <View style={styles.dots}>
                {slides.map((_, i) => (
                  <TouchableOpacity
                    key={i}
                    activeOpacity={0.85}
                    onPress={() => setIndex(i)}
                    style={[
                      styles.dot,
                      index === i && styles.activeDot,
                    ]}
                  />
                ))}
              </View>

              <View style={styles.arrows}>
                <TouchableOpacity
                  style={styles.arrowButton}
                  activeOpacity={0.85}
                  onPress={prev}
                >
                  <Feather name="chevron-left" size={18} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.arrowButton}
                  activeOpacity={0.85}
                  onPress={next}
                >
                  <Feather name="chevron-right" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 690,
    overflow: "hidden",
    borderBottomLeftRadius: 42,
    borderBottomRightRadius: 42,
    backgroundColor: "#000",
  },

  image: {
    flex: 1,
  },

  imageStyle: {
    resizeMode: "cover",
  },

  overlay: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 140,
    paddingBottom: 34,
  },

  content: {
    width: "88%",
  },

  title: {
    color: "#F8F5F1",
    fontSize: 34,
    fontWeight: "900",
    lineHeight: 42,
    textShadowColor: "rgba(0,0,0,0.55)",
    textShadowOffset: {
      width: 0,
      height: 3,
    },
    textShadowRadius: 10,
  },

  desc: {
    color: "rgba(255,255,255,0.94)",
    fontSize: 15,
    lineHeight: 28,
    marginTop: 18,
    textShadowColor: "rgba(0,0,0,0.45)",
    textShadowOffset: {
      width: 0,
      height: 2,
    },
    textShadowRadius: 8,
  },

  bottomWrapper: {
    gap: 28,
  },

  button: {
    backgroundColor: "#C49A6C",
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 34,

    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  buttonText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 15,
  },

  bottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  dots: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.38)",
  },

  activeDot: {
    width: 24,
    backgroundColor: "#fff",
  },

  arrows: {
    flexDirection: "row",
    gap: 10,
  },

  arrowButton: {
    width: 44,
    height: 44,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
  },
});