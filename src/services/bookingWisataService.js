import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../config/api";

const getToken = async () => {
  const token = await AsyncStorage.getItem("token");

  if (!token) {
    throw {
      message: "Token tidak ditemukan. Silakan login ulang.",
    };
  }

  return token;
};

const parseResponse = async (response) => {
  const text = await response.text();

  if (!text) {
    if (!response.ok) {
      throw {
        message: "Backend tidak memberikan response.",
      };
    }

    return {
      success: true,
      message: "Berhasil.",
      data: null,
    };
  }

  if (text.startsWith("<")) {
    throw {
      message:
        "Backend mengembalikan HTML, bukan JSON. Kemungkinan endpoint salah atau belum dibuat.",
      detail: text.slice(0, 150),
    };
  }

  let data;

  try {
    data = JSON.parse(text);
  } catch (error) {
    throw {
      message: "Response backend tidak valid.",
      detail: text,
    };
  }

  if (!response.ok || data.success === false) {
    throw data;
  }

  return data;
};

export const buatBookingWisata = async (payload) => {
  const token = await getToken();

  const response = await fetch(`${API_URL}/api/booking-wisata`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  return await parseResponse(response);
};

export const getRiwayatBookingWisata = async () => {
  const token = await getToken();

  const response = await fetch(`${API_URL}/api/booking-wisata/riwayat-saya`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await parseResponse(response);
};

export const getRiwayatBookingWisataSaya = async () => {
  return await getRiwayatBookingWisata();
};

export const getDetailBookingWisata = async (kodeBooking) => {
  const token = await getToken();

  const response = await fetch(
    `${API_URL}/api/booking-wisata/${encodeURIComponent(kodeBooking)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return await parseResponse(response);
};

export const sinkronStatusBookingWisata = async (kodeBooking) => {
  const token = await getToken();

  const response = await fetch(
    `${API_URL}/api/booking-wisata/sinkron-status/${encodeURIComponent(
      kodeBooking
    )}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return await parseResponse(response);
};