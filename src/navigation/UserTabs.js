import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "../screens/HomeScreen";
import WisataScreen from "../screens/WisataScreen";
import PaketScreen from "../screens/PaketScreen";
import MapsScreen from "../screens/MapsScreen";
import ProfilScreen from "../screens/ProfilScreen";

const Tab = createBottomTabNavigator();

export default function UserTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#0A8FBF",
        tabBarInactiveTintColor: "#8E8E8E",
        tabBarStyle: {
          height: 64,
          paddingTop: 6,
          paddingBottom: 8,
          backgroundColor: "#FFFFFF",
          borderTopColor: "#EEEEEE",
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
        },
        tabBarIcon: ({ color, size }) => {
          let iconName = "home";

          if (route.name === "Home") iconName = "home";
          if (route.name === "Wisata") iconName = "map";
          if (route.name === "Paket") iconName = "ticket";
          if (route.name === "Maps") iconName = "navigate";
          if (route.name === "Profil") iconName = "person";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Wisata" component={WisataScreen} />
      <Tab.Screen name="Paket" component={PaketScreen} />
      <Tab.Screen name="Maps" component={MapsScreen} />
      <Tab.Screen name="Profil" component={ProfilScreen} />
    </Tab.Navigator>
  );
}