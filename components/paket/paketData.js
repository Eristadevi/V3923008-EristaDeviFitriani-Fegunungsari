export const paketWisata = [
  {
    id: 1,
    icon: "book-open",
    image: require("../../assets/images/hero1.jpeg"),

    title: "Paket Wisata Edukasi",
    category: "Edukasi",

    priceType: "paid",
    priceLabel: "Mulai dari Rp25.000/orang",
    price: "Mulai dari Rp25.000/orang",
    paymentRequired: true,

    duration: "2 - 3 jam",

    desc: "Belajar kebun kopi, budidaya padi, dan pengelolaan magot BSF.",

    detail:
      "Paket Wisata Edukasi cocok untuk pelajar, mahasiswa, keluarga, dan komunitas. Pengunjung dapat belajar langsung tentang kehidupan desa, pertanian, kebun kopi, budidaya padi, serta pengelolaan magot BSF.",

    suitable: "Sekolah, mahasiswa, komunitas, keluarga",

    facilities: [
      "Pendamping kegiatan",
      "Area edukasi desa",
      "Sesi praktik sederhana",
      "Sesi tanya jawab",
      "Dokumentasi kegiatan",
    ],
  },

  {
    id: 2,
    icon: "music",
    image: require("../../assets/images/herooo2.jpeg"),

    title: "Paket Budaya & Seni",
    category: "Budaya",

    priceType: "paid",
    priceLabel: "Mulai dari Rp20.000/orang",
    price: "Mulai dari Rp20.000/orang",
    paymentRequired: true,

    duration: "1 - 2 jam",

    desc: "Mengenal seni tradisional, festival budaya, dan aksara Jawa.",

    detail:
      "Paket Budaya & Seni mengenalkan wisatawan pada kebudayaan lokal Gunungsari melalui seni tradisional, pengenalan aksara Jawa, serta kegiatan budaya masyarakat desa.",

    suitable: "Keluarga, sekolah, komunitas budaya, wisatawan umum",

    facilities: [
      "Pendamping budaya",
      "Pengenalan seni tradisional",
      "Workshop aksara Jawa",
      "Area pertunjukan",
      "Dokumentasi budaya",
    ],
  },

  {
    id: 3,
    icon: "coffee",
    image: require("../../assets/images/hero1.jpeg"),

    title: "Paket Kuliner Lokal",
    category: "Kuliner",

    priceType: "consult",
    priceLabel: "Menyesuaikan pilihan kuliner",
    price: "Menyesuaikan pilihan kuliner",
    paymentRequired: false,

    duration: "45 menit - 1 jam",

    desc: "Mencicipi makanan lokal dan mengenal produk UMKM desa.",

    detail:
      "Paket Kuliner Lokal menghadirkan pengalaman mencicipi makanan khas desa, mengenal produk UMKM, serta memahami potensi ekonomi kreatif masyarakat Gunungsari. Harga paket dapat menyesuaikan pilihan menu, jumlah peserta, dan kebutuhan kunjungan.",

    suitable: "Wisatawan umum, keluarga, pecinta kuliner",

    facilities: [
      "Produk UMKM lokal",
      "Kuliner khas desa",
      "Area makan sederhana",
      "Cerita produk lokal",
    ],
  },

  {
    id: 4,
    icon: "home",
    image: require("../../assets/images/herooo2.jpeg"),

    title: "Paket Live In Desa",
    category: "Pengalaman",

    priceType: "consult",
    priceLabel: "Menyesuaikan durasi dan kebutuhan",
    price: "Menyesuaikan durasi dan kebutuhan",
    paymentRequired: false,

    duration: "1 - 2 hari",

    desc: "Mengikuti kehidupan masyarakat desa secara langsung.",

    detail:
      "Paket Live In Desa memberikan pengalaman tinggal dan beraktivitas bersama masyarakat lokal. Pengunjung dapat mengenal kehidupan desa, budaya masyarakat, dan kegiatan sehari-hari warga Gunungsari. Harga akan menyesuaikan durasi, jumlah peserta, dan kebutuhan kegiatan.",

    suitable: "Pelajar, mahasiswa, komunitas, wisatawan budaya",

    facilities: [
      "Pendamping lokal",
      "Aktivitas bersama warga",
      "Pengenalan kehidupan desa",
      "Interaksi masyarakat",
      "Pengalaman budaya lokal",
    ],
  },

  {
    id: 5,
    icon: "feather",
    image: require("../../assets/images/hero1.jpeg"),

    title: "Paket Pariwisata Hijau",
    category: "Alam",

    priceType: "free",
    priceLabel: "Gratis",
    price: "Gratis",
    paymentRequired: false,

    duration: "1 - 2 jam",

    desc: "Wisata berbasis alam, budaya, dan keberlanjutan lingkungan.",

    detail:
      "Paket Pariwisata Hijau mengajak pengunjung menikmati suasana desa yang asri sambil mengenal konsep wisata berkelanjutan, pelestarian lingkungan, dan pemberdayaan masyarakat lokal. Paket ini dapat digunakan sebagai pengenalan awal wisata desa.",

    suitable: "Keluarga, komunitas lingkungan, wisatawan umum",

    facilities: [
      "Pendamping lokal",
      "Edukasi lingkungan",
      "Suasana alam desa",
      "Pengenalan wisata berkelanjutan",
    ],
  },
];

export const paketCategories = [
  "Semua",
  "Edukasi",
  "Budaya",
  "Kuliner",
  "Pengalaman",
  "Alam",
];