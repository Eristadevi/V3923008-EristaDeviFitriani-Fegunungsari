import React from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";
import HeroSlider from "../../components/HeroSlider";
import AboutSection from "../../components/AboutSection";
import ServiceSection from "../../components/ServiceSection";
import KnowledgeSection from "../../components/KnowledgeSection";
import FeatureSection from "../../components/FeatureSection";
import CategorySection from "../../components/CategorySection";
import BlogSection from "../../components/BlogSection";
import Footer from "../../components/Footer";

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView  showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        directionalLockEnabled={true} 
        >
        <Header />
        <HeroSlider />
        <AboutSection />
        <ServiceSection />
        <KnowledgeSection />
        <FeatureSection />
        <CategorySection />
        <BlogSection />
        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
}