export const wisataData = [
  {
    id: 1,
    title: "Pasar Pundensari",
    category: "Kuliner",
    description:
      "Pasar wisata budaya khas Desa Gunungsari yang menyajikan kuliner tradisional, suasana pedesaan, dan sistem pembayaran koin bambu.",
    detailDescription:
      "Pasar Pundensari merupakan pasar wisata budaya khas Desa Gunungsari yang menghadirkan suasana tradisional, jajanan lokal, produk UMKM, serta pengalaman berbelanja menggunakan koin bambu.",
    experience:
      "Pengunjung dapat menikmati kuliner tradisional, membeli produk lokal, mengenal sistem pembayaran koin bambu, serta merasakan interaksi langsung dengan masyarakat Desa Gunungsari.",
    visitInfo:
      "Sebelum berbelanja di Pasar Pundensari, pengunjung dapat menukar uang menjadi koin bambu melalui fitur Tukar Koin.",
    location: "Pasar Pundensari, Desa Gunungsari",
    latitude: -7.5769933,
    longitude: 111.5418063,
    image: require("../../assets/images/pundensari.jpeg"),
    priceType: "coin",
    priceLabel: "Menggunakan koin bambu",
    nominalSatuan: 0,
    isPundensari: true,
    actionType: "coin",
    actionLabel: "Tukar Koin",
  },
  {
    id: 2,
    title: "Museum Purabaya",
    category: "Budaya",
    description:
      "Tempat edukasi budaya dan sejarah yang menampilkan koleksi tradisional serta peninggalan budaya Desa Gunungsari.",
    detailDescription:
      "Museum Purabaya merupakan tempat edukasi budaya dan sejarah yang menampilkan koleksi tradisional serta peninggalan budaya Desa Gunungsari.",
    experience:
      "Pengunjung dapat melihat koleksi tradisional, mengenal sejarah Desa Gunungsari, memahami peninggalan budaya, dan mendapatkan pengalaman edukasi budaya.",
    visitInfo:
      "Untuk kunjungan rombongan atau kegiatan edukasi, pengunjung dapat mengajukan kunjungan terlebih dahulu melalui aplikasi.",
    location: "Museum Purabaya, Desa Gunungsari",
    latitude: -7.5773276,
    longitude: 111.5409192,
    image: require("../../assets/images/museum.jpeg"),
    priceType: "free",
    priceLabel: "Tiket masuk gratis",
    nominalSatuan: 0,
    isPundensari: false,
    actionType: "visit",
    actionLabel: "Ajukan Kunjungan",
  },
  {
    id: 3,
    title: "Batik DemunG",
    category: "Edukasi",
    description:
      "Wisata edukasi batik khas Desa Gunungsari yang mengenalkan proses pembuatan, motif, dan nilai budaya Batik DemunG.",
    detailDescription:
      "Batik DemunG merupakan wisata edukasi batik khas Desa Gunungsari yang mengenalkan proses pembuatan batik, motif lokal, serta nilai budaya Batik DemunG.",
    experience:
      "Pengunjung dapat mengenal proses membatik, melihat motif khas Batik DemunG, memahami filosofi batik, serta melihat produk batik lokal Desa Gunungsari.",
    visitInfo:
      "Biaya dan kegiatan dapat menyesuaikan jumlah peserta, durasi, dan kebutuhan kunjungan.",
    location: "Batik DemunG, Desa Gunungsari",
    latitude: -7.5705712,
    longitude: 111.5388969,
    image: require("../../assets/images/batikk.jpg"),
    priceType: "consult",
    priceLabel: "Menyesuaikan kebutuhan",
    nominalSatuan: 0,
    isPundensari: false,
    actionType: "visit",
    actionLabel: "Ajukan Kunjungan",
  },
];

export const getWisataById = (id) => {
  return wisataData.find((item) => String(item.id) === String(id));
};