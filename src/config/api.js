export const API_URL = "http://192.168.43.17:8100";

export const getImageUrl = (url) => {
  if (!url) return null;

  const cleanUrl = String(url).trim();

  if (!cleanUrl) return null;

  if (cleanUrl.startsWith("http://") || cleanUrl.startsWith("https://")) {
    return cleanUrl;
  }

  if (cleanUrl.startsWith("/")) {
    return `${API_URL}${cleanUrl}`;
  }

  return `${API_URL}/${cleanUrl}`;
};