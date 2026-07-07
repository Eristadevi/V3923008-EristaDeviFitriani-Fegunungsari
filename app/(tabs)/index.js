import React from "react";

import {
  ScrollView,
  StyleSheet,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import Header from "../../components/Header";
import HeroSlider from "../../components/HeroSlider";
import BlogSection from "../../components/BlogSection";
import AboutSection from "../../components/AboutSection";
import ServiceSection from "../../components/ServiceSection";
import Footer from "../../components/Footer";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        directionalLockEnabled={true}
        contentContainerStyle={styles.scrollContent}
      >
        <Header />

        <HeroSlider onExplorePress={() => router.push("/wisata")} />

        <BlogSection />

        <AboutSection />

        <ServiceSection />

        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F5F0",
  },

  scrollContent: {
    paddingBottom: 100,
  },
});