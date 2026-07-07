export const leafletHtml = `
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

    .selected-marker-pin {
      width: 38px;
      height: 38px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      background: #2E7D32;
      border: 4px solid white;
      box-shadow: 0 0 0 8px rgba(46,125,50,0.20), 0 6px 14px rgba(0,0,0,0.38);
    }

    .selected-marker-inner {
      width: 12px;
      height: 12px;
      background: white;
      border-radius: 50%;
      margin: 9px;
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

    .leaflet-tooltip.destination-tooltip {
      background: rgba(255, 255, 255, 0.98);
      color: #1f2937;
      border: 1px solid rgba(0,0,0,0.15);
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.25);
      padding: 6px 9px;
      font-size: 12px;
      font-weight: 900;
      line-height: 1.2;
      max-width: 145px;
      white-space: normal;
      text-align: center;
    }

    .leaflet-tooltip.destination-tooltip:before {
      display: none;
    }

    .leaflet-tooltip.destination-tooltip-active {
      background: #006B65;
      color: #FFFFFF;
      border: 1px solid rgba(255,255,255,0.75);
      font-size: 13px;
      padding: 7px 10px;
      max-width: 170px;
    }

    .route-name-label {
      background: rgba(0, 0, 0, 0.82);
      color: #FFFFFF;
      border-radius: 14px;
      padding: 8px 10px;
      width: 170px;
      text-align: center;
      font-size: 12px;
      line-height: 1.25;
      box-shadow: 0 4px 12px rgba(0,0,0,0.35);
      border: 1px solid rgba(255,255,255,0.25);
    }

    .route-name-label strong {
      display: block;
      margin-top: 2px;
      font-size: 13px;
      color: #86EFAC;
    }

    .route-name-distance {
      margin-top: 3px;
      color: #E5E7EB;
      font-size: 11px;
      font-weight: 700;
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

    window.map = map;
    window.L = L;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap"
    }).addTo(map);

    const markerGroup = L.layerGroup().addTo(map);
    const routeGroup = L.layerGroup().addTo(map);
    const selectedGroup = L.layerGroup().addTo(map);

    let userMarker = null;
    let isNavigating = false;
    let latestPlaces = [];

    const sendToReactNative = (data) => {
      if (!window.ReactNativeWebView) return;
      window.ReactNativeWebView.postMessage(JSON.stringify(data));
    };

    const escapeHtml = (value) => {
      return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
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

    const createSelectedMarkerIcon = () => {
      return L.divIcon({
        className: "",
        html:
          '<div class="selected-marker-pin">' +
          '<div class="selected-marker-inner"></div>' +
          '</div>',
        iconSize: [44, 44],
        iconAnchor: [22, 44]
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

    const createRouteNameIcon = (title, distanceKm) => {
      const safeTitle = escapeHtml(title || "Lokasi tujuan");
      const hasDistance =
        distanceKm !== undefined &&
        distanceKm !== null &&
        distanceKm !== "";

      const distanceHtml = hasDistance
        ? '<div class="route-name-distance">' + escapeHtml(distanceKm) + ' km</div>'
        : '';

      return L.divIcon({
        className: "",
        html:
          '<div class="route-name-label">' +
          '<div>Rute ke</div>' +
          '<strong>' + safeTitle + '</strong>' +
          distanceHtml +
          '</div>',
        iconSize: [170, 65],
        iconAnchor: [85, 32]
      });
    };

    const getMarkerColor = (type) => {
      if (type === "kuliner") return "#E67E22";
      if (type === "penginapan") return "#3498DB";
      return "#B58B63";
    };

    const normalizePlace = (place) => {
      return {
        id: place && place.id !== undefined ? place.id : null,
        title: place && place.title ? place.title : "Lokasi Wisata",
        description: place && place.description ? place.description : "",
        type: place && place.type ? place.type : "wisata",
        latitude: Number(place && place.latitude),
        longitude: Number(place && place.longitude),
        imageKey: place && place.imageKey ? place.imageKey : null,
        isActive: place && place.isActive !== undefined ? place.isActive : true
      };
    };

    const isValidCoordinate = (place) => {
      return (
        place &&
        !isNaN(Number(place.latitude)) &&
        !isNaN(Number(place.longitude))
      );
    };

    window.setPlaces = function(places) {
      if (isNavigating) return;

      latestPlaces = Array.isArray(places) ? places : [];

      markerGroup.clearLayers();

      const bounds = [];

      latestPlaces.forEach((rawPlace) => {
        const place = normalizePlace(rawPlace);

        if (!isValidCoordinate(place)) return;

        const lat = Number(place.latitude);
        const lng = Number(place.longitude);

        bounds.push([lat, lng]);

        const marker = L.marker(
          [lat, lng],
          { icon: createMarkerIcon(getMarkerColor(place.type)) }
        ).addTo(markerGroup);

        marker.bindTooltip(escapeHtml(place.title || "Lokasi"), {
          permanent: true,
          direction: "bottom",
          offset: [0, 8],
          opacity: 1,
          className: "destination-tooltip"
        });

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
          paddingTopLeft: [50, 135],
          paddingBottomRight: [50, 135]
        });
      }

      setTimeout(function() {
        map.invalidateSize();
      }, 250);
    };

    window.focusPlaceFromApp = function(rawPlace) {
      const place = normalizePlace(rawPlace);

      if (!isValidCoordinate(place)) return;

      const lat = Number(place.latitude);
      const lng = Number(place.longitude);

      selectedGroup.clearLayers();

      map.setView([lat, lng], 18, {
        animate: true
      });

      const selectedMarker = L.marker(
        [lat, lng],
        { icon: createSelectedMarkerIcon() }
      ).addTo(selectedGroup);

      selectedMarker.bindTooltip(escapeHtml(place.title || "Lokasi Wisata"), {
        permanent: true,
        direction: "top",
        offset: [0, -38],
        opacity: 1,
        className: "destination-tooltip destination-tooltip-active"
      });

      selectedMarker.bindPopup(
        "<b>" +
          escapeHtml(place.title || "Lokasi Wisata") +
          "</b><br/>" +
          escapeHtml(place.description || "")
      ).openPopup();

      sendToReactNative({
        type: "selectPlace",
        place: place
      });

      setTimeout(function() {
        map.invalidateSize();
        map.panTo([lat, lng], {
          animate: true
        });
      }, 300);
    };

    window.showRoute = function(data) {
      routeGroup.clearLayers();
      selectedGroup.clearLayers();

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
        const destinationMarker = L.marker(
          [data.destination.latitude, data.destination.longitude],
          { icon: createFlagIcon() }
        ).addTo(routeGroup);

        destinationMarker.bindTooltip(
          "Tujuan: " + escapeHtml(data.destination.title || "Lokasi tujuan"),
          {
            permanent: true,
            direction: "top",
            offset: [0, -34],
            opacity: 1,
            className: "destination-tooltip destination-tooltip-active"
          }
        );
      }

      if (latlngs.length > 0 && data.destination) {
        const middleIndex = Math.floor(latlngs.length / 2);
        const middlePoint = latlngs[middleIndex];

        L.marker(middlePoint, {
          icon: createRouteNameIcon(
            data.destination.title || "Lokasi tujuan",
            data.distanceKm
          ),
          interactive: false
        }).addTo(routeGroup);
      }

      map.fitBounds(routeLine.getBounds(), {
        paddingTopLeft: [60, 130],
        paddingBottomRight: [60, 185]
      });
    };

    window.startNavigationMode = function() {
      isNavigating = true;
      document.body.classList.add("navigating");
      markerGroup.clearLayers();
      selectedGroup.clearLayers();

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
      selectedGroup.clearLayers();
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

    setTimeout(function() {
      map.invalidateSize();

      sendToReactNative({
        type: "mapReady"
      });
    }, 350);
  </script>
</body>
</html>
`;