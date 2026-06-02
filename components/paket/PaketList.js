import { View, StyleSheet } from "react-native";
import PaketCard from "./PaketCard";

const data = [
  {
    title: "Pasar Pundensari",
    type: "Kuliner & Budaya",
    price: "Mulai dari Rp 10.000",
    desc: "Pasar tradisional setiap Minggu pukul 06.00–11.00 WIB dengan koin bambu dan jajanan jadul.",
    duration: "Minggu, 06.00–11.00 WIB",
  },
  {
    title: "Edukasi Budaya Jawa A",
    type: "1 Day Tour",
    price: "Rp 155.000 / orang",
    desc: "Paket satu hari untuk mengenal budaya Jawa di Desa Wisata Gunungsari.",
    duration: "1 Hari",
  },
  {
    title: "Edukasi Budaya Jawa B",
    type: "Live In 1 Night",
    price: "Rp 259.000 / orang",
    desc: "Menginap satu malam untuk merasakan kehidupan desa dan kebudayaan setempat.",
    duration: "2 Hari 1 Malam",
  },
  {
    title: "Edukasi Budaya Jawa C",
    type: "Live In 2 Night",
    price: "Rp 650.000 / orang",
    desc: "Menginap dua malam untuk pengalaman budaya yang lebih mendalam.",
    duration: "3 Hari 2 Malam",
  },
  {
    title: "Edukasi Manuskrip Aksara Jawa",
    type: "Edukasi Budaya",
    price: "Menyesuaikan paket",
    desc: "Belajar mengenal manuskrip, aksara Jawa, dan media lontar.",
    duration: "Menyesuaikan",
  },
  {
    title: "Budidaya Bibit Padi",
    type: "Edukasi Pertanian",
    price: "Menyesuaikan paket",
    desc: "Edukasi proses budidaya bibit padi dan aktivitas pertanian lokal.",
    duration: "Menyesuaikan",
  },
  {
    title: "Budidaya Merpati Kontes",
    type: "Edukasi & Hobi",
    price: "Menyesuaikan paket",
    desc: "Mengenal budidaya merpati kontes sebagai potensi lokal masyarakat.",
    duration: "Menyesuaikan",
  },
  {
    title: "Atraksi Udeng Jawa",
    type: "Atraksi Budaya",
    price: "Menyesuaikan paket",
    desc: "Belajar memakai udeng atau ikat kepala khas Jawa.",
    duration: "Menyesuaikan",
  },
  {
    title: "Meeting Room / Gathering",
    type: "Acara Kelompok",
    price: "Mulai dari Rp 45.000",
    desc: "Paket untuk pertemuan, komunitas, gathering, atau kegiatan kelompok.",
    duration: "Menyesuaikan",
  },
];

export default function PaketList() {
  return (
    <View style={styles.container}>
      {data.map((item, index) => (
        <PaketCard key={index} {...item} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 18,
  },
});