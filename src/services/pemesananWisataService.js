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

  if (!response.ok) {
    throw data;
  }

  return data;
};

export const buatPemesananWisata = async (payload) => {
  const token = await getToken();

  const response = await fetch(`${API_URL}/api/pemesanan-wisata/buat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  return await parseResponse(response);
};

export const sinkronStatusPemesananWisata = async (kodePesanan) => {
  const token = await getToken();

  const response = await fetch(
    `${API_URL}/api/pemesanan-wisata/sinkron-status/${encodeURIComponent(
      kodePesanan
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

export const getDetailPemesananWisata = async (kodePesanan) => {
  const token = await getToken();

  const response = await fetch(
    `${API_URL}/api/pemesanan-wisata/status/${encodeURIComponent(kodePesanan)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return await parseResponse(response);
};

export const getRiwayatPemesananWisata = async () => {
  const token = await getToken();

  const response = await fetch(`${API_URL}/api/pemesanan-wisata/riwayat-saya`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await parseResponse(response);
};