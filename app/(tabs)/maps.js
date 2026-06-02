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
import { Feather } from "@expo/vector-icons";
import { API_URL } from "../../src/config/api";

const imageMap = {
  pundensari: require("../../assets/images/about.jpeg"),
  "purabaya-museum": require("../../assets/images/hero1.jpg"),
  "desa-gunungsari": require("../../assets/images/hero2.jpeg"),
  about: require("../../assets/images/about.jpeg"),
  hero1: require("../../assets/images/hero1.jpg"),
  hero2: require("../../assets/images/hero2.jpeg"),
};

const getDistanceKm = (pointA, pointB) => {
  const R = 6371;

  const dLat = ((pointB.latitude - pointA.latitude) * Math.PI) / 180;
  const dLng = ((pointB.longitude - pointA.longitude) * Math.PI) / 180;

  const lat1 = (pointA.latitude * Math.PI) / 180;
  const lat2 = (pointB.latitude * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) *
      Math.sin(dLng / 2) *
      Math.cos(lat1) *
      Math.cos(lat2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

const getRemainingDistanceKm = (currentPoint, routeCoordinates) => {
  if (!currentPoint || routeCoordinates.length === 0) {
    return 0;
  }

  let nearestIndex = 0;
  let nearestDistance = Infinity;

  routeCoordinates.forEach((point, index) => {
    const distance = getDistanceKm(currentPoint, point);

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestIndex = index;
    }
  });

  let remaining = getDistanceKm(currentPoint, routeCoordinates[nearestIndex]);

  for (let i = nearestIndex; i < routeCoordinates.length - 1; i++) {
    remaining += getDistanceKm(routeCoordinates[i], routeCoordinates[i + 1]);
  }

  return Number(remaining.toFixed(2));
};

const leafletHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

  <style>
    html, body, #map {
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
      overflow: hidden;
      background: #0B2D36;
    }

    .leaflet-control-attribution {
      font-size: 9px !important;
      background: rgba(255,255,255,0.65) !important;
    }

    body.navigating .leaflet-tile-pane {
      filter: brightness(0.5) contrast(1.25) saturate(0.8);
    }

    .marker-pin {
      width: 30px;
      height: 30px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      background: #B58B63;
      border: 3px solid white;
      box-shadow: 0 3px 8px rgba(0,0,0,0.35);
    }

    .marker-pin-inner {
      width: 10px;
      height: 10px;
      background: white;
      border-radius: 50%;
      margin: 7px;
    }

    .user-dot {
      width: 22px;
      height: 22px;
      background: #2563EB;
      border-radius: 50%;
      border: 4px solid #fff;
      box-shadow: 0 0 0 10px rgba(37,99,235,0.25);
    }

    .flag-marker {
      font-size: 34px;
      filter: drop-shadow(0px 3px 4px rgba(0,0,0,0.35));
    }
  </style>
</head>

<body>
  <div id="map"></div>

  <script>
    const map = L.map("map", {
      zoomControl: false,
      attributionControl: true
    }).setView([-7.5749827, 111.5438491], 14);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap"
    }).addTo(map);

    const markerGroup = L.layerGroup().addTo(map);
    const routeGroup = L.layerGroup().addTo(map);

    let userMarker = null;
    let isNavigating = false;

    const sendToReactNative = (data) => {
      window.ReactNativeWebView.postMessage(JSON.stringify(data));
    };

    const createMarkerIcon = (color) => {
      return L.divIcon({
        className: "",
        html:
          '<div class="marker-pin" style="background:' + color + '">' +
          '<div class="marker-pin-inner"></div>' +
          '</div>',
        iconSize: [34, 34],
        iconAnchor: [17, 34]
      });
    };

    const createUserIcon = () => {
      return L.divIcon({
        className: "",
        html: '<div class="user-dot"></div>',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
    };

    const createFlagIcon = () => {
      return L.divIcon({
        className: "",
        html: '<div class="flag-marker">🚩</div>',
        iconSize: [40, 40],
        iconAnchor: [20, 38]
      });
    };

    const getMarkerColor = (type) => {
      if (type === "kuliner") return "#E67E22";
      if (type === "penginapan") return "#3498DB";
      return "#B58B63";
    };

    window.setPlaces = function(places) {
      if (isNavigating) return;

      markerGroup.clearLayers();

      const bounds = [];

      places.forEach((place) => {
        const lat = Number(place.latitude);
        const lng = Number(place.longitude);

        if (isNaN(lat) || isNaN(lng)) return;

        bounds.push([lat, lng]);

        const marker = L.marker(
          [lat, lng],
          { icon: createMarkerIcon(getMarkerColor(place.type)) }
        ).addTo(markerGroup);

        marker.on("click", function() {
          sendToReactNative({
            type: "selectPlace",
            place: place
          });
        });
      });

      if (bounds.length === 1) {
        map.setView(bounds[0], 16, {
          animate: true
        });
      }

      if (bounds.length > 1) {
        map.fitBounds(bounds, {
          paddingTopLeft: [50, 120],
          paddingBottomRight: [50, 120]
        });
      }
    };

    window.showRoute = function(data) {
      routeGroup.clearLayers();

      const coordinates = data.coordinates || [];

      if (coordinates.length === 0) return;

      const latlngs = coordinates.map((item) => [
        item.latitude,
        item.longitude
      ]);

      L.polyline(latlngs, {
        color: "#003B5C",
        weight: 10,
        opacity: 0.9,
        lineCap: "round",
        lineJoin: "round"
      }).addTo(routeGroup);

      const routeLine = L.polyline(latlngs, {
        color: "#00D9FF",
        weight: 6,
        opacity: 1,
        lineCap: "round",
        lineJoin: "round"
      }).addTo(routeGroup);

      if (data.origin) {
        userMarker = L.marker(
          [data.origin.latitude, data.origin.longitude],
          { icon: createUserIcon() }
        ).addTo(routeGroup);
      }

      if (data.destination) {
        L.marker(
          [data.destination.latitude, data.destination.longitude],
          { icon: createFlagIcon() }
        ).addTo(routeGroup);
      }

      map.fitBounds(routeLine.getBounds(), {
        paddingTopLeft: [60, 120],
        paddingBottomRight: [60, 170]
      });
    };

    window.startNavigationMode = function() {
      isNavigating = true;
      document.body.classList.add("navigating");
      markerGroup.clearLayers();

      setTimeout(function() {
        map.invalidateSize();
      }, 200);
    };

    window.stopNavigationMode = function() {
      isNavigating = false;
      document.body.classList.remove("navigating");

      setTimeout(function() {
        map.invalidateSize();
      }, 200);
    };

    window.clearRoute = function() {
      isNavigating = false;
      document.body.classList.remove("navigating");
      routeGroup.clearLayers();
      userMarker = null;
    };

    window.updateUserLocation = function(point) {
      if (!point) return;

      if (!userMarker) {
        userMarker = L.marker(
          [point.latitude, point.longitude],
          { icon: createUserIcon() }
        ).addTo(routeGroup);
      } else {
        userMarker.setLatLng([point.latitude, point.longitude]);
      }

      if (isNavigating) {
        map.setView([point.latitude, point.longitude], 17, {
          animate: true
        });
      }
    };

    sendToReactNative({ type: "mapReady" });
  </script>
</body>
</html>
`;

export default function MapsScreen() {
  const webViewRef = useRef(null);
  const navigationWatcherRef = useRef(null);

  const [mapReady, setMapReady] = useState(false);

  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showFilter, setShowFilter] = useState(false);

  const [loading, setLoading] = useState(true);
  const [routeLoading, setRouteLoading] = useState(false);

  const [userLocation, setUserLocation] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [routeInfo, setRouteInfo] = useState(null);
  const [routeDestination, setRouteDestination] = useState(null);

  const [isNavigating, setIsNavigating] = useState(false);
  const [remainingDistance, setRemainingDistance] = useState(null);

  const filteredPlaces = places.filter((place) => {
    const title = place.title || "";
    const matchSearch = title.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" ? true : place.type === filter;

    return matchSearch && matchFilter;
  });

  const runMapScript = (script) => {
    if (!webViewRef.current) return;

    webViewRef.current.injectJavaScript(script + "; true;");
  };

  const sendPlacesToMap = (data) => {
    runMapScript("window.setPlaces(" + JSON.stringify(data) + ")");
  };

  const fetchDestinations = async () => {
    try {
      setLoading(true);

      const response = await fetch(API_URL + "/api/maps/destinations");
      const result = await response.json();

      if (!result.success) {
        Alert.alert("Gagal", result.message || "Gagal mengambil data maps.");
        return;
      }

      setPlaces(result.data || []);
    } catch (error) {
      console.log("MAPS DESTINATION ERROR:", error);
      Alert.alert("Error", "Tidak dapat mengambil data destinasi maps.");
    } finally {
      setLoading(false);
    }
  };

  const stopSimpleNavigation = () => {
    if (navigationWatcherRef.current) {
      navigationWatcherRef.current.remove();
      navigationWatcherRef.current = null;
    }

    setIsNavigating(false);
    runMapScript("window.stopNavigationMode()");
  };

  const resetRouteOnly = () => {
    stopSimpleNavigation();

    setRouteCoordinates([]);
    setRouteInfo(null);
    setRouteDestination(null);
    setUserLocation(null);
    setRemainingDistance(null);

    runMapScript("window.clearRoute()");
  };

  const clearRoute = () => {
    stopSimpleNavigation();

    setSelectedPlace(null);
    setRouteCoordinates([]);
    setRouteInfo(null);
    setRouteDestination(null);
    setUserLocation(null);
    setRemainingDistance(null);

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

      setUserLocation(currentPoint);

      const response = await fetch(API_URL + "/api/maps/route-detail", {
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

      if (!result.success) {
        Alert.alert("Gagal", result.message || "Gagal membuat rute.");
        return;
      }

      const coordinates = result.data.route.coordinates || [];
      const destination = result.data.destination || place;

      setRouteCoordinates(coordinates);

      setRouteInfo({
        distanceKm: result.data.route.distanceKm,
        durationMinutes: result.data.route.durationMinutes,
      });

      setRemainingDistance(result.data.route.distanceKm);
      setRouteDestination(destination);
      setSelectedPlace(null);

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

      setIsNavigating(true);
      runMapScript("window.startNavigationMode()");

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
      });

      const currentPoint = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };

      setUserLocation(currentPoint);

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

          setUserLocation(point);

          const remaining = getRemainingDistanceKm(point, routeCoordinates);
          setRemainingDistance(remaining);

          runMapScript(
            "window.updateUserLocation(" + JSON.stringify(point) + ")"
          );

          if (remaining <= 0.05) {
            stopSimpleNavigation();

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
      runMapScript("window.stopNavigationMode()");
      Alert.alert("Error", "Gagal memulai navigasi sederhana.");
    }
  };

  const getImageSource = (imageKey) => {
    return imageMap[imageKey] || imageMap.about;
  };

  const handleWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      if (data.type === "mapReady") {
        setMapReady(true);
        return;
      }

      if (data.type === "selectPlace") {
        setSelectedPlace(data.place);
        resetRouteOnly();
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
      }
    };
  }, []);

  useEffect(() => {
    if (mapReady) {
      sendPlacesToMap(filteredPlaces);
    }
  }, [mapReady, places, search, filter]);

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
            placeholder="Cari wisata, kuliner..."
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
            placeholder="Cari wisata..."
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
                  {item}
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
            source={getImageSource(selectedPlace.imageKey)}
            style={styles.image}
          />

          <View style={styles.content}>
            <Text style={styles.type}>{selectedPlace.type}</Text>

            <Text style={styles.title} numberOfLines={1}>
              {selectedPlace.title}
            </Text>

            <Text style={styles.desc} numberOfLines={2}>
              {selectedPlace.description}
            </Text>

            <View style={styles.buttonRow}>
              <TouchableOpacity>
                <Text style={styles.detailText}>Lihat Detail</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.routeButton}
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
              {remainingDistance !== null
                ? remainingDistance
                : routeInfo.distanceKm}{" "}
              km
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
              <Text style={styles.navigationStatus}>Navigasi aktif</Text>
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
                onPress={stopSimpleNavigation}
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
    textTransform: "capitalize",
  },

  categoryTextActive: {
    color: "#fff",
  },

  bottomCard: {
    position: "absolute",
    bottom: 82,
    left: 20,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: 24,
    overflow: "hidden",
    elevation: 8,
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
    height: 95,
  },

  content: {
    padding: 14,
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
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
  },

  detailText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2563EB",
  },

  routeButton: {
    backgroundColor: "#B58B63",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    minWidth: 130,
    alignItems: "center",
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