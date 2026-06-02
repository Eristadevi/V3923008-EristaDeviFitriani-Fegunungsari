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
import { router } from "expo-router";
import { MotiView } from "moti";

const slides = [
  {
    image: require("../assets/images/hero1.jpeg"),

    title: "Wisata Gunungsari",

    desc: "Menjelajah budaya dan kearifan lokal desa",
  },

  {
    image: require("../assets/images/herooo2.jpeg"),

    title: "Pesona Alam Gunungsari",

    desc: "Nikmati suasana desa yang asri dan budaya tradisional",
  },
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) =>
        (prev + 1) % slides.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const next = () => {
    setIndex((prev) =>
      (prev + 1) % slides.length
    );
  };

  const prev = () => {
    setIndex((prev) =>
      prev === 0
        ? slides.length - 1
        : prev - 1
    );
  };

  const item = slides[index];

  return (
    <View style={styles.container}>
      <ImageBackground
        source={item.image}
        style={styles.image}
        imageStyle={styles.imageStyle}
      >
        {/* OVERLAY */}
        <LinearGradient
          colors={[
            "rgba(0,0,0,0.05)",
            "rgba(0,0,0,0.18)",
            "rgba(0,0,0,0.58)",
          ]}
          style={styles.overlay}
        >
          {/* CONTENT */}
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
            {/* SMALL TEXT */}
            <Text style={styles.smallText}>
              DESA WISATA
            </Text>

            {/* TITLE */}
            <Text style={styles.title}>
              {item.title}
            </Text>

            {/* DESC */}
            <Text style={styles.desc}>
              {item.desc}
            </Text>
          </MotiView>

          {/* BOTTOM */}
          <View style={styles.bottomWrapper}>
            {/* BUTTON */}
            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.9}
              onPress={() =>
                router.push("/wisata")
              }
            >
              <Text style={styles.buttonText}>
                Jelajahi Wisata
              </Text>

              <Feather
                name="arrow-right"
                size={18}
                color="#fff"
              />
            </TouchableOpacity>

            {/* DOTS + ARROWS */}
            <View style={styles.bottom}>
              {/* DOTS */}
              <View style={styles.dots}>
                {slides.map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.dot,
                      index === i &&
                        styles.activeDot,
                    ]}
                  />
                ))}
              </View>

              {/* ARROWS */}
              <View style={styles.arrows}>
                <TouchableOpacity
                  style={styles.arrowButton}
                  onPress={prev}
                >
                  <Feather
                    name="chevron-left"
                    size={18}
                    color="#fff"
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.arrowButton}
                  onPress={next}
                >
                  <Feather
                    name="chevron-right"
                    size={18}
                    color="#fff"
                  />
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
  /* CONTAINER */
  container: {
    height: 690,

    overflow: "hidden",

    borderBottomLeftRadius: 42,
    borderBottomRightRadius: 42,

    backgroundColor: "#000",
  },

  /* IMAGE */
  image: {
    flex: 1,
  },

  imageStyle: {
    resizeMode: "cover",
  },

  /* OVERLAY */
  overlay: {
    flex: 1,

    justifyContent: "space-between",

    paddingHorizontal: 24,
    paddingTop: 140,
    paddingBottom: 34,
  },

  /* CONTENT */
  content: {
    width: "88%",
  },

  /* SMALL */
  smallText: {
    color: "rgba(255,255,255,0.82)",

    fontSize: 11,

    fontWeight: "600",

    letterSpacing: 4,

    marginBottom: 16,
  },

  /* TITLE */
  title: {
    color: "#F8F5F1",

    fontSize: 34,

    fontWeight: "900",

    lineHeight: 42,

    textShadowColor:
      "rgba(0,0,0,0.35)",

    textShadowOffset: {
      width: 0,
      height: 3,
    },

    textShadowRadius: 8,
  },

  /* DESC */
  desc: {
    color: "rgba(255,255,255,0.92)",

    fontSize: 15,

    lineHeight: 28,

    marginTop: 18,

    textShadowColor:
      "rgba(0,0,0,0.30)",

    textShadowOffset: {
      width: 0,
      height: 2,
    },

    textShadowRadius: 6,
  },

  /* BOTTOM */
  bottomWrapper: {
    gap: 28,
  },

  /* BUTTON */
  button: {
    backgroundColor: "#C49A6C",

    alignSelf: "flex-start",

    flexDirection: "row",
    alignItems: "center",

    gap: 10,

    paddingVertical: 16,
    paddingHorizontal: 24,

    borderRadius: 34,
  },

  buttonText: {
    color: "#fff",

    fontWeight: "700",

    fontSize: 15,
  },

  /* DOT + ARROW */
  bottom: {
    flexDirection: "row",

    justifyContent: "space-between",
    alignItems: "center",
  },

  dots: {
    flexDirection: "row",

    gap: 8,
  },

  dot: {
    width: 8,
    height: 8,

    borderRadius: 10,

    backgroundColor:
      "rgba(255,255,255,0.35)",
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

    backgroundColor:
      "rgba(255,255,255,0.18)",
  },
});