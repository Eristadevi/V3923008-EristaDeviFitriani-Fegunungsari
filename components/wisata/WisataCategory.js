import React, {
  useState,
} from "react";

import {
  View,
  Text,
  StyleSheet,
} from "react-native";

import DropDownPicker from "react-native-dropdown-picker";

export default function WisataCategory() {
  const [open, setOpen] =
    useState(false);

  const [value, setValue] =
    useState(null);

  const [items, setItems] =
    useState([
      {
        label: "Wisata Alam",
        value: "alam",
      },

      {
        label: "Wisata Buatan",
        value: "buatan",
      },

      {
        label: "Wisata Budaya",
        value: "budaya",
      },

      {
        label: "Kuliner",
        value: "kuliner",
      },

      {
        label: "Edukasi",
        value: "edukasi",
      },
    ]);

  return (
    <View style={styles.container}>
      {/* TITLE */}
      <Text style={styles.label}>
        Jenis Destinasi
      </Text>

      {/* DROPDOWN */}
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        placeholder="Pilih Jenis Destinasi"
        style={styles.dropdown}
        dropDownContainerStyle={
          styles.dropdownContainer
        }
        textStyle={styles.text}
        placeholderStyle={
          styles.placeholder
        }
        listMode="SCROLLVIEW"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,

    paddingTop: 30,

    zIndex: 1000,
  },

  /* LABEL */
  label: {
    fontSize: 20,

    fontWeight: "700",

    color: "#222",

    marginBottom: 18,
  },

  /* DROPDOWN */
  dropdown: {
    minHeight: 65,

    borderColor: "#E5E5E5",

    borderRadius: 16,

    paddingHorizontal: 12,
  },

  dropdownContainer: {
    borderColor: "#E5E5E5",

    borderRadius: 16,
  },

  text: {
    fontSize: 17,

    color: "#222",
  },

  placeholder: {
    color: "#999",

    fontSize: 17,
  },
});