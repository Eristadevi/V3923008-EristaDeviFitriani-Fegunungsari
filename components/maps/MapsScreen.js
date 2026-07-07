import React, { useEffect, useRef, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";

import { WebView } from "react-native-webview";
import * as Location from "expo-location";
import * as Speech from "expo-speech";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";

import { API_URL } from "../../src/config/api";
import { leafletHtml } from "./leafletHtml";
import { imageMap } from "./mapImages";
import { getRemainingDistanceKm } from "./mapUtils";

const API_BASE_URL = String(API_URL || "").replace(/\/$/, "");

export default function MapsScreen() {
  const webViewRef = useRef(null);
  const navigationWatcherRef = useRef(null);
  const lastFocusedKeyRef = useRef(null);

  const hasArrivedRef = useRef(false);
  const lastVoiceDistanceRef = useRef(null);
  const lastVoiceTimeRef = useRef(0);

  const params = useLocalSearchParams();

  const getParamValue = (value) => {
    if (Array.isArray(value)) return value[0];
    return value;
  };

  const paramIdRaw = getParamValue(params.id);
  const paramTitleRaw = getParamValue(params.title);
  const paramLatitudeRaw = getParamValue(params.latitude);
  const paramLongitudeRaw = getParamValue(params.longitude);
  const paramLocationRaw = getParamValue(params.location);

  const paramLatitude = paramLatitudeRaw ? Number(paramLatitudeRaw) : null;
  const paramLongitude = paramLongitudeRaw ? Number(paramLongitudeRaw) : null;
  const paramTitle = paramTitleRaw ? String(paramTitleRaw) : "Lokasi Wisata";
  const paramLocation = paramLocationRaw ? String(paramLocationRaw) : "";

  const hasFocusTarget =
    Number.isFinite(paramLatitude) && Number.isFinite(paramLongitude);

  const focusKey = hasFocusTarget
    ? `${paramLatitude}|${paramLongitude}|${paramTitle}`
    : "";

  const [mapReady, setMapReady] = useState(false);

  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showFilter, setShowFilter] = useState(false);

  const [loading, setLoading] = useState(true);
  const [routeLoading, setRouteLoading] = useState(false);

  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [routeInfo, setRouteInfo] = useState(null);
  const [routeDestination, setRouteDestination] = useState(null);

  const [isNavigating, setIsNavigating] = useState(false);
  const [remainingDistance, setRemainingDistance] = useState(null);

  const [gpsAccuracy, setGpsAccuracy] = useState(null);
  const [lastGpsUpdate, setLastGpsUpdate] = useState(null);

  const normalizePlace = (item) => {
    return {
      id: item?.id,
      title: item?.title || "",
      description: item?.description || "",
      type: item?.type || "wisata",
      latitude: Number(item?.latitude),
      longitude: Number(item?.longitude),
      imageKey: item?.imageKey || item?.image_key || null,
      isActive: item?.isActive ?? item?.is_active ?? true,
    };
  };

  const isValidCoordinate = (place) => {
    return (
      place &&
      Number.isFinite(Number(place.latitude)) &&
      Number.isFinite(Number(place.longitude))
    );
  };

  const isSameAsFocusTarget = (place) => {
    if (!hasFocusTarget || !isValidCoordinate(place)) return false;

    return (
      Math.abs(Number(place.latitude) - Number(paramLatitude)) < 0.00001 &&
      Math.abs(Number(place.longitude) - Number(paramLongitude)) < 0.00001
    );
  };

  const filteredPlaces = places.filter((place) => {
    const title = place.title || "";
    const type = place.type || "";

    const matchSearch = title.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" ? true : type === filter;

    return matchSearch && matchFilter;
  });

  const runMapScript = (script) => {
    if (!webViewRef.current) return;
    webViewRef.current.injectJavaScript(script + "; true;");
  };

  const sendPlacesToMap = (data) => {
    runMapScript("window.setPlaces(" + JSON.stringify(data) + ")");
  };

  const focusPlaceOnMap = (place) => {
    if (!isValidCoordinate(place)) return;

    const payload = {
      id: place.id,
      title: place.title || "Lokasi Wisata",
      description: place.description || "",
      type: place.type || "wisata",
      latitude: Number(place.latitude),
      longitude: Number(place.longitude),
      imageKey: place.imageKey || null,
      isActive: place.isActive ?? true,
    };

    runMapScript(
      "window.focusPlaceFromApp(" + JSON.stringify(payload) + ")"
    );
  };

  const getPlaceFromParams = () => {
    if (!hasFocusTarget) return null;

    const matchedPlace = places.find((place) => {
      const sameCoordinate =
        Math.abs(Number(place.latitude) - Number(paramLatitude)) < 0.00001 &&
        Math.abs(Number(place.longitude) - Number(paramLongitude)) < 0.00001;

      const sameTitle =
        String(place.title || "").toLowerCase() ===
        String(paramTitle || "").toLowerCase();

      return sameCoordinate || sameTitle;
    });

    if (matchedPlace) {
      return matchedPlace;
    }

    return {
      id: paramIdRaw || "selected-location",
      title: paramTitle,
      description: paramLocation || "Lokasi wisata Desa Gunungsari.",
      type: "wisata",
      latitude: paramLatitude,
      longitude: paramLongitude,
      imageKey: null,
      isActive: true,
    };
  };

  const speakNavigation = (text) => {
    Speech.stop();

    Speech.speak(text, {
      language: "id-ID",
      pitch: 1,
      rate: 0.9,
    });
  };

  const formatDistanceVoice = (distance) => {
    if (distance < 1) {
      const meters = Math.round(distance * 1000);
      return `${meters} meter`;
    }

    const distanceText = Number(distance).toFixed(2).replace(".", ",");
    return `${distanceText} kilometer`;
  };

  const formatDistanceText = (distance) => {
    const value = Number(distance || 0);

    if (value < 1) {
      return `${Math.round(value * 1000)} m`;
    }

    return `${value.toFixed(2)} km`;
  };

  const getCategoryLabel = (item) => {
    if (item === "all") return "Semua";
    if (item === "wisata") return "Wisata";
    if (item === "kuliner") return "Kuliner";
    if (item === "penginapan") return "Penginapan";
    return item;
  };

  const fetchDestinations = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/api/maps/destinations`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        Alert.alert("Gagal", result.message || "Gagal mengambil data maps.");
        return;
      }

      const normalizedData = (result.data || []).map(normalizePlace);
      setPlaces(normalizedData);

      if (mapReady) {
        sendPlacesToMap(normalizedData);
      }
    } catch (error) {
      console.log("MAPS DESTINATION ERROR:", error);
      Alert.alert(
        "Error",
        "Tidak dapat mengambil data destinasi maps. Pastikan backend aktif dan API_URL sudah benar."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetRouteStateOnly = () => {
    setRouteCoordinates([]);
    setRouteInfo(null);
    setRouteDestination(null);
    setRemainingDistance(null);
    setGpsAccuracy(null);
    setLastGpsUpdate(null);
  };

  const stopSimpleNavigation = ({ stopVoice = true } = {}) => {
    if (navigationWatcherRef.current) {
      navigationWatcherRef.current.remove();
      navigationWatcherRef.current = null;
    }

    if (stopVoice) {
      Speech.stop();
    }

    lastVoiceDistanceRef.current = null;
    lastVoiceTimeRef.current = 0;

    setIsNavigating(false);
    setGpsAccuracy(null);
    setLastGpsUpdate(null);

    runMapScript("window.stopNavigationMode()");
  };

  const resetRouteOnly = () => {
    stopSimpleNavigation();

    setRouteCoordinates([]);
    setRouteInfo(null);
    setRouteDestination(null);
    setRemainingDistance(null);
    setGpsAccuracy(null);
    setLastGpsUpdate(null);

    runMapScript("window.clearRoute()");
  };

  const clearRoute = () => {
    stopSimpleNavigation();

    setSelectedPlace(null);
    setRouteCoordinates([]);
    setRouteInfo(null);
    setRouteDestination(null);
    setRemainingDistance(null);
    setGpsAccuracy(null);
    setLastGpsUpdate(null);

    runMapScript("window.clearRoute()");
    sendPlacesToMap(filteredPlaces);
  };

  const showRouteInApp = async (place) => {
    if (!place) {
      Alert.alert("Pilih lokasi", "Silakan pilih destinasi terlebih dahulu.");
      return;
    }

    try {
      setRouteLoading(true);

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Izin lokasi ditolak",
          "Aktifkan izin lokasi agar aplikasi bisa menampilkan rute."
        );
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      const currentPoint = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };

      const response = await fetch(`${API_BASE_URL}/api/maps/route-detail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originLatitude: currentPoint.latitude,
          originLongitude: currentPoint.longitude,
          destinationId: place.id,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        Alert.alert("Gagal", result.message || "Gagal membuat rute.");
        return;
      }

      const coordinates = result.data?.route?.coordinates || [];
      const destination = normalizePlace(result.data?.destination || place);
      const distanceKm = result.data?.route?.distanceKm || 0;
      const durationMinutes = result.data?.route?.durationMinutes || 0;

      setRouteCoordinates(coordinates);
      setRouteInfo({
        distanceKm,
        durationMinutes,
      });

      setRemainingDistance(distanceKm);
      setRouteDestination(destination);
      setSelectedPlace(null);
      setShowFilter(false);

      runMapScript(
        "window.showRoute(" +
          JSON.stringify({
            coordinates,
            origin: currentPoint,
            destination: {
              latitude: Number(destination.latitude),
              longitude: Number(destination.longitude),
              title: destination.title,
            },
            distanceKm,
          }) +
          ")"
      );
    } catch (error) {
      console.log("ROUTE DETAIL ERROR:", error);
      Alert.alert("Error", "Gagal menampilkan rute di aplikasi.");
    } finally {
      setRouteLoading(false);
    }
  };

  const startSimpleNavigation = async () => {
    if (routeCoordinates.length === 0 || !routeDestination) {
      Alert.alert(
        "Rute belum tersedia",
        "Tampilkan rute terlebih dahulu sebelum mulai navigasi."
      );
      return;
    }

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Izin lokasi ditolak",
          "Aktifkan izin lokasi agar navigasi bisa berjalan."
        );
        return;
      }

      stopSimpleNavigation();

      hasArrivedRef.current = false;
      lastVoiceDistanceRef.current = null;
      lastVoiceTimeRef.current = 0;

      setIsNavigating(true);
      setShowFilter(false);

      runMapScript("window.startNavigationMode()");

      speakNavigation(
        `Navigasi dimulai menuju ${routeDestination.title}. Ikuti garis rute sampai tujuan.`
      );

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      const currentPoint = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };

      setGpsAccuracy(
        currentLocation.coords.accuracy
          ? Math.round(currentLocation.coords.accuracy)
          : null
      );
      setLastGpsUpdate(new Date().toLocaleTimeString("id-ID"));

      runMapScript(
        "window.updateUserLocation(" + JSON.stringify(currentPoint) + ")"
      );

      const watcher = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Highest,
          timeInterval: 2000,
          distanceInterval: 3,
        },
        (location) => {
          const point = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          };

          setGpsAccuracy(
            location.coords.accuracy
              ? Math.round(location.coords.accuracy)
              : null
          );
          setLastGpsUpdate(new Date().toLocaleTimeString("id-ID"));

          const remaining = getRemainingDistanceKm(point, routeCoordinates);
          setRemainingDistance(remaining);

          const now = Date.now();
          const lastVoiceDistance = lastVoiceDistanceRef.current;
          const lastVoiceTime = lastVoiceTimeRef.current;

          const shouldSpeakDistance =
            now - lastVoiceTime > 30000 &&
            (lastVoiceDistance === null ||
              Math.abs(lastVoiceDistance - remaining) >= 0.2);

          if (shouldSpeakDistance && remaining > 0.05) {
            lastVoiceDistanceRef.current = remaining;
            lastVoiceTimeRef.current = now;

            speakNavigation(
              `Sisa jarak sekitar ${formatDistanceVoice(remaining)}.`
            );
          }

          runMapScript(
            "window.updateUserLocation(" + JSON.stringify(point) + ")"
          );

          if (remaining <= 0.05 && !hasArrivedRef.current) {
            hasArrivedRef.current = true;

            speakNavigation(
              `Anda sudah dekat dengan lokasi ${routeDestination.title}.`
            );

            stopSimpleNavigation({
              stopVoice: false,
            });

            Alert.alert(
              "Sudah dekat",
              "Anda sudah berada sangat dekat dengan lokasi tujuan."
            );
          }
        }
      );

      navigationWatcherRef.current = watcher;
    } catch (error) {
      console.log("NAVIGATION ERROR:", error);
      setIsNavigating(false);
      setGpsAccuracy(null);
      setLastGpsUpdate(null);
      Speech.stop();
      runMapScript("window.stopNavigationMode()");
      Alert.alert("Error", "Gagal memulai navigasi sederhana.");
    }
  };

  const getImageSource = (imageKey) => {
    if (!imageKey) {
      return imageMap.about;
    }

    if (imageMap[imageKey]) {
      return imageMap[imageKey];
    }

    if (String(imageKey).startsWith("http")) {
      return {
        uri: imageKey,
      };
    }

    return {
      uri: `${API_BASE_URL}/uploads/${imageKey}`,
    };
  };

  const getPlaceImageKey = (place) => {
    return place?.imageKey || place?.image_key || null;
  };

  const handleWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      if (data.type === "mapReady") {
        setMapReady(true);
        return;
      }

      if (data.type === "selectPlace") {
        const place = normalizePlace(data.place);

        setSelectedPlace(place);

        if (isSameAsFocusTarget(place)) {
          resetRouteStateOnly();
        } else {
          resetRouteOnly();
        }
      }
    } catch (error) {
      console.log("WEBVIEW MESSAGE ERROR:", error);
    }
  };

  useEffect(() => {
    fetchDestinations();

    return () => {
      if (navigationWatcherRef.current) {
        navigationWatcherRef.current.remove();
        navigationWatcherRef.current = null;
      }

      Speech.stop();
    };
  }, []);

  useEffect(() => {
    if (mapReady) {
      sendPlacesToMap(filteredPlaces);
    }
  }, [mapReady, places, search, filter]);

  useEffect(() => {
    if (!mapReady || !hasFocusTarget) return;

    if (lastFocusedKeyRef.current === focusKey) return;

    const targetPlace = getPlaceFromParams();

    if (!targetPlace) return;

    lastFocusedKeyRef.current = focusKey;

    setSearch("");
    setFilter("all");
    setShowFilter(false);
    setSelectedPlace(targetPlace);
    resetRouteStateOnly();

    setTimeout(() => {
      focusPlaceOnMap(targetPlace);
    }, 700);
  }, [mapReady, places, focusKey]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#B58B63" />
        <Text style={styles.loadingText}>Memuat data maps...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        originWhitelist={["*"]}
        source={{ html: leafletHtml }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onMessage={handleWebViewMessage}
        style={styles.webview}
      />

      {!isNavigating && (
        <View style={styles.searchWrapper}>
          <Feather name="search" size={20} color="#777" />

          <TextInput
            placeholder="Cari wisata, kuliner, penginapan..."
            placeholderTextColor="#999"
            style={styles.input}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      )}

      {!isNavigating && (
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilter(!showFilter)}
        >
          <Feather name="sliders" size={20} color="#222" />
        </TouchableOpacity>
      )}

      {showFilter && !isNavigating && (
        <View style={styles.filterPanel}>
          <View style={styles.filterHeader}>
            <Text style={styles.filterTitle}>Filter Destinasi</Text>

            <TouchableOpacity onPress={() => setShowFilter(false)}>
              <Feather name="x" size={22} color="#222" />
            </TouchableOpacity>
          </View>

          <TextInput
            placeholder="Cari lokasi..."
            placeholderTextColor="#999"
            style={styles.filterInput}
            value={search}
            onChangeText={setSearch}
          />

          <Text style={styles.categoryTitle}>Pilih Kategori</Text>

          <View style={styles.categoryWrapper}>
            {["all", "wisata", "kuliner", "penginapan"].map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.categoryButton,
                  filter === item && styles.categoryButtonActive,
                ]}
                onPress={() => setFilter(item)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    filter === item && styles.categoryTextActive,
                  ]}
                >
                  {getCategoryLabel(item)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {isNavigating && routeDestination && (
        <View style={styles.navigationTopPanel}>
          <View style={styles.directionRow}>
            <Feather name="navigation" size={34} color="#fff" />

            <View style={styles.directionTextBox}>
              <Text style={styles.directionTitle}>Menuju lokasi</Text>

              <Text style={styles.directionSubtitle} numberOfLines={1}>
                {routeDestination.title}
              </Text>
            </View>
          </View>

          <View style={styles.nextDirectionBox}>
            <Text style={styles.nextDirectionText}>
              Ikuti garis rute sampai tujuan
            </Text>
          </View>
        </View>
      )}

      {selectedPlace && !isNavigating && (
        <View style={styles.bottomCard}>
          <TouchableOpacity style={styles.closeButton} onPress={clearRoute}>
            <Feather name="x" size={20} color="#222" />
          </TouchableOpacity>

          <Image
            source={getImageSource(getPlaceImageKey(selectedPlace))}
            style={styles.image}
            resizeMode="cover"
          />

          <View style={styles.content}>
            <Text style={styles.type}>
              {getCategoryLabel(selectedPlace.type)}
            </Text>

            <Text style={styles.title} numberOfLines={1}>
              {selectedPlace.title}
            </Text>

            <Text style={styles.desc} numberOfLines={2}>
              {selectedPlace.description || "Belum ada deskripsi."}
            </Text>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[
                  styles.routeButton,
                  routeLoading && styles.routeButtonDisabled,
                ]}
                onPress={() => showRouteInApp(selectedPlace)}
                disabled={routeLoading}
              >
                {routeLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.routeText}>Tampilkan Rute</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {routeInfo && routeDestination && !selectedPlace && (
        <View
          style={isNavigating ? styles.navigationBottomBar : styles.routeMiniCard}
        >
          <View style={styles.routeMiniLeft}>
            {!isNavigating && (
              <Text style={styles.routeMiniTitle} numberOfLines={1}>
                Rute ke {routeDestination.title}
              </Text>
            )}

            <Text
              style={
                isNavigating
                  ? styles.navigationDistanceText
                  : styles.routeMiniText
              }
            >
              {formatDistanceText(
                remainingDistance !== null
                  ? remainingDistance
                  : routeInfo.distanceKm
              )}
            </Text>

            <Text
              style={
                isNavigating
                  ? styles.navigationEstimateText
                  : styles.routeMiniSmallText
              }
            >
              Estimasi {routeInfo.durationMinutes} menit
            </Text>

            {isNavigating && (
              <>
                <Text style={styles.navigationStatus}>Navigasi aktif</Text>

                <Text style={styles.gpsInfoText}>
                  GPS aktif
                  {gpsAccuracy !== null ? ` • akurasi ${gpsAccuracy} m` : ""}
                  {lastGpsUpdate ? ` • update ${lastGpsUpdate}` : ""}
                </Text>
              </>
            )}
          </View>

          <View style={styles.routeMiniActions}>
            {!isNavigating ? (
              <TouchableOpacity
                style={styles.startNavButton}
                onPress={startSimpleNavigation}
              >
                <Text style={styles.startNavText}>Mulai</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.stopNavButton}
                onPress={() => stopSimpleNavigation()}
              >
                <Text style={styles.stopNavText}>Stop</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.clearRouteButton}
              onPress={clearRoute}
            >
              <Text style={styles.clearRouteText}>Hapus</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {places.length === 0 && (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>Belum ada data destinasi maps.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  webview: {
    flex: 1,
    backgroundColor: "#fff",
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: "#666",
    fontWeight: "700",
  },

  searchWrapper: {
    position: "absolute",
    top: 70,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    height: 58,
    elevation: 5,
  },

  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: "#222",
  },

  filterButton: {
    position: "absolute",
    top: 140,
    right: 20,
    width: 54,
    height: 54,
    borderRadius: 30,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },

  filterPanel: {
    position: "absolute",
    top: 140,
    right: 20,
    width: 290,
    backgroundColor: "#fff",
    borderRadius: 26,
    padding: 22,
    elevation: 10,
  },

  filterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 22,
  },

  filterTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#222",
  },

  filterInput: {
    height: 56,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 15,
    marginBottom: 24,
  },

  categoryTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
    marginBottom: 16,
  },

  categoryWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  categoryButton: {
    backgroundColor: "#F5F5F5",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 14,
  },

  categoryButtonActive: {
    backgroundColor: "#B58B63",
  },

  categoryText: {
    color: "#222",
    fontWeight: "700",
  },

  categoryTextActive: {
    color: "#fff",
  },

  bottomCard: {
    position: "absolute",
    bottom: 82,
    left: 14,
    right: 14,
    backgroundColor: "#fff",
    borderRadius: 26,
    overflow: "hidden",
    elevation: 10,
  },

  closeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 99,
    width: 34,
    height: 34,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },

  image: {
    width: "100%",
    height: 190,
    backgroundColor: "#f3f4f6",
  },

  content: {
    padding: 16,
  },

  type: {
    fontSize: 13,
    color: "#B58B63",
    fontWeight: "700",
    marginBottom: 6,
    textTransform: "capitalize",
  },

  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#222",
    marginBottom: 6,
  },

  desc: {
    fontSize: 14,
    lineHeight: 20,
    color: "#666",
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 14,
  },

  routeButton: {
    backgroundColor: "#B58B63",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 14,
    minWidth: 150,
    alignItems: "center",
  },

  routeButtonDisabled: {
    opacity: 0.7,
  },

  routeText: {
    color: "#fff",
    fontWeight: "700",
  },

  routeMiniCard: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 90,
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    elevation: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  routeMiniLeft: {
    flex: 1,
    marginRight: 12,
  },

  routeMiniTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: "#222",
  },

  routeMiniText: {
    marginTop: 4,
    fontSize: 17,
    fontWeight: "900",
    color: "#2563EB",
  },

  routeMiniSmallText: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: "800",
    color: "#666",
  },

  routeMiniActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  startNavButton: {
    backgroundColor: "#16A34A",
    paddingVertical: 9,
    paddingHorizontal: 13,
    borderRadius: 12,
  },

  startNavText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "900",
  },

  stopNavButton: {
    backgroundColor: "#F59E0B",
    paddingVertical: 9,
    paddingHorizontal: 13,
    borderRadius: 12,
  },

  stopNavText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "900",
  },

  clearRouteButton: {
    backgroundColor: "#EF4444",
    paddingVertical: 9,
    paddingHorizontal: 13,
    borderRadius: 12,
  },

  clearRouteText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "900",
  },

  navigationTopPanel: {
    position: "absolute",
    top: 28,
    left: 10,
    right: 10,
    backgroundColor: "#006B65",
    borderRadius: 14,
    overflow: "hidden",
    elevation: 10,
  },

  directionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 18,
    paddingVertical: 18,
  },

  directionTextBox: {
    flex: 1,
  },

  directionTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "900",
  },

  directionSubtitle: {
    marginTop: 3,
    color: "#D1FAE5",
    fontSize: 13,
    fontWeight: "700",
  },

  nextDirectionBox: {
    backgroundColor: "#005A55",
    paddingHorizontal: 18,
    paddingVertical: 10,
  },

  nextDirectionText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },

  navigationBottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 82,
    backgroundColor: "#050505",
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 18,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    elevation: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  navigationDistanceText: {
    fontSize: 27,
    fontWeight: "900",
    color: "#86EFAC",
  },

  navigationEstimateText: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: "700",
    color: "#BDBDBD",
  },

  navigationStatus: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "800",
    color: "#16A34A",
  },

  gpsInfoText: {
    marginTop: 3,
    fontSize: 11,
    fontWeight: "700",
    color: "#A7F3D0",
  },

  emptyBox: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 100,
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 20,
    elevation: 5,
  },

  emptyText: {
    textAlign: "center",
    color: "#666",
    fontWeight: "700",
  },
});