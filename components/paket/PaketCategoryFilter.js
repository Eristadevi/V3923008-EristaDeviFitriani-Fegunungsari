import React from "react";
import {
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { COLORS } from "./paketTheme";

export default function PaketCategoryFilter({
  categories,
  activeCategory,
  onChangeCategory,
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.categoryList}
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category}
          activeOpacity={0.85}
          style={[
            styles.categoryButton,
            activeCategory === category &&
              styles.categoryButtonActive,
          ]}
          onPress={() => onChangeCategory(category)}
        >
          <Text
            style={[
              styles.categoryText,
              activeCategory === category &&
                styles.categoryTextActive,
            ]}
          >
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  categoryList: {
    gap: 10,
    paddingBottom: 18,
  },

  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  categoryButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  categoryText: {
    fontSize: 13,
    fontWeight: "800",
    color: COLORS.subtext,
  },

  categoryTextActive: {
    color: COLORS.white,
  },
});