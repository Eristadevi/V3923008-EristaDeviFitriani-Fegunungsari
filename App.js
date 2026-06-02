import React, { useEffect, useState } from "react";
import { ActivityIndicator, View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import UserTabs from "./src/navigation/UserTabs";

const Stack = createNativeStackNavigator();

function AdminDashboard() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#f8f5f0",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: "900" }}>
        Dashboard Admin
      </Text>
    </View>
  );
}

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);

  const checkLogin = async () => {
    const token = await AsyncStorage.getItem("token");
    const savedUser = await AsyncStorage.getItem("user");

    if (token && savedUser) {
      const user = JSON.parse(savedUser);

      if (user.role === "admin") {
        setInitialRoute("AdminDashboard");
      } else {
        setInitialRoute("UserTabs");
      }
    } else {
      setInitialRoute("Login");
    }
  };

  useEffect(() => {
    checkLogin();
  }, []);

  if (!initialRoute) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#67b56f" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="UserTabs"
          component={UserTabs}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="AdminDashboard"
          component={AdminDashboard}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}