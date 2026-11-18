type RoleFilter = 'uda' | 'uni';

interface AmbassadorBio {
  role: 'uda' | 'uni';
  slotIndex: number;
  rankLabel: string;
  fullName: string;
  shortName: string;
  titleBadge: string;
  region: string;
  education: string;
  profession: string;
  bio: string;
  advocacy: string;
  achievement: string;
}

interface CohortPhoto {
  thumb: string;
  full: string;
}

interface YearLineup {
  year: string;
  uda: AmbassadorBio[];
  uni: AmbassadorBio[];
}

const UDA_PHOTOS: CohortPhoto[] = [
  {
    thumb: 'https://reel-ref-try-the-look.vercel.app/assets/model-1-640.webp',
    full: 'https://reel-ref-try-the-look.vercel.app/assets/original-look-1.webp',
  },
  {
    thumb: 'https://reel-ref-try-the-look.vercel.app/assets/model-5-640.webp',
    full: 'https://reel-ref-try-the-look.vercel.app/assets/original-look-5.webp',
  },
  {
    thumb: 'https://reel-ref-try-the-look.vercel.app/assets/model-4-640.webp',
    full: 'https://reel-ref-try-the-look.vercel.app/assets/original-look-4.webp',
  },
  {
    thumb: 'https://reel-ref-try-the-look.vercel.app/assets/model-6-640.webp',
    full: 'https://reel-ref-try-the-look.vercel.app/assets/original-look-6.webp',
  },
  {
    thumb: 'https://reel-ref-try-the-look.vercel.app/assets/model-3-640.webp',
    full: 'https://reel-ref-try-the-look.vercel.app/assets/original-look-3.webp',
  },
  {
    thumb: 'https://reel-ref-try-the-look.vercel.app/assets/model-2-640.webp',
    full: 'https://reel-ref-try-the-look.vercel.app/assets/original-look-2.webp',
  },
];

const UNI_PHOTOS: CohortPhoto[] = [
  {
    thumb: 'https://reel-ref-try-the-look.vercel.app/assets/model-2-640.webp',
    full: 'https://reel-ref-try-the-look.vercel.app/assets/original-look-2.webp',
  },
  {
    thumb: 'https://reel-ref-try-the-look.vercel.app/assets/model-3-640.webp',
    full: 'https://reel-ref-try-the-look.vercel.app/assets/original-look-3.webp',
  },
  {
    thumb: 'https://reel-ref-try-the-look.vercel.app/assets/model-6-640.webp',
    full: 'https://reel-ref-try-the-look.vercel.app/assets/original-look-6.webp',
  },
  {
    thumb: 'https://reel-ref-try-the-look.vercel.app/assets/model-4-640.webp',
    full: 'https://reel-ref-try-the-look.vercel.app/assets/original-look-4.webp',
  },
  {
    thumb: 'https://reel-ref-try-the-look.vercel.app/assets/model-5-640.webp',
    full: 'https://reel-ref-try-the-look.vercel.app/assets/original-look-5.webp',
  },
  {
    thumb: 'https://reel-ref-try-the-look.vercel.app/assets/model-1-640.webp',
    full: 'https://reel-ref-try-the-look.vercel.app/assets/original-look-1.webp',
  },
];

const RANK_LABELS = ['Utama', 'Wakil I', 'Wakil II', 'Intelegensia', 'Berbakat', 'Favorit'] as const;

interface YearRawSeed {
  year: string;
  utamaUda: Omit<AmbassadorBio, 'slotIndex' | 'rankLabel'>;
  utamaUni: Omit<AmbassadorBio, 'slotIndex' | 'rankLabel'>;
  udaDelegates: [string, string, string, string, string][];
  uniDelegates: [string, string, string, string, string][];
}

// Tuple: [fullNameWithTitle, shortName, region, education, focus]
const RAW_YEARS: YearRawSeed[] = [
  {
    year: '2025',
    utamaUda: {
      role: 'uda',
      fullName: 'Uda Riky Pratama, S.T.',
      shortName: 'Uda Riky Pratama',
      titleBadge: 'Uda Duta Wisata Sumbar 2025',
      region: 'Kota Bukittinggi',
      education: 'Sarjana Teknik Sipil — Universitas Andalas',
      profession: 'Pegiat Wisata Sejarah & Fotografer Dokumenter',
      bio: 'Lahir dan besar di jantung kota wisata Bukittinggi, Uda Riky aktif memetakan rute jalan kaki sejarah di kawasan Jam Gadang, Lobang Japang, hingga Ngarai Sianok serta mengangkat kisah heritage daerah kepada generasi muda.',
      advocacy: 'Revitalisasi Wisata Heritage & Digital Storytelling Destinasi',
      achievement: 'Terpilih Uda Sumatera Barat 2025 · Duta Pemuda Kreatif Kota Bukittinggi',
    },
    utamaUni: {
      role: 'uni',
      fullName: 'Uni Mutiara Az-Zahra, S.Ars.',
      shortName: 'Uni Mutiara Az-Zahra',
      titleBadge: 'Uni Duta Wisata Sumbar 2025',
      region: 'Kab. Tanah Datar',
      education: 'Sarjana Arsitektur — Institut Teknologi Bandung',
      profession: 'Peneliti Muda Arsitektur Vernakular Minangkabau',
      bio: 'Tumbuh di lingkungan adat Luhak Nan Tuo, Uni Mutiara mendampingi nagari-nagari wisata di Tanah Datar dalam merancang penginapan budaya yang tetap mempertahankan ukiran dan tata ruang Rumah Gadang.',
      advocacy: 'Wisata Nagari Adat & Pelestarian Arsitektur Rumah Gadang',
      achievement: 'Terpilih Uni Sumatera Barat 2025 · Finalis Desain Ruang Publik Budaya Sumatera',
    },
    udaDelegates: [
      ['Uda Zaki Al-Ghifari, S.E.', 'Uda Zaki Al-Ghifari', 'Kota Padang', 'Sarjana Ekonomi — Universitas Negeri Padang', 'Pengembangan Wisata Bahari & Ekosistem Pantai Barat'],
      ['Uda Bima Adriansyah, S.I.Kom.', 'Uda Bima Adriansyah', 'Kota Payakumbuh', 'Sarjana Ilmu Komunikasi — Universitas Andalas', 'Branding Kuliner Rendang & Pasar Tradisional Digital'],
      ['Uda Naufal Hakim, S.H.', 'Uda Naufal Hakim', 'Kab. Agam', 'Sarjana Hukum — Universitas Andalas', 'Tata Kelola Geopark Ngarai Sianok–Maninjau'],
      ['Uda Ilham Kurnia, S.Sn.', 'Uda Ilham Kurnia', 'Kota Padang Panjang', 'Sarjana Seni — ISI Padang Panjang', 'Pelestarian Seni Pertunjukan Randai & Musik Talempong'],
      ['Uda Aditya Ramadhan, S.Par.', 'Uda Aditya Ramadhan', 'Kab. Pesisir Selatan', 'Sarjana Pariwisata — Politeknik Negeri Padang', 'Promosi Ekowisata Kawasan Bahari Terpadu Mandeh'],
    ],
    uniDelegates: [
      ['Uni Nadya Chairunnisa, S.Ked.', 'Uni Nadya Chairunnisa', 'Kota Padang', 'Sarjana Kedokteran — Universitas Andalas', 'Standar Wisata Kesehatan & Sanitasi Kawasan Kuliner'],
      ['Uni Alya Salsabila, S.Pd.', 'Uni Alya Salsabila', 'Kota Bukittinggi', 'Sarjana Pendidikan Bahasa — Universitas Negeri Padang', 'Pemandu Wisata Multilingual & Edukasi Sejarah Minangkabau'],
      ['Uni Tari Kusuma, S.Ds.', 'Uni Tari Kusuma', 'Kab. Lima Puluh Kota', 'Sarjana Desain — ISI Padang Panjang', 'Pengembangan Kemasan Kriya & Geopark Lembah Harau'],
      ['Uni Raisha Permata, S.Sos.', 'Uni Raisha Permata', 'Kota Pariaman', 'Sarjana Sosiologi — Universitas Andalas', 'Promosi Festival Budaya Pesona Hoyak Tabuik'],
      ['Uni Shafira Amalia, S.P.', 'Uni Shafira Amalia', 'Kab. Solok', 'Sarjana Pertanian — Universitas Andalas', 'Agrowisata Dataran Tinggi Alahan Panjang & Kopi Solok'],
    ],
  },
  {
    year: '2024',
    utamaUda: {
      role: 'uda',
      fullName: 'Uda Fikri Ramadhan, S.E.',
      shortName: 'Uda Fikri Ramadhan',
      titleBadge: 'Uda Duta Wisata Sumbar 2024',
      region: 'Kota Sawahlunto',
      education: 'Sarjana Ekonomi — Universitas Negeri Padang',
      profession: 'Pengelola Ekonomi Kreatif & Wisata Warisan Tambang',
      bio: 'Berasal dari Kota Sawahlunto yang masuk daftar Warisan Dunia UNESCO, Uda Fikri mengintegrasikan narasi sejarah pertambangan dengan pemberdayaan pelaku UMKM kuliner dan kriya lokal agar berdampak langsung ke ekonomi warga.',
      advocacy: 'Pemberdayaan Ekonomi Kreatif Desa Wisata & UNESCO Heritage Tour',
      achievement: 'Uda Sumatera Barat 2024 · Penggerak Pokdarwis Terbaik Regional Timur',
    },
    utamaUni: {
      role: 'uni',
      fullName: 'Uni Zahra Putri Andini, S.I.Kom.',
      shortName: 'Uni Zahra Putri Andini',
      titleBadge: 'Uni Duta Wisata Sumbar 2024',
      region: 'Kab. Pesisir Selatan',
      education: 'Sarjana Ilmu Komunikasi — Universitas Padjadjaran',
      profession: 'Jurnalis Pariwisata Bahari & Pembawa Acara Dwibahasa',
      bio: 'Uni Zahra mengampanyekan pelestarian ekosistem terumbu karang dan wisata bahari berkelanjutan di Kawasan Mandeh serta Pantai Carocok, sembari memperkenalkan destinasi pesisir selatan di berbagai forum internasional.',
      advocacy: 'Ekowisata Bahari Kawasan Mandeh & Literasi Pariwisata Hijau',
      achievement: 'Uni Sumatera Barat 2024 · Duta Bahasa & Komunikasi Publik Sumatera Barat',
    },
    udaDelegates: [
      ['Uda Dimas Wahyudi, S.T.', 'Uda Dimas Wahyudi', 'Kota Solok', 'Sarjana Teknik — Universitas Andalas', 'Revitalisasi Jalur Wisata Kuliner & Sawah Solok'],
      ['Uda Rayhan Akbar, S.IP.', 'Uda Rayhan Akbar', 'Kab. Tanah Datar', 'Sarjana Ilmu Politik — Universitas Gadjah Mada', 'Diplomasi Adat Pagaruyung & Desa Adat Pandai Sikek'],
      ['Uda Kevin Mahendra, S.Kom.', 'Uda Kevin Mahendra', 'Kota Padang', 'Sarjana Informatika — Universitas Putra Indonesia', 'Digitalisasi Peta Destinasi & Virtual Tour Museum Adityawarman'],
      ['Uda Arif Budiman, S.Sn.', 'Uda Arif Budiman', 'Kab. Sijunjung', 'Sarjana Seni — ISI Padang Panjang', 'Dokumentasi Perkampungan Adat Matrilineal Sijunjung'],
      ['Uda Yogi Saputra, S.Kel.', 'Uda Yogi Saputra', 'Kab. Kep. Mentawai', 'Sarjana Ilmu Kelautan — Universitas Bung Hatta', 'Konservasi Budaya Sikerei & Wisata Selancar Berkelanjutan'],
    ],
    uniDelegates: [
      ['Uni Tiara Maulida, S.E.', 'Uni Tiara Maulida', 'Kota Sawahlunto', 'Sarjana Ekonomi — Universitas Negeri Padang', 'Promosi Tenun Songket Silungkang & Museum Kereta Api'],
      ['Uni Cantika Lestari, S.Psi.', 'Uni Cantika Lestari', 'Kota Payakumbuh', 'Sarjana Psikologi — Universitas Andalas', 'Pelatihan Keramahtamahan Pelayanan Desa Wisata'],
      ['Uni Keisha Maharani, S.Ars.', 'Uni Keisha Maharani', 'Kab. Solok Selatan', 'Sarjana Arsitektur — Universitas Bung Hatta', 'Pelestarian Kawasan Saribu Rumah Gadang Muara Labuh'],
      ['Uni Diva Anggraini, S.Pd.', 'Uni Diva Anggraini', 'Kab. Dharmasraya', 'Sarjana Pendidikan — Universitas Negeri Padang', 'Edukasi Sejarah Candi Padang Roco & Sungai Batanghari'],
      ['Uni Najwa Salsabila, S.Gz.', 'Uni Najwa Salsabila', 'Kab. Padang Pariaman', 'Sarjana Ilmu Gizi — Universitas Andalas', 'Pemberdayaan Wisata Kuliner Sala Lauak & Pesisir Tiram'],
    ],
  },
  {
    year: '2023',
    utamaUda: {
      role: 'uda',
      fullName: 'Uda Farhan Maulana, S.H.',
      shortName: 'Uda Farhan Maulana',
      titleBadge: 'Uda Duta Wisata Sumbar 2023',
      region: 'Kota Padang',
      education: 'Sarjana Hukum — Universitas Andalas',
      profession: 'Konsultan Tata Kelola Pariwisata & Narator Budaya',
      bio: 'Fokus pada penguatan standar pariwisata ramah muslim serta pendampingan perlindungan hak kekayaan intelektual komunal bagi seni pertunjukan randai dan kriya tradisional Minangkabau.',
      advocacy: 'Tata Kelola Wisata Ramah Muslim & Diplomasi Budaya Maritim',
      achievement: 'Uda Sumatera Barat 2023 · Delegasi Forum Pemuda Pariwisata ASEAN',
    },
    utamaUni: {
      role: 'uni',
      fullName: 'Uni Aulia Rahma, S.Pd.',
      shortName: 'Uni Aulia Rahma',
      titleBadge: 'Uni Duta Wisata Sumbar 2023',
      region: 'Kab. Agam',
      education: 'Sarjana Pendidikan Bahasa Inggris — Universitas Negeri Padang',
      profession: 'Edukator Wisata Alam & Pendamping Komunitas Nagari',
      bio: 'Menghubungkan kawasan wisata alam Danau Maninjau, Kelok 44, dan Puncak Lawang dengan pelatihan komunikasi bahasa Inggris praktis bagi pemandu lokal dan pengrajin perak Koto Gadang.',
      advocacy: 'Edukasi Bahasa Asing Pelaku Wisata & Konservasi Danau Maninjau',
      achievement: 'Uni Sumatera Barat 2023 · Pemenang Kategori Intelegensia',
    },
    udaDelegates: [
      ['Uda Rizky Fadillah, S.E.', 'Uda Rizky Fadillah', 'Kota Bukittinggi', 'Sarjana Ekonomi — Universitas Andalas', 'Revitalisasi Ekonomi Kreatif Pengrajin Sulam Kapau'],
      ['Uda Haris Pratama, S.T.', 'Uda Haris Pratama', 'Kab. Pasaman', 'Sarjana Teknik — Universitas Negeri Padang', 'Kampanye Ekowisata Garis Khatulistiwa Bonjol'],
      ['Uda Alif Nizar, S.Sos.', 'Uda Alif Nizar', 'Kab. Pasaman Barat', 'Sarjana Sosiologi — Universitas Andalas', 'Promosi Geowisata Gunung Talamau & Pantai Air Bangis'],
      ['Uda Teguh Santoso, S.Sn.', 'Uda Teguh Santoso', 'Kota Pariaman', 'Sarjana Seni — ISI Padang Panjang', 'Pengembangan Seni Gandang Tambua & Festival Pantai'],
      ['Uda Bagas Prayoga, S.Hut.', 'Uda Bagas Prayoga', 'Kab. Solok', 'Sarjana Kehutanan — Universitas Andalas', 'Pelestarian Rimba Raya & Jalur Pendakian Gunung Talang'],
    ],
    uniDelegates: [
      ['Uni Intan Purnama, S.I.Kom.', 'Uni Intan Purnama', 'Kota Padang', 'Sarjana Ilmu Komunikasi — Universitas Andalas', 'Kampanye Kota Tua Padang & Wisata Kuliner Muaro'],
      ['Uni Melati Putri, S.E.', 'Uni Melati Putri', 'Kab. Tanah Datar', 'Sarjana Ekonomi — UIN Mahmud Yunus', 'Pemberdayaan Penenun Songket Balapak Nagari Sungayang'],
      ['Uni Firda Anisa, S.Hum.', 'Uni Firda Anisa', 'Kota Padang Panjang', 'Sarjana Sastra — Universitas Andalas', 'Pelestarian Kaba & Literasi Sejarah Minangkabau'],
      ['Uni Sinta Amelia, S.Par.', 'Uni Sinta Amelia', 'Kab. Pesisir Selatan', 'Sarjana Pariwisata — Politeknik Negeri Padang', 'Pengembangan Homestay Berbasis Kearifan Lokal'],
      ['Uni Nadia Humaira, S.Ked.', 'Uni Nadia Humaira', 'Kota Bukittinggi', 'Sarjana Kedokteran — Universitas Andalas', 'Edukasi Wisata Sehat & Kesiapsiagaan Bencana Alam'],
    ],
  },
  {
    year: '2022',
    utamaUda: {
      role: 'uda',
      fullName: 'Uda Hafiz Al-Faruq, M.Par.',
      shortName: 'Uda Hafiz Al-Faruq',
      titleBadge: 'Uda Duta Wisata Sumbar 2022',
      region: 'Kab. Pesisir Selatan',
      education: 'Magister Pariwisata — STP Bandung',
      profession: 'Perencana Destinasi Berkelanjutan',
      bio: 'Sebagai peneliti muda kepariwisataan, Uda Hafiz mendampingi pengembangan jalur jelajah alam Bukit Langkisau dan air terjun berbasis standar keselamatan wisata serta konservasi hutan lindung.',
      advocacy: 'Perencanaan Destinasi Berkelanjutan & Wisata Petualangan Aman',
      achievement: 'Uda Sumatera Barat 2022 · Kontributor Pedoman Ekowisata Sumatera Barat',
    },
    utamaUni: {
      role: 'uni',
      fullName: 'Uni Nabila Khairunnisa, S.Ked.',
      shortName: 'Uni Nabila Khairunnisa',
      titleBadge: 'Uni Duta Wisata Sumbar 2022',
      region: 'Kota Padang',
      education: 'Sarjana Kedokteran — Universitas Andalas',
      profession: 'Inisiator Wisata Kebugaran & Gastronomi Higienis',
      bio: 'Memadukan perspektif kesehatan dengan kekayaan kuliner Minangkabau, Uni Nabila mengedukasi pengelola kawasan kuliner pesisir Padang tentang standar higienitas pangan serta kesiapsiagaan medis wisata alam.',
      advocacy: 'Wisata Kebugaran, Higienitas Kuliner Tradisional & Edukasi Publik',
      achievement: 'Uni Sumatera Barat 2022 · Duta Gizi & Pariwisata Sehat Kota Padang',
    },
    udaDelegates: [
      ['Uda Fadil Rahman, S.T.', 'Uda Fadil Rahman', 'Kab. Lima Puluh Kota', 'Sarjana Teknik — Universitas Andalas', 'Pengembangan Wisata Panjat Tebing & Alam Lembah Harau'],
      ['Uda Gilang Permana, S.E.', 'Uda Gilang Permana', 'Kota Payakumbuh', 'Sarjana Ekonomi — Universitas Negeri Padang', 'Pemasaran Digital Produk UMKM Tenun Kubang'],
      ['Uda Yusuf Maulana, S.IP.', 'Uda Yusuf Maulana', 'Kota Sawahlunto', 'Sarjana Ilmu Politik — Universitas Andalas', 'Komunikasi Publik Warisan Budaya Ombilin Sawahlunto'],
      ['Uda Rahmat Hidayat, S.Pd.', 'Uda Rahmat Hidayat', 'Kab. Padang Pariaman', 'Sarjana Pendidikan — Universitas Negeri Padang', 'Edukasi Wisata Religi Surau Tua & Makam Syekh Burhanuddin'],
      ['Uda Andre Kurnia, S.Sn.', 'Uda Andre Kurnia', 'Kab. Solok Selatan', 'Sarjana Seni — ISI Padang Panjang', 'Atraksi Seni Tari Piring & Adat Alam Surambi Sungai Pagu'],
    ],
    uniDelegates: [
      ['Uni Hanna Azzahra, S.Ars.', 'Uni Hanna Azzahra', 'Kota Bukittinggi', 'Sarjana Arsitektur — Universitas Bung Hatta', 'Konservasi Bangunan Kolonial & Kawasan Benteng Fort de Kock'],
      ['Uni Rania Oktavia, S.I.Kom.', 'Uni Rania Oktavia', 'Kab. Agam', 'Sarjana Ilmu Komunikasi — Universitas Andalas', 'Promosi Kerajinan Perak Koto Gadang ke Pasar Nasional'],
      ['Uni Clarissa Amanda, S.H.', 'Uni Clarissa Amanda', 'Kota Solok', 'Sarjana Hukum — Universitas Andalas', 'Perlindungan Indikasi Geografis Beras Bareh Solok'],
      ['Uni Yuliana Fitri, S.Sos.', 'Uni Yuliana Fitri', 'Kab. Sijunjung', 'Sarjana Sosiologi — Universitas Negeri Padang', 'Pemberdayaan Kelompok Perempuan Desa Adat Padang Ranah'],
      ['Uni Marsha Puspita, S.Par.', 'Uni Marsha Puspita', 'Kab. Kep. Mentawai', 'Sarjana Pariwisata — Politeknik Negeri Padang', 'Ekowisata Hutan Adat & Edukasi Budaya Kepulauan Mentawai'],
    ],
  },
  {
    year: '2021',
    utamaUda: {
      role: 'uda',
      fullName: 'Uda Iqbal Hakim, S.Sos.',
      shortName: 'Uda Iqbal Hakim',
      titleBadge: 'Uda Duta Wisata Sumbar 2021',
      region: 'Kab. Agam',
      education: 'Sarjana Sosiologi — Universitas Indonesia',
      profession: 'Penggiat Adat Salingka Nagari & Silek Tradisi',
      bio: 'Aktif merawat tradisi lisan, silek tuo, dan seni kaba Minangkabau sebagai daya tarik wisata budaya autentik dengan membina sanggar-sanggar muda di berbagai nagari di Kabupaten Agam.',
      advocacy: 'Wisata Budaya Berbasis Sanggar & Pelestarian Silek Tradisional',
      achievement: 'Uda Sumatera Barat 2021 · Penampil Kehormatan Festival Budaya Nusantara',
    },
    utamaUni: {
      role: 'uni',
      fullName: 'Uni Salsabila Fitri, S.Ds.',
      shortName: 'Uni Salsabila Fitri',
      titleBadge: 'Uni Duta Wisata Sumbar 2021',
      region: 'Kota Padang Panjang',
      education: 'Sarjana Desain Produk — ISI Padang Panjang',
      profession: 'Kurator Arsip Kriya & Desainer Produk Budaya',
      bio: 'Tumbuh di kota seni Padang Panjang, Uni Salsabila menginisiasi pendokumentasian digital ratusan motif tenun klasik Sumatera Barat guna mempercepat regenerasi pengrajin muda.',
      advocacy: 'Pengarsipan Digital Motif Wastra & Regenerasi Perajin Muda',
      achievement: 'Uni Sumatera Barat 2021 · Kurator Pameran Seni Budaya Muda Sumatera',
    },
    udaDelegates: [
      ['Uda Ilfan Zulfikar, S.E.', 'Uda Ilfan Zulfikar', 'Kota Padang', 'Sarjana Ekonomi — Universitas Andalas', 'Pemulihan Ekonomi Kreatif Pariwisata Pascapandemi'],
      ['Uda Daffa Pratama, S.Kom.', 'Uda Daffa Pratama', 'Kab. Tanah Datar', 'Sarjana Sistem Informasi — Universitas Andalas', 'Platform Pemesanan Tiket & Panduan Digital Istano Basa'],
      ['Uda Satria Wibowo, S.T.', 'Uda Satria Wibowo', 'Kab. Dharmasraya', 'Sarjana Teknik — Universitas Negeri Padang', 'Pengembangan Akses Wisata Sungai & Cagar Sejarah Dharmasraya'],
      ['Uda Taufik Hidayat, S.Pd.', 'Uda Taufik Hidayat', 'Kota Pariaman', 'Sarjana Pendidikan — Universitas Negeri Padang', 'Program Konservasi Penyu Pantai Gondoriah'],
      ['Uda Reza Alamsyah, S.IP.', 'Uda Reza Alamsyah', 'Kota Bukittinggi', 'Sarjana Ilmu Politik — Universitas Andalas', 'Forum Kepemudaan Duta Wisata Lintas Sumatera'],
    ],
    uniDelegates: [
      ['Uni Latifa Azmi, S.Farm.', 'Uni Latifa Azmi', 'Kab. Pasaman', 'Sarjana Farmasi — Universitas Andalas', 'Pengembangan Produk Minyak Atsiri & Herbal Wisata Alam'],
      ['Uni Dinda Kartika, S.I.Kom.', 'Uni Dinda Kartika', 'Kab. Pasaman Barat', 'Sarjana Komunikasi — Universitas Negeri Padang', 'Narasi Digital Keberagaman Budaya Pesisir Utara Sumbar'],
      ['Uni Sofia Rahmawati, S.Sn.', 'Uni Sofia Rahmawati', 'Kota Sawahlunto', 'Sarjana Seni — ISI Padang Panjang', 'Festival Tari Tradisional & Galeri Kriya Batu Bara'],
      ['Uni Vania Pratiwi, S.E.', 'Uni Vania Pratiwi', 'Kab. Pesisir Selatan', 'Sarjana Ekonomi — Universitas Andalas', 'Penguatan Manajemen Keuangan Kelompok Sadar Wisata'],
      ['Uni Gita Larasati, S.Hum.', 'Uni Gita Larasati', 'Kota Payakumbuh', 'Sarjana Sastra — Universitas Andalas', 'Literasi Kuliner Tradisional & Dokumentasi Resep Nagari'],
    ],
  },
  {
    year: '2020',
    utamaUda: {
      role: 'uda',
      fullName: 'Uda Reza Kurniawan, S.IP.',
      shortName: 'Uda Reza Kurniawan',
      titleBadge: 'Uda Duta Wisata Sumbar 2020',
      region: 'Kota Payakumbuh',
      education: 'Sarjana Ilmu Politik — Universitas Gadjah Mada',
      profession: 'Praktisi Diplomasi Daerah & Promotor Wisata Gastronomi',
      bio: 'Berasal dari sentra rendang Kota Payakumbuh, Uda Reza konsisten mempromosikan wisata kuliner Minangkabau pada forum budaya nasional hingga misi promosi luar negeri.',
      advocacy: 'Diplomasi Gastronomi Rendang & Festival Kuliner Tradisional',
      achievement: 'Uda Sumatera Barat 2020 · Duta Kuliner Nusantara Tingkat Nasional',
    },
    utamaUni: {
      role: 'uni',
      fullName: 'Uni Putri Maharani, S.Psi.',
      shortName: 'Uni Putri Maharani',
      titleBadge: 'Uni Duta Wisata Sumbar 2020',
      region: 'Kab. Lima Puluh Kota',
      education: 'Sarjana Psikologi — Universitas Negeri Padang',
      profession: 'Fasilitator Komunitas Geopark Lembah Harau',
      bio: 'Berperan aktif membangun keramahtamahan pariwisata berbasis komunitas di kawasan Lembah Harau dan Kelok 9 serta merancang program eduwisata alam bagi pelajar.',
      advocacy: 'Peningkatan Hospitality Desa Wisata & Eduwisata Lembah Harau',
      achievement: 'Uni Sumatera Barat 2020 · Inisiator Program Sahabat Wisata Lembah Harau',
    },
    udaDelegates: [
      ['Uda Arga Wijaya, S.T.', 'Uda Arga Wijaya', 'Kota Padang', 'Sarjana Teknik — Universitas Andalas', 'Penataan Zona Wisata Ramah Pejalan Kaki Pesisir Padang'],
      ['Uda Fajar Nugroho, S.E.', 'Uda Fajar Nugroho', 'Kab. Solok', 'Sarjana Ekonomi — Universitas Negeri Padang', 'Promosi Wisata Danau Kembar & Perkebunan Teh Alahan Panjang'],
      ['Uda Hendra Kusuma, S.H.', 'Uda Hendra Kusuma', 'Kota Solok', 'Sarjana Hukum — Universitas Andalas', 'Advokasi Regulasi Perlindungan Situs Adat Nagari'],
      ['Uda Bayu Anggara, S.Par.', 'Uda Bayu Anggara', 'Kab. Tanah Datar', 'Sarjana Pariwisata — Politeknik Negeri Padang', 'Pengembangan Tur Budaya Nagari Tuo Pariangan'],
      ['Uda Riko Saputra, S.Pd.', 'Uda Riko Saputra', 'Kab. Padang Pariaman', 'Sarjana Pendidikan — Universitas Negeri Padang', 'Pelatihan Pemandu Wisata Alam Air Terjun Nyarai'],
    ],
    uniDelegates: [
      ['Uni Aurelita Putri, S.I.Kom.', 'Uni Aurelita Putri', 'Kota Bukittinggi', 'Sarjana Ilmu Komunikasi — Universitas Andalas', 'Promosi Destinasi Bukittinggi Melalui Media Kreatif Digital'],
      ['Uni Karina Dewi, S.Ars.', 'Uni Karina Dewi', 'Kab. Agam', 'Sarjana Arsitektur — Universitas Bung Hatta', 'Konsep Tata Ruang Ramah Wisata Kawasan Puncak Lawang'],
      ['Uni Mona Adisti, S.Sn.', 'Uni Mona Adisti', 'Kota Padang Panjang', 'Sarjana Seni — ISI Padang Panjang', 'Pertunjukan Musik Tradisional & Tari Minangkabau'],
      ['Uni Bella Nirmala, S.Sos.', 'Uni Bella Nirmala', 'Kab. Solok Selatan', 'Sarjana Sosiologi — Universitas Andalas', 'Pemberdayaan Pemuda Adat Kawasan Saribu Rumah Gadang'],
      ['Uni Yasmin Safitri, S.E.', 'Uni Yasmin Safitri', 'Kota Pariaman', 'Sarjana Ekonomi — Universitas Negeri Padang', 'Promosi Produk Ekonomi Kreatif Bahari Kepulauan Angso Duo'],
    ],
  },
];

function buildDelegateBio(
  role: 'uda' | 'uni',
  year: string,
  slotIndex: number,
  tuple: [string, string, string, string, string],
): AmbassadorBio {
  const [fullName, shortName, region, education, focus] = tuple;
  const rank = RANK_LABELS[slotIndex];
  const prefix = role === 'uda' ? 'Uda' : 'Uni';
  return {
    role,
    slotIndex,
    rankLabel: `${prefix} ${rank}`,
    fullName,
    shortName,
    titleBadge: `${rank} ${prefix} Duta Wisata Sumbar ${year}`,
    region,
    education,
    profession: `Finalis ${prefix} Sumatera Barat ${year} · Penggerak Pariwisata ${region}`,
    bio: `Utusan resmi ${region} pada ajang Pemilihan Uda & Uni Duta Wisata Provinsi Sumatera Barat ${year}. Aktif menggerakkan program ${focus.toLowerCase()} bersama komunitas lokal dan anggota Ikatan Uda & Uni.`,
    advocacy: focus,
    achievement: `${rank} ${prefix} Duta Wisata Sumatera Barat ${year} · Utusan ${region}`,
  };
}

const YEAR_CONTINGENTS: YearLineup[] = RAW_YEARS.map((raw) => ({
  year: raw.year,
  uda: [
    {...raw.utamaUda, slotIndex: 0, rankLabel: 'Uda Utama'},
    ...raw.udaDelegates.map((tuple, i) => buildDelegateBio('uda', raw.year, i + 1, tuple)),
  ],
  uni: [
    {...raw.utamaUni, slotIndex: 0, rankLabel: 'Uni Utama'},
    ...raw.uniDelegates.map((tuple, i) => buildDelegateBio('uni', raw.year, i + 1, tuple)),
  ],
}));

interface ClassicBodyState {
  el: HTMLElement;
  idx: number;
  x: number;
  g: number;
  v: number;
  from: number;
  goal: number;
  trip: boolean;
  w: number;
  lastBlur: string;
}

interface RingBodyState {
  el: HTMLElement;
  idx: number;
  w: number;
  lastBlur: string;
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

function decodeModelImage(img: HTMLImageElement): void {
  const show = () => img.classList.add('is-decoded');
  if (typeof img.decode === 'function') {
    img
      .decode()
      .then(show)
      .catch(() => {
        if (img.complete && img.naturalWidth > 0) {
          show();
        } else {
          img.addEventListener('load', show, {once: true});
        }
      });
  } else if (img.complete && img.naturalWidth > 0) {
    show();
  } else {
    img.addEventListener('load', show, {once: true});
  }
}

class RunwaySection extends HTMLElement {
  private readonly LOOK_COUNT = 6;
  private readonly BODY_COUNT = this.LOOK_COUNT * Math.ceil(8 / this.LOOK_COUNT); // 12
  private readonly K = 95;
  private readonly C = 2 * Math.sqrt(95);

  private stage!: HTMLElement;
  private actorsEl!: HTMLElement;
  private heroesEl!: HTMLElement;
  private panelEl!: HTMLElement | null;
  private liveEl!: HTMLElement | null;
  private piecesEl!: HTMLElement | null;
  private panelTitleEl!: HTMLElement | null;
  private yearBadgeEl!: HTMLElement | null;
  private autoBtn!: HTMLButtonElement | null;
  private cursorEl!: HTMLElement | null;
  private lbEl!: HTMLElement | null;
  private lbStageEl!: HTMLElement | null;
  private lbKickerEl!: HTMLElement | null;
  private lbNameEl!: HTMLElement | null;
  private lbCloseBtn!: HTMLButtonElement | null;

  private heroes: HTMLElement[] = [];
  private ticks: HTMLButtonElement[] = [];
  private panels: HTMLElement[] = [];
  private roleButtons: HTMLButtonElement[] = [];
  private yearButtons: HTMLButtonElement[] = [];
  private ringBodies: RingBodyState[] = [];
  private classicBodies: ClassicBodyState[] = [];

  private index = 0;
  private activeYear = '2025';
  private roleFilter: RoleFilter = 'uda';
  private activePanelRole: 'uda' | 'uni' = 'uda';
  private panelOpen = false;
  private target = 0;
  private cur = 0;
  private vel = 0;
  private still = false;
  private mode: 'ring' | 'classic' = 'ring';
  private isMobile = false;

  private W = 800;
  private H = 600;
  private fs = 1.08;
  private unit = 240;
  private latchedVh = 0;
  private latchedW = 0;

  private reducedMotion = false;
  private mqlMotion!: MediaQueryList;
  private visible = true;
  private playing = false;
  private engaged = false;
  private panelHover = false;
  private zoomed = false;
  private dragging = false;

  private rafId = 0;
  private measureRaf = 0;
  private lastTs = 0;
  private lastFrameH = -1;
  private lastModelH = -1;
  private autoTimer = 0;
  private resizeTimer = 0;
  private wheelLock = 0;
  private wheelAcc = 0;
  private lbClearTimer = 0;
  private suppressClickUntil = 0;

  private dragPointerId: number | null = null;
  private dragStartX = 0;
  private dragStartY = 0;
  private dragStartTarget = 0;
  private dragActive = false;
  private dragAbandoned = false;
  private dragSamples: {x: number; time: number}[] = [];

  private cursorTargetX = 0;
  private cursorTargetY = 0;
  private cursorX = 0;
  private cursorY = 0;
  private cursorRaf = 0;
  private cursorHoverCapable = false;

  private visObserver: IntersectionObserver | null = null;
  private revealObserver: IntersectionObserver | null = null;
  private stageResizeObserver: ResizeObserver | null = null;
  private cleanups: (() => void)[] = [];

  connectedCallback(): void {
    this.stage = this.querySelector('[data-rw-stage]')!;
    this.actorsEl = this.querySelector('[data-rw-actors]')!;
    this.heroesEl = this.querySelector('[data-rw-heroes]')!;
    this.panelEl = this.querySelector('.rw__panel');
    this.liveEl = this.querySelector('[data-rw-live]');
    this.piecesEl = this.querySelector('[data-rw-pieces]');
    this.panelTitleEl = this.querySelector('[data-rw-panel-title]');
    this.yearBadgeEl = this.querySelector('[data-rw-year-badge]');
    this.autoBtn = this.querySelector('[data-rw-auto]');
    this.cursorEl = this.querySelector('[data-rw-cursor]');
    this.lbEl = this.querySelector('[data-rw-lb]');
    this.lbStageEl = this.querySelector('[data-rw-lb-stage]');
    this.lbKickerEl = this.querySelector('[data-rw-lb-kicker]');
    this.lbNameEl = this.querySelector('[data-rw-lb-name]');
    this.lbCloseBtn = this.querySelector('[data-rw-zoom-close]');

    this.heroes = Array.from(this.querySelectorAll<HTMLElement>('[data-rw-hero]'));
    this.ticks = Array.from(this.querySelectorAll<HTMLButtonElement>('[data-rw-tick]'));
    this.panels = Array.from(this.querySelectorAll<HTMLElement>('[data-rw-panel]'));
    this.roleButtons = Array.from(this.querySelectorAll<HTMLButtonElement>('[data-rw-role]'));
    this.yearButtons = Array.from(this.querySelectorAll<HTMLButtonElement>('[data-rw-year]'));

    this.mqlMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.reducedMotion = this.mqlMotion.matches;
    const onMotionChange = (e: MediaQueryListEvent) => {
      this.reducedMotion = e.matches;
      if (this.reducedMotion) {
        this.play(false);
        this.classList.add('is-revealed');
      }
    };
    this.mqlMotion.addEventListener('change', onMotionChange);
    this.cleanups.push(() => this.mqlMotion.removeEventListener('change', onMotionChange));

    this.classList.add('rw--js');

    this.renderAllPanels();
    this.syncRoleLabels();
    this.setupBodies();
    this.syncStageGroupMedia();
    this.setupImagesAndFeet();
    this.setupCursor();
    this.setupObservers();
    this.setupListeners();

    const startOffset = this.reducedMotion ? 0 : 1.15;
    this.index = 0;
    this.target = 0;
    this.cur = -startOffset;
    this.vel = 0;
    for (let a = 0; a < this.BODY_COUNT; a++) {
      const cb = this.classicBodies[a];
      cb.goal = a;
      cb.x = a + startOffset;
      cb.g = a + startOffset;
      cb.v = 0;
      cb.from = a + startOffset;
      cb.trip = false;
    }

    this.measure();
    this.setIndex(0, true);

    if (this.reducedMotion) {
      this.classList.add('is-revealed');
      this.cur = 0;
      this.setStill(true);
      this.renderAll();
    } else {
      this.kick();
      if (this.dataset.autoplay === 'true') {
        this.play(true);
      }
    }
  }

  disconnectedCallback(): void {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    if (this.cursorRaf) cancelAnimationFrame(this.cursorRaf);
    if (this.measureRaf) cancelAnimationFrame(this.measureRaf);
    window.clearTimeout(this.autoTimer);
    window.clearTimeout(this.resizeTimer);
    window.clearTimeout(this.wheelLock);
    window.clearTimeout(this.lbClearTimer);
    this.visObserver?.disconnect();
    this.revealObserver?.disconnect();
    this.stageResizeObserver?.disconnect();
    for (const fn of this.cleanups) fn();
    this.cleanups = [];
  }

  private renderBioCard(person: AmbassadorBio, cardIndex: number, year: string): HTMLElement {
    const li = document.createElement('li');
    li.className = 'rw__bio-card';
    li.dataset.rwCard = String(cardIndex);
    li.style.setProperty('--i', String(cardIndex));

    const header = document.createElement('div');
    header.className = 'rw__bio-header';

    const topRow = document.createElement('div');
    topRow.className = 'rw__bio-top';

    const badges = document.createElement('div');
    badges.className = 'rw__bio-badges';

    const pill = document.createElement('span');
    pill.className = `rw__role-pill${person.role === 'uni' ? ' is-uni' : ''}`;
    pill.textContent = person.rankLabel;

    const yearChip = document.createElement('span');
    yearChip.className = 'rw__bio-year-chip';
    yearChip.textContent = `Angkatan ${year}`;

    badges.append(pill, yearChip);

    topRow.append(badges);

    const nameHeading = document.createElement('h3');
    nameHeading.className = 'rw__bio-name';
    nameHeading.textContent = person.fullName;

    const roleDesc = document.createElement('p');
    roleDesc.className = 'rw__bio-role-desc';
    roleDesc.textContent = person.profession;

    header.append(topRow, nameHeading, roleDesc);

    const aboutSection = document.createElement('div');
    aboutSection.className = 'rw__bio-section';

    const aboutLabel = document.createElement('span');
    aboutLabel.className = 'rw__bio-section-label';
    aboutLabel.textContent = 'Biografi Singkat';

    const bioText = document.createElement('p');
    bioText.className = 'rw__bio-text';
    bioText.textContent = person.bio;

    aboutSection.append(aboutLabel, bioText);

    const metaCard = document.createElement('div');
    metaCard.className = 'rw__bio-meta-grid';

    const rows: {label: string; value: string; icon: string}[] = [
      {
        label: 'Utusan Daerah',
        value: `${person.region}, Provinsi Sumatera Barat`,
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 21s-6-5.33-6-10a6 6 0 1 1 12 0c0 4.67-6 10-6 10Z"/><circle cx="12" cy="11" r="2.2"/></svg>',
      },
      {
        label: 'Pendidikan',
        value: person.education,
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M22 10L12 5 2 10l10 5 10-5Z"/><path d="M6 12.5V17c0 1.66 2.69 3 6 3s6-1.34 6-3v-4.5"/></svg>',
      },
      {
        label: 'Fokus Advokasi',
        value: person.advocacy,
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="m14.8 9.2-1.7 4.9-4.9 1.7 1.7-4.9 4.9-1.7Z"/></svg>',
      },
      {
        label: 'Prestasi & Mandat',
        value: person.achievement,
        icon: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="8.5" r="5.5"/><path d="M8.5 13.5 7 21l5-2.5L17 21l-1.5-7.5"/></svg>',
      },
    ];

    for (const item of rows) {
      const row = document.createElement('div');
      row.className = 'rw__bio-meta-row';

      const iconBox = document.createElement('span');
      iconBox.className = 'rw__bio-meta-icon';
      iconBox.innerHTML = item.icon;

      const copy = document.createElement('div');
      copy.className = 'rw__bio-meta-copy';

      const span = document.createElement('span');
      span.textContent = item.label;
      const strong = document.createElement('strong');
      strong.textContent = item.value;

      copy.append(span, strong);
      row.append(iconBox, copy);
      metaCard.appendChild(row);
    }

    li.append(header, aboutSection, metaCard);
    return li;
  }

  private getActiveYearLineup(): YearLineup {
    return YEAR_CONTINGENTS.find((y) => y.year === this.activeYear) ?? YEAR_CONTINGENTS[0];
  }

  private renderAllPanels(): void {
    const lineup = this.getActiveYearLineup();
    for (let i = 0; i < this.LOOK_COUNT; i++) {
      const panel = this.panels[i];
      if (!panel) continue;
      panel.innerHTML = '';

      const udaPerson = lineup.uda[i];
      const uniPerson = lineup.uni[i];
      if (!udaPerson || !uniPerson) continue;

      const mhead = document.createElement('div');
      mhead.className = 'rw__mhead';
      const mTitle = document.createElement('span');
      mTitle.className = 'rw__mhead-title';
      const mLabel = document.createElement('span');
      mLabel.className = 'rw__label';

      const ul = document.createElement('ul');
      ul.className = 'rw__items';
      ul.setAttribute('role', 'list');

      if (this.activePanelRole === 'uda') {
        mTitle.textContent = `${udaPerson.shortName} - ${lineup.year}`;
        mLabel.textContent = udaPerson.rankLabel;
        ul.appendChild(this.renderBioCard(udaPerson, 1, lineup.year));
      } else {
        mTitle.textContent = `${uniPerson.shortName} - ${lineup.year}`;
        mLabel.textContent = uniPerson.rankLabel;
        ul.appendChild(this.renderBioCard(uniPerson, 2, lineup.year));
      }

      mhead.append(mTitle, mLabel);
      panel.append(mhead, ul);
    }
  }

  private syncRoleLabels(): void {
    this.roleButtons.forEach((btn) => {
      const r = (btn.dataset.rwRole as RoleFilter) || 'uda';
      const active = r === this.roleFilter;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    const roleSwitchEl = this.querySelector<HTMLElement>('.rw__role-switch');
    if (roleSwitchEl) {
      roleSwitchEl.dataset.activeRole = this.roleFilter;
    }

    this.yearButtons.forEach((btn) => {
      const y = btn.dataset.rwYear || '';
      const active = y === this.activeYear;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    if (this.panelTitleEl) {
      this.panelTitleEl.textContent = this.activePanelRole === 'uda' ? 'Profil Uda' : 'Profil Uni';
    }

    const lineup = this.getActiveYearLineup();
    const list = this.roleFilter === 'uda' ? lineup.uda : lineup.uni;

    if (this.yearBadgeEl) {
      this.yearBadgeEl.textContent = `Pemilihan ${lineup.year}`;
    }

    if (this.piecesEl) {
      this.piecesEl.textContent = `Angkatan ${lineup.year}`;
      this.piecesEl.classList.remove('is-swap');
      void this.piecesEl.offsetWidth;
      this.piecesEl.classList.add('is-swap');
    }

    this.ticks.forEach((tick, idx) => {
      const person = list[idx];
      if (!person) return;
      const labelText = `${person.shortName} · ${person.region}`;
      const nameSpan = tick.querySelector('.rw__tick-name');
      if (nameSpan) {
        nameSpan.innerHTML = `&nbsp;&nbsp;${labelText}`;
      }
      tick.setAttribute('aria-label', `${person.rankLabel} ${lineup.year}: ${labelText}`);
    });

    this.heroes.forEach((hero, idx) => {
      const person = list[idx];
      if (!person) return;
      const labelText = `${person.shortName} (${person.region}) - ${lineup.year}`;
      hero.dataset.name = labelText;
      hero.dataset.label = `${person.rankLabel} ${lineup.year}: ${labelText}`;
    });

    if (this.zoomed && this.lbKickerEl) {
      const person = list[this.index];
      if (person) this.lbKickerEl.textContent = `${lineup.year} · ${person.rankLabel}`;
    }
    if (this.zoomed && this.lbNameEl) {
      this.lbNameEl.textContent = this.heroes[this.index]?.dataset.name || '';
    }

    this.emitStateChange();
  }

  private emitStateChange(): void {
    this.dispatchEvent(new CustomEvent('rw:statechange', {bubbles: true}));
  }

  public toggleAutoplay(): void {
    if (!this.playing) this.engaged = false;
    this.play(!this.playing);
  }

  public openActiveProfile(): void {
    this.engage();
    this.focusParticipant(this.getEffectivePanelRole());
  }

  public getActiveSummary(): {
    year: string;
    index: number;
    total: number;
    shortName: string;
    region: string;
    playing: boolean;
    zoomed: boolean;
  } {
    const lineup = this.getActiveYearLineup();
    const list = this.roleFilter === 'uda' ? lineup.uda : lineup.uni;
    const person = list[this.index] ?? list[0];
    return {
      year: lineup.year,
      index: this.index + 1,
      total: this.LOOK_COUNT,
      shortName: person?.shortName ?? '',
      region: person?.region ?? '',
      playing: this.playing,
      zoomed: this.zoomed,
    };
  }

  private syncStageGroupMedia(): void {
    const isUda = this.roleFilter === 'uda';
    const lineup = this.getActiveYearLineup();
    const list = isUda ? lineup.uda : lineup.uni;
    const photoSet = isUda ? UNI_PHOTOS : UDA_PHOTOS;
    // Slight per-year rotational offset using available assets so changing year/role always updates gallery visuals cleanly
    const yearIdx = YEAR_CONTINGENTS.findIndex((y) => y.year === lineup.year);
    const offset = yearIdx >= 0 ? yearIdx : 0;

    for (let idx = 0; idx < this.LOOK_COUNT; idx++) {
      const person = list[idx];
      if (!person) continue;
      const basePhotos = isUda ? UDA_PHOTOS : UNI_PHOTOS;
      const photo = basePhotos[(idx + offset) % basePhotos.length] ?? photoSet[idx];
      const altText = `${person.shortName} (${person.region}) - ${lineup.year}`;
      const srcset = `${photo.thumb} 640w, ${photo.full} 1080w`;

      const hero = this.heroes[idx];
      if (hero) {
        hero.dataset.probe = photo.thumb;
        const img = hero.querySelector<HTMLImageElement>('[data-model-image]');
        if (img) {
          img.alt = altText;
          if (img.src !== photo.thumb) {
            img.src = photo.thumb;
            img.srcset = srcset;
            decodeModelImage(img);
          }
        }
        const zBtn = hero.querySelector<HTMLButtonElement>('[data-rw-zoom]');
        if (zBtn) {
          zBtn.setAttribute('aria-label', `Lihat profil: ${altText}`);
        }
      }

      this.actorsEl
        .querySelectorAll<HTMLElement>(`.rw__model[data-index="${idx}"]`)
        .forEach((modelEl) => {
          const img = modelEl.querySelector<HTMLImageElement>('[data-model-image]');
          if (img) {
            img.alt = altText;
            if (img.src !== photo.thumb) {
              img.src = photo.thumb;
              img.srcset = srcset;
              decodeModelImage(img);
            }
          }
          const hitBtn = modelEl.querySelector<HTMLButtonElement>('[data-rw-go]');
          if (hitBtn) {
            hitBtn.setAttribute('aria-label', `${person.rankLabel} ${lineup.year}: ${altText}`);
          }
        });
    }

    if (this.zoomed && this.lbStageEl) {
      const person = list[this.index];
      const basePhotos = isUda ? UDA_PHOTOS : UNI_PHOTOS;
      const photo = basePhotos[(this.index + offset) % basePhotos.length] ?? basePhotos[this.index];
      const lbImg = this.lbStageEl.querySelector<HTMLImageElement>('.rw__lb-model [data-model-image]');
      if (person && lbImg) {
        lbImg.alt = `${person.shortName} - ${lineup.year}`;
        if (lbImg.src !== photo.thumb) {
          lbImg.src = photo.thumb;
          lbImg.srcset = `${photo.thumb} 640w, ${photo.full} 1080w`;
          decodeModelImage(lbImg);
        }
      }
    }
  }

  private getEffectivePanelRole(): 'uda' | 'uni' {
    return this.roleFilter;
  }

  public openPanel(role?: 'uda' | 'uni', syncMeasure = false): void {
    const nextRole = role ?? this.getEffectivePanelRole();
    const roleChanged = this.activePanelRole !== nextRole || this.roleFilter !== nextRole;
    this.activePanelRole = nextRole;
    this.roleFilter = nextRole;

    if (roleChanged) {
      this.renderAllPanels();
      this.syncStageGroupMedia();
      this.setupImagesAndFeet();
    }
    this.syncRoleLabels();

    if (!this.panelOpen) {
      this.panelOpen = true;
      this.classList.add('is-panel-open');
      this.panelEl?.setAttribute('aria-hidden', 'false');
      if (syncMeasure) {
        this.measure();
      } else {
        this.scheduleMeasure();
      }
    }

    const activePanel = this.panels[this.index];
    if (activePanel) {
      activePanel.classList.remove('is-in');
      void activePanel.offsetWidth;
      activePanel.classList.add('is-in');
    }

    this.hot(nextRole === 'uda' ? 1 : 2, false);
  }

  public closePanel(syncMeasure = false): void {
    if (!this.panelOpen) return;
    this.panelOpen = false;
    this.classList.remove('is-panel-open');
    this.panelEl?.setAttribute('aria-hidden', 'true');
    this.hot(null);
    if (syncMeasure) {
      this.measure();
    } else {
      this.scheduleMeasure();
    }
  }

  public focusParticipant(role?: 'uda' | 'uni', fromRect?: DOMRect): void {
    const chosenRole = role ?? this.getEffectivePanelRole();
    const sourceRect =
      fromRect ??
      this.heroes[this.index]?.querySelector<HTMLElement>('.rw__figure')?.getBoundingClientRect();

    this.openPanel(chosenRole, true);
    if (!this.zoomed) {
      this.openZoom(sourceRect);
    }
    this.hot(chosenRole === 'uda' ? 1 : 2, false);
  }

  public closeProfileView(): void {
    this.closePanel(true);
    this.closeZoom();
  }

  public setYear(year: string, resetSlot = true): void {
    if (!YEAR_CONTINGENTS.some((y) => y.year === year)) return;
    const changed = this.activeYear !== year;
    this.activeYear = year;

    if (changed) {
      this.renderAllPanels();
      this.syncRoleLabels();
      this.syncStageGroupMedia();
      this.setupImagesAndFeet();
      if (resetSlot && this.index !== 0) {
        this.go(0);
      }
      if (!this.reducedMotion && !this.zoomed) {
        this.stage.classList.remove('is-sweep');
        void this.stage.offsetWidth;
        this.stage.classList.add('is-sweep');
      }
    }
  }

  public setRoleFilter(role: RoleFilter): void {
    const changed = this.roleFilter !== role || this.activePanelRole !== role;
    this.roleFilter = role;
    this.activePanelRole = role;

    if (changed) {
      this.renderAllPanels();
      this.syncRoleLabels();
      this.syncStageGroupMedia();
      this.setupImagesAndFeet();
      if (!this.reducedMotion && !this.zoomed) {
        this.stage.classList.remove('is-sweep');
        void this.stage.offsetWidth;
        this.stage.classList.add('is-sweep');
      }
    }

    if (this.panelOpen) {
      const activePanel = this.panels[this.index];
      if (activePanel && changed) {
        activePanel.classList.remove('is-in');
        void activePanel.offsetWidth;
        activePanel.classList.add('is-in');
      }
      this.hot(this.activePanelRole === 'uda' ? 1 : 2, false);
    }
  }

  public goToProfile(slotIdx: number, role: RoleFilter = 'uda', year?: string): void {
    this.engage();
    if (year && year !== this.activeYear) {
      this.setYear(year, false);
    }
    this.setRoleFilter(role);
    this.go(slotIdx);
    this.focusParticipant(role);
    window.setTimeout(() => this.hot(role === 'uda' ? 1 : 2, true), 60);
  }

  private setupBodies(): void {
    const originals = Array.from(this.actorsEl.querySelectorAll<HTMLElement>('[data-rw-model]'));
    for (let i = 0; i < originals.length; i++) {
      const clone = originals[i].cloneNode(true) as HTMLElement;
      clone.setAttribute('data-rw-clone', '');
      clone.dataset.index = String(i);
      clone.querySelectorAll('img').forEach((img) => {
        img.loading = 'lazy';
      });
      this.actorsEl.appendChild(clone);
    }

    const allBodies = Array.from(this.actorsEl.querySelectorAll<HTMLElement>('[data-rw-model]'));
    this.ringBodies = allBodies.map((el, a) => ({
      el,
      idx: a % this.LOOK_COUNT,
      w: 315,
      lastBlur: '',
    }));
    this.classicBodies = allBodies.map((el, a) => ({
      el,
      idx: a % this.LOOK_COUNT,
      x: a,
      g: a,
      v: 0,
      from: a,
      goal: a,
      trip: false,
      w: 315,
      lastBlur: '',
    }));
  }

  private setupImagesAndFeet(): void {
    this.querySelectorAll<HTMLImageElement>('[data-model-image]').forEach(decodeModelImage);

    for (const hero of this.heroes) {
      const probeUrl = hero.dataset.probe;
      const idx = hero.dataset.index;
      if (!probeUrl || idx === undefined) continue;

      const probe = new Image();
      probe.crossOrigin = 'anonymous';
      probe.onload = () => {
        try {
          if (!probe.naturalWidth || !probe.naturalHeight) return;
          const w = 48;
          const h = Math.max(1, Math.round((w * probe.naturalHeight) / probe.naturalWidth));
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (!ctx) return;
          ctx.drawImage(probe, 0, 0, w, h);
          const data = ctx.getImageData(0, 0, w, h).data;
          let lastRow = h - 1;
          let found = false;
          for (let y = h - 1; y >= 0; y--) {
            for (let x = 0; x < w; x++) {
              if (data[(y * w + x) * 4 + 3] > 40) {
                lastRow = y;
                found = true;
                break;
              }
            }
            if (found) break;
          }
          if (!found) return;
          const foot = clamp((h - 1 - lastRow) / h, 0, 0.4);
          const footStr = foot.toFixed(4);
          hero.style.setProperty('--rw-foot', footStr);
          this.actorsEl
            .querySelectorAll<HTMLElement>(`.rw__model[data-index="${idx}"]`)
            .forEach((m) => m.style.setProperty('--rw-foot', footStr));
        } catch {
          // Tainted canvas silently keeps offset 0
        }
      };
      probe.src = probeUrl;
    }
  }

  private setupCursor(): void {
    this.cursorHoverCapable = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!this.cursorHoverCapable) {
      this.cursorEl?.remove();
      this.cursorEl = null;
      return;
    }

    this.classList.add('rw--cursor');
    let entered = false;

    const updateHoverTargets = (target: EventTarget | null) => {
      if (!this.cursorEl) return;
      const el = target as HTMLElement | null;
      const isZoom = Boolean(!this.dragging && el?.closest('.rw__zoom'));
      const isLink = Boolean(!this.dragging && el?.closest('.rw__pin, .rw__hit'));
      this.cursorEl.classList.toggle('is-view', isZoom && !isLink);
      this.cursorEl.classList.toggle('is-link', isLink);
    };

    const stepCursor = () => {
      if (!this.cursorEl) {
        this.cursorRaf = 0;
        return;
      }
      const lerp = this.reducedMotion ? 1 : 0.18;
      this.cursorX += (this.cursorTargetX - this.cursorX) * lerp;
      this.cursorY += (this.cursorTargetY - this.cursorY) * lerp;
      this.cursorEl.style.transform = `translate3d(${this.cursorX.toFixed(2)}px, ${this.cursorY.toFixed(2)}px, 0)`;

      if (
        Math.abs(this.cursorTargetX - this.cursorX) < 0.2 &&
        Math.abs(this.cursorTargetY - this.cursorY) < 0.2
      ) {
        this.cursorX = this.cursorTargetX;
        this.cursorY = this.cursorTargetY;
        this.cursorEl.style.transform = `translate3d(${this.cursorX.toFixed(2)}px, ${this.cursorY.toFixed(2)}px, 0)`;
        this.cursorRaf = 0;
        return;
      }
      this.cursorRaf = requestAnimationFrame(stepCursor);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || !this.cursorEl) return;
      const rect = this.stage.getBoundingClientRect();
      this.cursorTargetX = e.clientX - rect.left;
      this.cursorTargetY = e.clientY - rect.top;

      if (!entered) {
        entered = true;
        this.cursorX = this.cursorTargetX;
        this.cursorY = this.cursorTargetY;
        this.cursorEl.style.transform = `translate3d(${this.cursorX.toFixed(2)}px, ${this.cursorY.toFixed(2)}px, 0)`;
        this.cursorEl.classList.add('is-on');
      }

      updateHoverTargets(e.target);

      if (!this.cursorRaf) {
        this.cursorRaf = requestAnimationFrame(stepCursor);
      }
    };

    const onLeave = () => {
      entered = false;
      this.cursorEl?.classList.remove('is-on', 'is-link', 'is-view');
    };

    this.stage.addEventListener('pointermove', onMove);
    this.stage.addEventListener('pointerleave', onLeave);
    this.cleanups.push(() => {
      this.stage.removeEventListener('pointermove', onMove);
      this.stage.removeEventListener('pointerleave', onLeave);
    });
  }

  private setupObservers(): void {
    this.visObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          this.visible = entry.isIntersecting;
          if (this.visible) {
            this.kick();
            if (this.playing) this.scheduleAutoplay();
          } else {
            window.clearTimeout(this.autoTimer);
          }
        }
      },
      {threshold: 0},
    );
    this.visObserver.observe(this);

    if (!this.reducedMotion) {
      this.revealObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            this.revealObserver?.unobserve(this);
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                this.classList.add('is-revealed');
                this.kick();
              });
            });
          }
        },
        {threshold: 0, rootMargin: '0px 0px -22% 0px'},
      );
      this.revealObserver.observe(this);
    }

    this.stageResizeObserver = new ResizeObserver(() => {
      this.scheduleMeasure();
    });
    this.stageResizeObserver.observe(this.stage);
  }

  private scheduleMeasure(): void {
    if (this.measureRaf) return;
    this.measureRaf = requestAnimationFrame(() => {
      this.measureRaf = 0;
      this.measure();
    });
  }

  private setupListeners(): void {
    const onResize = () => {
      window.clearTimeout(this.resizeTimer);
      this.resizeTimer = window.setTimeout(() => this.measure(), 120);
    };
    window.addEventListener('resize', onResize);
    this.cleanups.push(() => window.removeEventListener('resize', onResize));

    const onVisibility = () => {
      if (!document.hidden && this.visible) {
        this.lastTs = 0;
        this.kick();
        if (this.playing) this.scheduleAutoplay();
      } else {
        window.clearTimeout(this.autoTimer);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    this.cleanups.push(() => document.removeEventListener('visibilitychange', onVisibility));

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      if (this.zoomed) return;
      this.dragPointerId = e.pointerId;
      this.dragStartX = e.clientX;
      this.dragStartY = e.clientY;
      this.dragStartTarget = this.target;
      this.dragActive = false;
      this.dragAbandoned = false;
      this.dragSamples = [{x: e.clientX, time: performance.now()}];
    };

    const onPointerMove = (e: PointerEvent) => {
      if (this.dragPointerId !== e.pointerId || this.dragAbandoned) return;
      if (e.pointerType === 'mouse' && (e.buttons & 1) === 0) {
        endDrag(e);
        return;
      }

      const dx = e.clientX - this.dragStartX;
      const dy = e.clientY - this.dragStartY;

      if (!this.dragActive) {
        if (Math.abs(dy) > 10 && Math.abs(dy) >= Math.abs(dx)) {
          this.dragAbandoned = true;
          this.dragPointerId = null;
          return;
        }
        if (Math.abs(dx) > 8 && Math.abs(dx) > 1.2 * Math.abs(dy)) {
          this.dragActive = true;
          this.dragging = true;
          this.classList.add('is-dragging');
          this.cursorEl?.classList.remove('is-view', 'is-link');
          try {
            this.stage.setPointerCapture(e.pointerId);
          } catch {
            // ignore
          }
          this.setStill(false);
        } else {
          return;
        }
      }

      this.dragSamples.push({x: e.clientX, time: performance.now()});
      if (this.dragSamples.length > 6) this.dragSamples.shift();

      this.target = this.dragStartTarget - dx / this.unit;
      this.kick();
    };

    const endDrag = (e: PointerEvent) => {
      if (this.dragPointerId !== e.pointerId) return;
      this.dragPointerId = null;
      if (!this.dragActive) return;

      this.dragActive = false;
      this.dragging = false;
      this.classList.remove('is-dragging');
      this.suppressClickUntil = performance.now() + 60;

      try {
        if (this.stage.hasPointerCapture(e.pointerId)) {
          this.stage.releasePointerCapture(e.pointerId);
        }
      } catch {
        // ignore
      }

      const first = this.dragSamples[0];
      const last = this.dragSamples[this.dragSamples.length - 1];
      const dt = last && first ? Math.max(1, last.time - first.time) : 1;
      const vx = last && first && last !== first ? (last.x - first.x) / dt : 0;
      const dx = e.clientX - this.dragStartX;
      const from = Math.round(this.dragStartTarget);
      const sign = -1;

      if (this.isMobile) {
        if (Math.abs(dx) > 30 || Math.abs(vx) > 0.3) {
          this.moveTo(from + sign * (dx > 0 ? 1 : -1));
        } else {
          this.moveTo(from);
        }
      } else {
        let i = Math.round(this.target + (sign * vx * 160) / this.unit);
        if (i === from && Math.abs(vx) > 0.3) {
          i = from + (vx < 0 ? 1 : -1);
        }
        i = clamp(i, from - 2, from + 2);
        this.moveTo(i);
      }
    };

    this.stage.addEventListener('pointerdown', onPointerDown);
    this.stage.addEventListener('pointermove', onPointerMove);
    this.stage.addEventListener('pointerup', endDrag);
    this.stage.addEventListener('pointercancel', endDrag);
    this.cleanups.push(() => {
      this.stage.removeEventListener('pointerdown', onPointerDown);
      this.stage.removeEventListener('pointermove', onPointerMove);
      this.stage.removeEventListener('pointerup', endDrag);
      this.stage.removeEventListener('pointercancel', endDrag);
    });

    const onCaptureClick = (e: MouseEvent) => {
      if (performance.now() < this.suppressClickUntil) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    this.stage.addEventListener('click', onCaptureClick, true);
    this.cleanups.push(() => this.stage.removeEventListener('click', onCaptureClick, true));

    const onWheel = (e: WheelEvent) => {
      if (this.zoomed) return;
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      if (this.wheelLock) return;
      this.wheelAcc += e.deltaX;
      if (Math.abs(this.wheelAcc) > 45) {
        if (this.wheelAcc > 0) this.next();
        else this.prev();
        this.wheelAcc = 0;
        this.wheelLock = window.setTimeout(() => {
          this.wheelLock = 0;
          this.wheelAcc = 0;
        }, 520);
      }
    };
    this.stage.addEventListener('wheel', onWheel, {passive: false});
    this.cleanups.push(() => this.stage.removeEventListener('wheel', onWheel));

    const onStageKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        this.next();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        this.prev();
      }
    };
    this.stage.addEventListener('keydown', onStageKeyDown);
    this.cleanups.push(() => this.stage.removeEventListener('keydown', onStageKeyDown));

    const onSectionKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && (this.zoomed || this.panelOpen)) {
        this.closeProfileView();
      }
    };
    this.addEventListener('keydown', onSectionKeyDown);
    this.cleanups.push(() => this.removeEventListener('keydown', onSectionKeyDown));

    const panel = this.querySelector<HTMLElement>('.rw__panel');
    if (panel) {
      const onPanelEnter = (e: PointerEvent) => {
        if (e.pointerType === 'mouse') {
          this.panelHover = true;
          this.restartAutoplayBar();
        }
      };
      const onPanelLeave = (e: PointerEvent) => {
        if (e.pointerType === 'mouse') {
          this.panelHover = false;
          this.restartAutoplayBar();
        }
      };
      const onPanelClick = (e: MouseEvent) => {
        const t = e.target as HTMLElement | null;
        if (t?.closest('button, a')) {
          this.engage();
        }
      };
      const onCardOver = (e: PointerEvent) => {
        if (e.pointerType !== 'mouse') return;
        const card = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-rw-card]');
        if (card?.dataset.rwCard) {
          this.hot(Number(card.dataset.rwCard), false);
        }
      };
      const onCardOut = (e: PointerEvent) => {
        if (e.pointerType !== 'mouse') return;
        const card = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-rw-card]');
        if (!card) return;
        const rel = e.relatedTarget as Node | null;
        if (!rel || !card.contains(rel)) {
          this.hot(null);
        }
      };

      panel.addEventListener('pointerenter', onPanelEnter);
      panel.addEventListener('pointerleave', onPanelLeave);
      panel.addEventListener('click', onPanelClick);
      panel.addEventListener('pointerover', onCardOver);
      panel.addEventListener('pointerout', onCardOut);
      this.cleanups.push(() => {
        panel.removeEventListener('pointerenter', onPanelEnter);
        panel.removeEventListener('pointerleave', onPanelLeave);
        panel.removeEventListener('click', onPanelClick);
        panel.removeEventListener('pointerover', onCardOver);
        panel.removeEventListener('pointerout', onCardOut);
      });
    }

    const onSectionClick = (e: MouseEvent) => {
      this.handleClickTarget(e.target as HTMLElement | null, e);
    };
    this.addEventListener('click', onSectionClick);
    this.cleanups.push(() => this.removeEventListener('click', onSectionClick));
  }

  private handleClickTarget(t: HTMLElement | null, event?: MouseEvent): void {
    if (!t) return;

    // 0. stage role switcher buttons (Uda / Uni)
    const roleBtn = t.closest<HTMLButtonElement>('[data-rw-role]');
    if (roleBtn?.dataset.rwRole) {
      this.engage();
      this.setRoleFilter(roleBtn.dataset.rwRole as RoleFilter);
      return;
    }

    // 0-year. year selector pills (2025..2020)
    const yearBtn = t.closest<HTMLButtonElement>('[data-rw-year]');
    if (yearBtn?.dataset.rwYear) {
      this.engage();
      this.setYear(yearBtn.dataset.rwYear, true);
      return;
    }

    // 0a. close panel button closes both panel & zoom back to full-width homepage
    if (t.closest('[data-rw-panel-close]')) {
      this.engage();
      this.closeProfileView();
      return;
    }

    // 1. popup close button closes both zoom & panel back to full-width homepage
    if (t.closest('[data-rw-zoom-close]')) {
      this.closeProfileView();
      return;
    }

    // 2. click on popup backdrop or stage beside model closes both zoom & panel
    if (
      this.zoomed &&
      (t === this.lbEl || t === this.lbStageEl || (t.closest('.rw__lb') && !t.closest('.rw__lb-model, .rw__lb-top')))
    ) {
      this.closeProfileView();
      return;
    }

    // 3. clicking the active participant image zooms in & opens the right detail panel
    if (t.closest('[data-rw-zoom]')) {
      this.engage();
      this.focusParticipant(this.getEffectivePanelRole());
      return;
    }

    // 4. next
    if (t.closest('[data-rw-next]')) {
      this.next();
      return;
    }

    // 5. prev
    if (t.closest('[data-rw-prev]')) {
      this.prev();
      return;
    }

    // 6. tick
    const tick = t.closest<HTMLElement>('[data-rw-tick]');
    if (tick) {
      this.go(Number(tick.dataset.rwTick));
      return;
    }

    // 7. autoplay toggle
    if (t.closest('[data-rw-auto]')) {
      if (!this.playing) this.engaged = false;
      this.play(!this.playing);
      return;
    }

    // 8. pin click zooms in (if not zoomed) & opens the clicked Uda (1) or Uni (2) profile
    const pin = t.closest<HTMLElement>('[data-rw-pin]');
    if (pin) {
      this.engage();
      const pinNum = Number(pin.dataset.rwPin);
      const pinRole: 'uda' | 'uni' = pinNum === 2 ? 'uni' : 'uda';
      if (this.zoomed) {
        this.openPanel(pinRole);
      } else {
        this.focusParticipant(pinRole);
      }
      this.hot(pinNum, true);
      return;
    }

    // 9. clicking any participant image in the ring [data-rw-go] isolates & zooms in on them + opens detail panel
    const goBtn = t.closest<HTMLElement>('[data-rw-go]');
    if (goBtn) {
      this.engage();
      const modelEl = goBtn.closest<HTMLElement>('[data-rw-model]');
      const bodyIdx = this.ringBodies.findIndex((b) => b.el === modelEl);
      if (bodyIdx !== -1) {
        const base = Math.round(this.target);
        let k = (((bodyIdx - base) % this.BODY_COUNT) + this.BODY_COUNT) % this.BODY_COUNT;
        if (k > this.BODY_COUNT / 2) k -= this.BODY_COUNT;
        if (k === 0) {
          this.focusParticipant(this.getEffectivePanelRole());
        } else if (Math.abs(k) < 6) {
          const startRect = modelEl?.querySelector<HTMLElement>('.rw__figure')?.getBoundingClientRect();
          this.moveTo(base + k);
          this.focusParticipant(this.getEffectivePanelRole(), startRect);
        }
      }
      return;
    }

    // 10. clicking bio card title / pin icon highlights corresponding pin on stage
    const focusBtn = t.closest<HTMLElement>('[data-rw-focus-card]');
    if (focusBtn) {
      event?.preventDefault();
      const card = focusBtn.closest<HTMLElement>('[data-rw-card]');
      if (card?.dataset.rwCard) {
        this.engage();
        const cardNum = Number(card.dataset.rwCard);
        this.hot(cardNum, true);
      }
    }
  }

  public goToLook(i: number): void {
    this.engage();
    this.go(i);
  }

  private measure(): void {
    this.isMobile = window.innerWidth <= 749;
    this.mode = this.isMobile ? 'classic' : 'ring';

    if (
      this.latchedVh === 0 ||
      this.latchedW !== window.innerWidth ||
      Math.abs(window.innerHeight - this.latchedVh) >= 160
    ) {
      this.latchedVh = window.innerHeight;
      this.latchedW = window.innerWidth;
    }

    let frameH: number;
    if (!this.isMobile) {
      let headerH = 0;
      document
        .querySelectorAll<HTMLElement>(
          '.shopify-section-group-header-group, #shopify-section-header, #shopify-section-announcement-bar',
        )
        .forEach((el) => {
          if (!el.contains(this) && el.offsetParent !== null) {
            headerH += el.getBoundingClientRect().height;
          }
        });
      frameH = Math.max(380, Math.round(window.innerHeight - headerH));
    } else {
      const pct = clamp(Number(this.dataset.mheightVh || 109), 50, 120);
      frameH = Math.round((this.latchedVh * pct) / 100);
    }
    if (this.lastFrameH !== frameH) {
      this.lastFrameH = frameH;
      this.style.setProperty('--rw-frame-h', `${frameH}px`);
    }

    const rect = this.stage.getBoundingClientRect();
    this.W = rect.width || this.stage.clientWidth || 800;
    this.H = rect.height || this.stage.clientHeight || 600;

    this.fs = this.mode === 'ring' ? 1.08 : 1;
    this.stage.style.setProperty('--rw-fs', String(this.fs));

    let modelH: number;
    if (this.mode === 'ring') {
      modelH = Math.max(200, Math.round((this.H - 34 - 18) / 1.08));
    } else {
      modelH = Math.max(200, Math.round(this.H - (this.isMobile ? 24 : 36) - 18));
    }
    if (this.lastModelH !== modelH) {
      this.lastModelH = modelH;
      this.stage.style.setProperty('--rw-model-h', `${modelH}px`);
    }

    let hx: number;
    let hy: number;
    if (this.mode === 'ring') {
      hx = 0.5 * this.W;
      hy = 34;
      this.unit = Math.max(this.isMobile ? 90 : 120, 0.3 * this.W);
    } else if (this.isMobile) {
      hx = 0.3 * this.W;
      hy = 22;
      this.unit = Math.max(90, this.W * 0.32 * 1.6);
    } else {
      hx = 0.4 * this.W;
      hy = 36;
      this.unit = Math.max(120, this.W * 0.125 * 1.6);
    }

    this.stage.style.setProperty('--rw-hx', `${hx.toFixed(1)}px`);
    this.stage.style.setProperty('--rw-hy', `${hy}px`);
    this.style.setProperty('--rw-ax', `${((hx / Math.max(1, this.W)) * 100).toFixed(2)}%`);

    const approxW = Math.round(modelH * 0.5625);
    for (let i = 0; i < this.BODY_COUNT; i++) {
      const w = this.ringBodies[i].el.offsetWidth || approxW;
      this.ringBodies[i].w = w;
      this.classicBodies[i].w = w;
    }

    if (this.zoomed && this.lbStageEl) {
      const lbModel = this.lbStageEl.querySelector<HTMLElement>('.rw__lb-model');
      if (lbModel) {
        const sr = this.lbStageEl.getBoundingClientRect();
        const h = Math.max(160, Math.round(Math.min(sr.height, sr.width / 0.5625)));
        lbModel.style.setProperty('--rw-model-h', `${h}px`);
        lbModel
          .querySelectorAll<HTMLImageElement>('[data-model-image]')
          .forEach((img) => (img.sizes = `${Math.round(h * 0.5625)}px`));
      }
    }

    this.renderAll();
  }

  private setStill(v: boolean): void {
    if (this.still === v) return;
    this.still = v;
    this.classList.toggle('rw--still', v);
  }

  private put(
    s: RingBodyState | ClassicBodyState,
    x: number,
    bottom: number,
    scale: number,
    opacity: number,
    blur: number,
    z: number,
  ): void {
    let op = opacity;
    if (x + (s.w * scale) / 2 < -4 || x - (s.w * scale) / 2 > this.W + 4) {
      op = 0;
    }

    s.el.style.transform = `translate3d(${x.toFixed(2)}px, ${(-bottom).toFixed(2)}px, 0) translateX(-50%) scale(${scale.toFixed(4)})`;
    s.el.style.opacity = op.toFixed(3);
    s.el.style.zIndex = String(z);
    s.el.style.visibility = op < 0.01 ? 'hidden' : 'visible';
    s.el.style.pointerEvents = op < 0.5 ? 'none' : 'auto';

    const blurStr = blur > 0.05 ? `blur(${blur.toFixed(1)}px)` : '';
    if (s.lastBlur !== blurStr) {
      s.el.style.filter = blurStr;
      s.lastBlur = blurStr;
    }
  }

  private renderAll(): void {
    const W = this.W;
    const H = this.H;
    const N = this.BODY_COUNT;

    if (this.mode === 'ring') {
      const cx = 0.5 * W;
      const R = (this.isMobile ? 0.72 : 0.62) * W;
      const P = (this.isMobile ? 1.9 : 1.65) * W;
      const floor = H - 34;
      const horizon = 0.36 * H;
      const step = (2 * Math.PI) / N;

      for (let a = 0; a < N; a++) {
        const s = this.ringBodies[a];
        let phi = ((a - this.cur) * step) % (2 * Math.PI);
        while (phi <= -Math.PI) phi += 2 * Math.PI;
        while (phi > Math.PI) phi -= 2 * Math.PI;

        const zDepth = R * (1 - Math.cos(phi));
        const persp = P / (P + zDepth);
        const sl = Math.abs(phi) / step;
        const scale = persp * (1 + (this.fs - 1) * clamp(1 - sl, 0, 1));
        const x = cx + R * Math.sin(phi) * persp;
        const feet = horizon + (floor - horizon) * persp;
        const bottom = H - feet;
        const blur = sl <= 1 ? 1.8 * sl : Math.min(1.8 + (sl - 1) * 2, 6.5);
        let opacity = clamp((Math.cos(phi) + 0.55) / 0.3, 0, 1);
        if (this.still && sl < 0.02) opacity = 0;
        const zIdx = Math.round(scale * 1000);

        this.put(s, x, bottom, scale, opacity, blur, zIdx);
      }
      return;
    }

    const ax = this.isMobile ? 0.3 : 0.4;
    const ay = this.isMobile ? 22 : 36;
    const sx = this.isMobile ? 0.32 : 0.125;
    const sy = this.isMobile ? 22 : 58;
    const sr = 0.76;
    const ex = this.isMobile ? 0.55 : 0.38;
    const d = this.isMobile ? 4 : 5;

    for (let a = 0; a < N; a++) {
      const s = this.classicBodies[a];
      let k = s.x;
      let e = -1;

      if (s.trip) {
        const denom = Math.abs(s.goal - s.from);
        const u = denom > 1e-4 ? Math.abs(s.x - s.from) / denom : 1;
        if (s.goal > s.from) {
          if (u < 0.5) e = 2 * u * 1.4;
          else k = s.goal + 2 * (1 - u);
        } else {
          if (u < 0.5) k = s.from + 2 * u;
          else e = 2 * (1 - u) * 1.4;
        }
      } else if (k < 0) {
        e = Math.min(-k, 1.4);
      }

      if (e >= 0) {
        const x = W * (ax - ex * e);
        const bottom = ay - 22 * e;
        const scale = 1 + 0.14 * e;
        const opacity = Math.max(0, 1 - 1.05 * e);
        const blur = 4 * Math.min(e, 1);
        this.put(s, x, bottom, scale, opacity, blur, 1100);
      } else {
        const x = W * (ax + sx * k);
        const bottom = ay + sy * k;
        const scale = Math.pow(sr, k);
        let opacity =
          k <= d - 1 ? 1 - 0.13 * k : Math.max(0, (1 - 0.13 * (d - 1)) * (d - k));
        if (this.still && Math.abs(k) < 0.02) opacity = 0;
        const blur = Math.min(0.9 * k, 3.2);
        const zIdx = 1000 - Math.round(10 * k);
        this.put(s, x, bottom, scale, opacity, blur, zIdx);
      }
    }
  }

  private kick(): void {
    if (this.rafId || !this.visible || document.hidden) return;
    this.lastTs = 0;
    this.rafId = requestAnimationFrame(this.step);
  }

  private step = (ts: number): void => {
    this.rafId = 0;
    if (!this.visible || document.hidden) return;

    const dt = this.lastTs ? Math.min(0.034, (ts - this.lastTs) / 1000) : 1 / 60;
    this.lastTs = ts;

    if (this.mode === 'ring') {
      if (this.reducedMotion && !this.dragging) {
        this.cur = this.target;
        this.vel = 0;
        this.setStill(true);
        this.renderAll();
        return;
      }

      const h = dt / 3;
      for (let j = 0; j < 3; j++) {
        const acc = -this.K * (this.cur - this.target) - this.C * this.vel;
        this.vel += acc * h;
        this.cur += this.vel * h;
      }

      if (
        !this.dragging &&
        Math.abs(this.cur - this.target) <= 0.0005 &&
        Math.abs(this.vel) <= 0.0005
      ) {
        this.cur = this.target;
        this.vel = 0;
        this.setStill(true);
        this.renderAll();
        return;
      }

      this.setStill(false);
      this.renderAll();
      this.rafId = requestAnimationFrame(this.step);
      return;
    }

    const N = this.BODY_COUNT;
    const wrapN = (v: number) => ((v % N) + N) % N;
    let allSettled = true;

    for (let a = 0; a < N; a++) {
      const s = this.classicBodies[a];
      const goal = wrapN(a - this.target);
      if (Math.abs(goal - s.goal) > N / 2) {
        s.trip = true;
        s.from = s.x;
      }
      s.goal = goal;

      if (this.reducedMotion && !this.dragging) {
        s.x = goal;
        s.g = goal;
        s.v = 0;
        s.trip = false;
        continue;
      }

      const tau = this.dragging
        ? 0.016
        : s.trip
          ? 0.1
          : 0.03 + 0.04 * Math.min(goal, 4);
      s.g += (goal - s.g) * (1 - Math.exp(-dt / tau));

      const h = dt / 3;
      for (let j = 0; j < 3; j++) {
        const acc = -this.K * (s.x - s.g) - this.C * s.v;
        s.v += acc * h;
        s.x += s.v * h;
      }

      if (s.trip && Math.abs(s.x - goal) < 0.02) {
        s.trip = false;
      }

      if (
        Math.abs(s.x - goal) > 0.0006 ||
        Math.abs(s.g - goal) > 0.0006 ||
        Math.abs(s.v) > 0.0006
      ) {
        allSettled = false;
      } else {
        s.x = goal;
        s.g = goal;
        s.v = 0;
        s.trip = false;
      }
    }

    if (this.reducedMotion && !this.dragging) {
      this.setStill(true);
      this.renderAll();
      return;
    }

    if (!this.dragging && allSettled) {
      this.setStill(true);
      this.renderAll();
      return;
    }

    this.setStill(false);
    this.renderAll();
    this.rafId = requestAnimationFrame(this.step);
  };

  private setIndex(i: number, silent = false): void {
    const norm = ((i % this.LOOK_COUNT) + this.LOOK_COUNT) % this.LOOK_COUNT;
    const changed = !silent;
    this.index = norm;
    this.kick();

    const base = Math.round(this.target);
    const N = this.BODY_COUNT;
    for (let a = 0; a < N; a++) {
      const body = this.ringBodies[a].el;
      const hit = body.querySelector<HTMLButtonElement>('.rw__hit');
      let k = (((a - base) % N) + N) % N;
      let accessible = false;
      if (this.mode === 'ring') {
        if (k > N / 2) k -= N;
        accessible = k !== 0 && Math.abs(k) <= 2;
      } else {
        accessible = k !== 0 && k <= 3;
      }
      if (accessible) {
        body.removeAttribute('aria-hidden');
        if (hit) hit.tabIndex = 0;
      } else {
        body.setAttribute('aria-hidden', 'true');
        if (hit) hit.tabIndex = -1;
      }
    }

    this.style.setProperty('--rw-progress', ((norm + 1) / this.LOOK_COUNT).toFixed(3));

    if (!changed) {
      return;
    }

    if (this.zoomed) this.closeZoom();

    this.heroes.forEach((hero, idx) => {
      const wasOn = hero.classList.contains('is-on');
      const isNow = idx === norm;
      hero.classList.toggle('is-on', isNow);
      hero.classList.toggle('was', wasOn && !isNow);
      if (isNow) hero.removeAttribute('aria-hidden');
      else hero.setAttribute('aria-hidden', 'true');
      const zBtn = hero.querySelector<HTMLButtonElement>('[data-rw-zoom]');
      if (zBtn) zBtn.tabIndex = isNow ? 0 : -1;
    });

    if (!this.reducedMotion) {
      this.stage.classList.remove('is-sweep');
      void this.stage.offsetWidth;
      this.stage.classList.add('is-sweep');
    }

    const activeHero = this.heroes[norm];
    if (this.liveEl && activeHero?.dataset.label) {
      this.liveEl.textContent = activeHero.dataset.label;
    }

    this.ticks.forEach((tick, idx) => {
      tick.setAttribute('aria-current', idx === norm ? 'true' : 'false');
      tick.classList.toggle('is-past', idx < norm);
    });

    this.panels.forEach((panel, idx) => {
      panel.classList.remove('is-in');
      panel.hidden = idx !== norm;
    });

    const activePanel = this.panels[norm];
    if (activePanel) {
      void activePanel.offsetWidth;
      activePanel.classList.add('is-in');
    }

    const lineup = this.getActiveYearLineup();
    if (this.piecesEl) {
      this.piecesEl.textContent = `Angkatan ${lineup.year}`;
      this.piecesEl.classList.remove('is-swap');
      void this.piecesEl.offsetWidth;
      this.piecesEl.classList.add('is-swap');
    }

    if (this.panelOpen) {
      this.hot(this.activePanelRole === 'uda' ? 1 : 2, false);
    } else {
      this.hot(null);
    }
    this.restartAutoplayBar();
    this.emitStateChange();
  }

  private moveTo(T: number): void {
    this.target = T;
    this.setStill(false);
    this.setIndex(T, false);
  }

  private next(): void {
    this.moveTo(Math.round(this.target) + 1);
  }

  private prev(): void {
    this.moveTo(Math.round(this.target) - 1);
  }

  private go(i: number): void {
    let d = (((i - this.index) % this.LOOK_COUNT) + this.LOOK_COUNT) % this.LOOK_COUNT;
    if (d > 3) d -= this.LOOK_COUNT;
    this.moveTo(Math.round(this.target) + d);
  }

  private play(on: boolean): void {
    this.playing = on;
    this.classList.toggle('is-playing', on);
    if (this.autoBtn) {
      this.autoBtn.classList.toggle('is-playing', on);
      this.autoBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
    }
    if (on) {
      this.restartAutoplayBar();
    } else {
      window.clearTimeout(this.autoTimer);
      this.ticks.forEach((t) => t.classList.remove('is-run'));
    }
    this.emitStateChange();
  }

  private restartAutoplayBar(): void {
    window.clearTimeout(this.autoTimer);
    this.ticks.forEach((t) => t.classList.remove('is-run'));
    if (!this.playing) return;

    const currentTick = this.ticks[this.index];
    if (currentTick) {
      void currentTick.offsetWidth;
      if (!this.panelHover) {
        currentTick.classList.add('is-run');
      }
    }
    this.scheduleAutoplay();
  }

  private scheduleAutoplay(): void {
    window.clearTimeout(this.autoTimer);
    if (!this.playing) return;
    const speed = Number(this.dataset.speed || 5000);
    this.autoTimer = window.setTimeout(() => {
      if (
        this.playing &&
        this.visible &&
        !this.dragging &&
        !document.hidden &&
        !this.panelHover &&
        !this.zoomed &&
        !this.engaged
      ) {
        this.next();
      } else if (this.playing) {
        this.restartAutoplayBar();
      }
    }, speed);
  }

  private engage(): void {
    if (this.engaged) return;
    this.engaged = true;
    this.play(false);
  }

  private hot(n: number | null, scroll = false): void {
    this.querySelectorAll('.is-hot').forEach((el) => el.classList.remove('is-hot'));
    if (n === null || !Number.isFinite(n)) return;

    const pinScope = this.zoomed && this.lbStageEl ? this.lbStageEl : this.heroes[this.index];
    const pin = pinScope?.querySelector<HTMLElement>(`[data-rw-pin="${n}"]`);
    pin?.classList.add('is-hot');

    const activePanel = this.panels[this.index];
    const card = activePanel?.querySelector<HTMLElement>(`[data-rw-card="${n}"]`);
    if (!card) return;
    card.classList.add('is-hot');

    if (scroll) {
      this.revealCard(card);
    }
  }

  private revealCard(card: HTMLElement): void {
    const list = card.closest<HTMLElement>('.rw__items');
    const behavior: ScrollBehavior = this.reducedMotion ? 'auto' : 'smooth';
    if (list) {
      if (list.scrollWidth > list.clientWidth + 2) {
        const left =
          card.getBoundingClientRect().left -
          list.getBoundingClientRect().left +
          list.scrollLeft -
          18;
        list.scrollTo({left: Math.max(0, left), behavior});
        return;
      }
      if (list.scrollHeight > list.clientHeight + 2) {
        const top = card.offsetTop - list.offsetTop - 12;
        list.scrollTo({top: Math.max(0, top), behavior});
        return;
      }
    }
    const r = card.getBoundingClientRect();
    if (r.top < 0 || r.bottom > window.innerHeight - 140) {
      window.scrollBy({top: r.top - 0.3 * window.innerHeight, behavior});
    }
  }

  private openZoom(fromRect?: DOMRect): void {
    this.engage();
    this.hot(null);
    window.clearTimeout(this.lbClearTimer);

    const hero = this.heroes[this.index];
    if (!hero || !this.lbEl || !this.lbStageEl) return;

    const heroFigure = hero.querySelector<HTMLElement>('.rw__figure');
    const heroShadow = hero.querySelector<HTMLElement>('.rw__shadow');
    if (!heroFigure) return;

    const a = fromRect && fromRect.height > 0 ? fromRect : heroFigure.getBoundingClientRect();

    this.lbStageEl.innerHTML = '';
    const lbModel = document.createElement('div');
    lbModel.className = 'rw__lb-model';

    if (heroShadow) {
      lbModel.appendChild(heroShadow.cloneNode(true));
    }
    const clonedFigure = heroFigure.cloneNode(true) as HTMLElement;
    clonedFigure.querySelector('[data-rw-zoom]')?.remove();
    clonedFigure.querySelectorAll<HTMLButtonElement>('[data-rw-pin]').forEach((p) => {
      p.tabIndex = 0;
    });

    const foot = hero.style.getPropertyValue('--rw-foot');
    if (foot) {
      const art = clonedFigure.querySelector<HTMLElement>('.rw__art');
      art?.style.setProperty('--rw-foot', foot);
    }

    lbModel.appendChild(clonedFigure);
    this.lbStageEl.appendChild(lbModel);

    const stageRect = this.lbStageEl.getBoundingClientRect();
    const h = Math.max(160, Math.round(Math.min(stageRect.height, stageRect.width / 0.5625)));
    lbModel.style.setProperty('--rw-model-h', `${h}px`);

    lbModel.querySelectorAll<HTMLImageElement>('[data-model-image]').forEach((img) => {
      img.loading = 'eager';
      img.sizes = `${Math.round(h * 0.5625)}px`;
      decodeModelImage(img);
    });

    const lineup = this.getActiveYearLineup();
    const list = this.roleFilter === 'uda' ? lineup.uda : lineup.uni;
    const activePerson = list[this.index];
    if (this.lbKickerEl) {
      this.lbKickerEl.textContent = activePerson
        ? `${lineup.year} · ${activePerson.rankLabel}`
        : `Angkatan ${lineup.year}`;
    }
    if (this.lbNameEl) {
      this.lbNameEl.textContent = hero.dataset.name || '';
    }

    this.zoomed = true;
    this.classList.add('rw--zoom');
    this.lbEl.setAttribute('aria-hidden', 'false');
    this.emitStateChange();

    if (!this.reducedMotion && a.height > 0) {
      const b = clonedFigure.getBoundingClientRect();
      if (b.height > 0) {
        lbModel.style.transition = 'none';
        lbModel.style.transform = `translate3d(${a.left - b.left}px, ${a.bottom - b.bottom}px, 0) scale(${a.height / b.height})`;
        void lbModel.offsetHeight;
        lbModel.style.transition = '';
        lbModel.style.transform = '';
      }
    }

    this.lbCloseBtn?.focus({preventScroll: true});
  }

  private closeZoom(): void {
    if (!this.zoomed || !this.lbEl || !this.lbStageEl) return;
    this.zoomed = false;

    const lbModel = this.lbStageEl.querySelector<HTMLElement>('.rw__lb-model');
    const lbFigure = lbModel?.querySelector<HTMLElement>('.rw__figure');
    const heroFigure = this.heroes[this.index]?.querySelector<HTMLElement>('.rw__figure');

    if (!this.reducedMotion && lbModel && lbFigure && heroFigure) {
      const a = heroFigure.getBoundingClientRect();
      const b = lbFigure.getBoundingClientRect();
      if (a.height > 0 && b.height > 0) {
        lbModel.style.transform = `translate3d(${a.left - b.left}px, ${a.bottom - b.bottom}px, 0) scale(${a.height / b.height})`;
      }
    }

    this.classList.remove('rw--zoom');
    this.lbEl.setAttribute('aria-hidden', 'true');
    this.emitStateChange();

    if (this.lbEl.contains(document.activeElement)) {
      this.stage.focus({preventScroll: true});
    }

    window.clearTimeout(this.lbClearTimer);
    this.lbClearTimer = window.setTimeout(
      () => {
        if (!this.zoomed && this.lbStageEl) {
          this.lbStageEl.innerHTML = '';
        }
      },
      this.reducedMotion ? 0 : 950,
    );
  }
}

if (!customElements.get('runway-section')) {
  customElements.define('runway-section', RunwaySection);
}

function setupSearch(): void {
  const input = document.getElementById('catalog-search') as HTMLInputElement | null;
  const clearBtn = document.getElementById('search-clear') as HTMLButtonElement | null;
  const resultsEl = document.getElementById('search-results');
  const runway = document.querySelector<RunwaySection>('runway-section');
  if (!input || !resultsEl || !runway) return;

  interface SearchRecord {
    year: string;
    person: AmbassadorBio;
    haystack: string;
  }

  const allPeople: SearchRecord[] = [];
  for (const lineup of YEAR_CONTINGENTS) {
    for (const person of [...lineup.uda, ...lineup.uni]) {
      allPeople.push({
        year: lineup.year,
        person,
        haystack: [
          person.fullName,
          person.rankLabel,
          person.role,
          person.region,
          lineup.year,
          person.education,
          person.profession,
          person.bio,
          person.advocacy,
          person.achievement,
        ]
          .join(' ')
          .toLowerCase(),
      });
    }
  }

  const closeResults = () => {
    resultsEl.hidden = true;
    input.setAttribute('aria-expanded', 'false');
  };

  const renderResults = (rawQuery: string) => {
    const q = rawQuery.trim().toLowerCase();
    if (clearBtn) clearBtn.hidden = q.length === 0;

    if (!q) {
      closeResults();
      resultsEl.innerHTML = '';
      return;
    }

    const terms = q.split(/\s+/).filter(Boolean);
    const matches = allPeople.filter((rec) => terms.every((t) => rec.haystack.includes(t)));

    resultsEl.innerHTML = '';
    const meta = document.createElement('div');
    meta.className = 'search-meta';
    meta.textContent = `${matches.length} profil ditemukan`;
    resultsEl.appendChild(meta);

    if (matches.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'search-empty';
      empty.textContent = `Tidak ada profil Uda atau Uni yang cocok dengan "${rawQuery.trim()}".`;
      resultsEl.appendChild(empty);
    } else {
      for (const {year, person} of matches.slice(0, 24)) {
        const hit = document.createElement('button');
        hit.type = 'button';
        hit.className = 'search-hit';

        const top = document.createElement('div');
        top.className = 'search-hit-top';
        const roleTag = document.createElement('span');
        roleTag.className = `search-hit-role${person.role === 'uni' ? ' is-uni' : ''}`;
        roleTag.textContent = person.rankLabel;
        const name = document.createElement('span');
        name.className = 'search-hit-name';
        name.textContent = person.fullName;
        top.append(roleTag, name);

        const sub = document.createElement('span');
        sub.className = 'search-hit-sub';
        sub.textContent = `Angkatan ${year} · Utusan ${person.region}`;

        const snippet = document.createElement('span');
        snippet.className = 'search-hit-bio';
        snippet.textContent = person.bio;

        hit.append(top, sub, snippet);
        hit.addEventListener('click', () => {
          runway.goToProfile(person.slotIndex, person.role, year);
          closeResults();
        });
        resultsEl.appendChild(hit);
      }
    }

    resultsEl.hidden = false;
    input.setAttribute('aria-expanded', 'true');
  };

  input.addEventListener('input', () => renderResults(input.value));
  input.addEventListener('focus', () => {
    if (input.value.trim()) renderResults(input.value);
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeResults();
      input.blur();
    }
  });

  clearBtn?.addEventListener('click', () => {
    input.value = '';
    renderResults('');
    input.focus();
  });

  document.addEventListener('click', (e) => {
    const target = e.target as Node | null;
    if (target && !input.closest('.header-search')?.contains(target)) {
      closeResults();
    }
  });
}

function setupInfoDialogs(): void {
  const openButtons = document.querySelectorAll<HTMLButtonElement>('[data-open-dialog]');
  openButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.openDialog;
      if (!targetId) return;
      const dialog = document.getElementById(targetId) as HTMLDialogElement | null;
      dialog?.showModal();
    });
  });

  document.querySelectorAll<HTMLDialogElement>('dialog.info-dialog').forEach((dialog) => {
    const closeBtn = dialog.querySelector<HTMLButtonElement>('[data-close-dialog]');
    closeBtn?.addEventListener('click', () => dialog.close());

    dialog.addEventListener('click', (e) => {
      if (e.target !== dialog) return;
      const r = dialog.getBoundingClientRect();
      if (
        e.clientX < r.left ||
        e.clientX > r.right ||
        e.clientY < r.top ||
        e.clientY > r.bottom
      ) {
        dialog.close();
      }
    });
  });
}

interface SlidingPillController {
  update: (instant?: boolean) => void;
}

function initSlidingPill(
  container: HTMLElement | null,
  activeSelector = '.is-active',
): SlidingPillController | null {
  if (!container) return null;
  const thumb = container.querySelector<HTMLElement>('.pill-3d-thumb');
  if (!thumb) return null;

  let initialized = false;
  const update = (instant = false) => {
    const activeEl = container.querySelector<HTMLElement>(activeSelector);
    if (!activeEl) return;

    const shouldSnap = instant || !initialized;
    if (shouldSnap) {
      container.classList.add('is-snapping');
    }

    const x = activeEl.offsetLeft;
    const y = activeEl.offsetTop;
    const w = activeEl.offsetWidth;
    const h = activeEl.offsetHeight;

    thumb.style.width = `${w}px`;
    thumb.style.height = `${h}px`;
    thumb.style.transform = `translate3d(${x}px, ${y}px, 0)`;

    if (!initialized) {
      container.classList.add('has-pill-thumb');
      initialized = true;
    }

    if (shouldSnap) {
      void thumb.offsetWidth;
      requestAnimationFrame(() => container.classList.remove('is-snapping'));
    }
  };

  requestAnimationFrame(() => update(true));

  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(() => update(true));
    ro.observe(container);
  }
  window.addEventListener('resize', () => update(true));

  return {update};
}

function setupBoardFilter(pillCtrl?: SlidingPillController | null): void {
  const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-board-filter]'));
  const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-board-card]'));
  const countEl = document.querySelector<HTMLElement>('[data-board-count]');
  const stage = document.querySelector<HTMLElement>('[data-board-stage]');
  if (!buttons.length || !cards.length) return;

  const applyFilter = (division: string) => {
    let visibleCount = 0;
    cards.forEach((card) => {
      const match = division === 'all' || card.dataset.division === division;
      card.hidden = !match;
      if (match) visibleCount += 1;
    });

    buttons.forEach((btn) => {
      const active = btn.dataset.boardFilter === division;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    pillCtrl?.update(false);

    if (countEl) {
      countEl.textContent = `Menampilkan ${visibleCount} pengurus · Masa Bakti 2027`;
    }

    if (stage) {
      stage.dispatchEvent(new CustomEvent('board:filterchange'));
    }
  };

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const division = btn.dataset.boardFilter || 'all';
      applyFilter(division);
    });
  });
}

function setupAnchorLinks(): void {
  const runway = document.querySelector<RunwaySection>('runway-section');
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const hash = link.getAttribute('href');
      if (!hash || hash === '#') return;
      const target = document.querySelector<HTMLElement>(hash);
      if (!target) return;
      e.preventDefault();
      runway?.closeProfileView();
      if (hash === '#galeri') {
        window.scrollTo({top: 0, behavior: 'smooth'});
      } else {
        target.scrollIntoView({behavior: 'smooth', block: 'start'});
      }
    });
  });
}

function setupTopNavAndPills(): void {
  const runway = document.querySelector<RunwaySection>('runway-section');
  const yearPillCtrl = initSlidingPill(document.querySelector<HTMLElement>('.rw__year-pills'));
  const rolePillCtrl = initSlidingPill(document.querySelector<HTMLElement>('.rw__role-switch'));
  const topNavEl = document.querySelector<HTMLElement>('[data-top-nav]');
  const topNavPillCtrl = initSlidingPill(topNavEl);

  const navBtns = Array.from(topNavEl?.querySelectorAll<HTMLButtonElement>('.top-nav-btn') ?? []);
  const eventDialog = document.getElementById('kegiatan-dialog') as HTMLDialogElement | null;
  const visiMisiDialog = document.getElementById('visi-misi-dialog') as HTMLDialogElement | null;

  const syncControlPills = () => {
    yearPillCtrl?.update(false);
    rolePillCtrl?.update(false);
  };

  if (runway) {
    runway.addEventListener('rw:statechange', syncControlPills);
    syncControlPills();
  }

  const setActiveNavByMatch = (predicate: (btn: HTMLButtonElement) => boolean) => {
    let changed = false;
    navBtns.forEach((btn) => {
      const match = predicate(btn);
      if (match && !btn.classList.contains('is-active')) changed = true;
      btn.classList.toggle('is-active', match);
      if (match) btn.setAttribute('aria-current', 'page');
      else btn.removeAttribute('aria-current');
    });
    if (changed) topNavPillCtrl?.update(false);
  };

  const setActiveNavTarget = (targetHash: string) => {
    setActiveNavByMatch((btn) => btn.dataset.navTarget === targetHash);
  };

  topNavEl?.querySelectorAll<HTMLButtonElement>('[data-nav-target]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const hash = btn.dataset.navTarget;
      if (!hash) return;
      runway?.closeProfileView();
      setActiveNavTarget(hash);
      if (hash === '#galeri') {
        window.scrollTo({top: 0, behavior: 'smooth'});
      } else {
        document.querySelector<HTMLElement>(hash)?.scrollIntoView({behavior: 'smooth', block: 'start'});
      }
    });
  });

  topNavEl?.querySelectorAll<HTMLButtonElement>('[data-open-dialog]').forEach((btn) => {
    btn.addEventListener('click', () => {
      setActiveNavByMatch((item) => item === btn);
    });
  });

  // Scroll-synced active tab indicator
  const sections: {hash: string; el: HTMLElement}[] = ['#galeri', '#event', '#kepengurusan-2027']
    .map((hash) => ({hash, el: document.querySelector<HTMLElement>(hash)}))
    .filter((item): item is {hash: string; el: HTMLElement} => Boolean(item.el));

  let scrollTick = 0;
  const updateActiveByScroll = () => {
    scrollTick = 0;
    if (eventDialog?.open || visiMisiDialog?.open) return;
    const probeY = window.scrollY + window.innerHeight * 0.42;
    const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 40;
    let current = '#galeri';
    for (const sec of sections) {
      if (sec.hash === '#galeri') continue;
      if (probeY >= sec.el.offsetTop || (atBottom && sec.hash === '#kepengurusan-2027')) {
        current = sec.hash;
      }
    }
    setActiveNavTarget(current);
  };

  eventDialog?.addEventListener('close', updateActiveByScroll);
  visiMisiDialog?.addEventListener('close', updateActiveByScroll);

  window.addEventListener(
    'scroll',
    () => {
      if (!scrollTick) {
        scrollTick = requestAnimationFrame(updateActiveByScroll);
      }
    },
    {passive: true},
  );
  updateActiveByScroll();
}

interface BoardProfileDetail {
  name: string;
  role: string;
  division: string;
  badge: string;
  origin: string;
  photo: string;
  summary: string;
  tasks: string[];
}

const BOARD_PROFILES: Record<string, BoardProfileDetail> = {
  'riky-pratama': {
    name: 'Uda Riky Pratama, S.T.',
    role: 'Ketua Umum · Masa Bakti 2027',
    division: 'Pengurus Inti · Masa Bakti 2027',
    badge: 'Uda Utama 2025',
    origin: 'Utusan Kota Bukittinggi',
    photo: 'https://reel-ref-try-the-look.vercel.app/assets/model-1-640.webp',
    summary:
      'Memimpin arah kebijakan strategis Ikatan Uda & Uni Duta Wisata Provinsi Sumatera Barat, mengoordinasikan sinergi dengan pemerintah provinsi, dan mewakili organisasi pada forum nasional.',
    tasks: [
      'Menetapkan rencana strategis organisasi dan peta jalan promosi pariwisata tahunan 2027.',
      'Mengoordinasikan audiensi lintas lembaga bersama Dinas Pariwisata Provinsi Sumatera Barat dan mitra daerah.',
      'Memimpin delegasi resmi Uda & Uni Sumbar pada ajang duta wisata tingkat nasional.',
    ],
  },
  'mutiara-khairunnisa': {
    name: 'Uni Mutiara Khairunnisa, S.E.',
    role: 'Wakil Ketua Umum · Masa Bakti 2027',
    division: 'Pengurus Inti · Masa Bakti 2027',
    badge: 'Uni Utama 2025',
    origin: 'Utusan Kota Padang',
    photo: 'https://reel-ref-try-the-look.vercel.app/assets/model-2-640.webp',
    summary:
      'Mengawal tata kelola program kerja lintas bidang, pembinaan ikatan Uda & Uni di 19 kabupaten/kota, serta evaluasi dampak kegiatan tahunan.',
    tasks: [
      'Menyelaraskan agenda bidang advokasi, promosi digital, riset budaya, dan kemitraan.',
      'Mendampingi pembinaan dan standarisasi peran Uda & Uni di seluruh kabupaten/kota Sumatera Barat.',
      'Melakukan evaluasi berkala capaian indikator keberhasilan program kerja ikatan.',
    ],
  },
  'aulia-rahmadani': {
    name: 'Uni Aulia Rahmadani, S.I.Kom.',
    role: 'Sekretaris Umum · Masa Bakti 2027',
    division: 'Pengurus Inti · Masa Bakti 2027',
    badge: 'Uni Utama 2023',
    origin: 'Utusan Kota Padang Panjang',
    photo: 'https://reel-ref-try-the-look.vercel.app/assets/model-3-640.webp',
    summary:
      'Mengelola administrasi kesekretariatan, pemutakhiran basis data alumni lintas angkatan, dokumentasi resmi, serta korespondensi kelembagaan.',
    tasks: [
      'Menyusun notulensi rapat pengurus inti, surat-menyurat resmi, dan arsip keputusan organisasi.',
      'Memelihara direktori keanggotaan aktif Uda & Uni Duta Wisata di 19 kabupaten/kota.',
      'Mengatur jadwal tugas keprotokolan dan penugasan resmi duta di tingkat provinsi.',
    ],
  },
  'fikri-ramadhan': {
    name: 'Uda Fikri Ramadhan, S.Ak.',
    role: 'Bendahara Umum · Masa Bakti 2027',
    division: 'Pengurus Inti · Masa Bakti 2027',
    badge: 'Uda Utama 2024',
    origin: 'Utusan Kab. Tanah Datar',
    photo: 'https://reel-ref-try-the-look.vercel.app/assets/model-5-640.webp',
    summary:
      'Bertanggung jawab atas perencanaan anggaran, tata kelola keuangan organisasi yang transparan dan akuntabel, serta pelaporan pendanaan program kerja.',
    tasks: [
      'Menyusun Rencana Anggaran Biaya tahunan seluruh bidang kerja periode 2027.',
      'Mengelola pencatatan kas, dukungan sponsor kemitraan, dan audit internal berkala.',
      'Menyajikan laporan pertanggungjawaban keuangan setiap akhir triwulan.',
    ],
  },
  'farhan-maulana': {
    name: 'Uda Farhan Maulana, S.H.',
    role: 'Koordinator Advokasi & Budaya · 2027',
    division: 'Bidang Advokasi & Budaya · 2027',
    badge: 'Uda Utama 2023',
    origin: 'Utusan Kota Padang',
    photo: 'https://reel-ref-try-the-look.vercel.app/assets/model-4-640.webp',
    summary:
      'Menggerakkan edukasi sadar wisata, pelestarian cagar budaya, serta pembinaan Kelompok Sadar Wisata (Pokdarwis) dan generasi muda sadar adat di nagari.',
    tasks: [
      'Menyelenggarakan lokakarya Sapta Pesona bagi pengelola desa wisata di berbagai nagari.',
      'Mengawal kampanye pelestarian situs cagar budaya dan warisan sejarah Ranah Minang.',
      'Mendorong lahirnya inisiatif ekowisata berkelanjutan berbasis komunitas lokal.',
    ],
  },
  'zahra-nabila': {
    name: 'Uni Zahra Nabila Putri, S.Hum.',
    role: 'Koordinator Riset & Kurasi Adat · 2027',
    division: 'Bidang Advokasi & Budaya · 2027',
    badge: 'Uni Utama 2024',
    origin: 'Utusan Kab. Agam',
    photo: 'https://reel-ref-try-the-look.vercel.app/assets/model-6-640.webp',
    summary:
      'Menyusun materi kurasi busana adat, dokumentasi sejarah nagari, serta standar pengetahuan kebudayaan Minangkabau untuk pembekalan duta wisata.',
    tasks: [
      'Menyusun modul pengetahuan adat basandi syarak, sastra lisan, dan tata busana Minangkabau.',
      'Melakukan verifikasi narasi budaya untuk setiap materi publikasi resmi ikatan.',
      'Menjadi narasumber pembekalan finalis Uda & Uni kabupaten/kota dan provinsi.',
    ],
  },
  'hafiz-alfaruq': {
    name: 'Uda Hafiz Al-Faruq, S.Kom.',
    role: 'Koordinator Promosi & Media Digital · 2027',
    division: 'Bidang Promosi & Media · 2027',
    badge: 'Uda Utama 2022',
    origin: 'Utusan Kota Payakumbuh',
    photo: 'https://reel-ref-try-the-look.vercel.app/assets/model-6-640.webp',
    summary:
      'Mengelola kampanye digital destinasi Sumatera Barat, produksi konten dokumenter wisata, dan pengembangan arsip direktori resmi ikatan.',
    tasks: [
      'Memproduksi seri dokumenter visual destinasi unggulan di 19 kabupaten/kota.',
      'Mengembangkan kanal digital dan katalog resmi alumni Uda & Uni Sumbar.',
      'Mengelola strategi komunikasi media sosial untuk menjangkau wisatawan muda.',
    ],
  },
  'nabila-syafitri': {
    name: 'Uni Nabila Syafitri, S.Par.',
    role: 'Koordinator Diplomasi & Publikasi · 2027',
    division: 'Bidang Promosi & Media · 2027',
    badge: 'Uni Utama 2022',
    origin: 'Utusan Kab. Pesisir Selatan',
    photo: 'https://reel-ref-try-the-look.vercel.app/assets/model-4-640.webp',
    summary:
      'Mengoordinasikan keprotokolan tugas duta wisata, juru bicara agenda promosi antarprovinsi, dan delegasi misi budaya mancanegara.',
    tasks: [
      'Menjadi penghubung resmi misi promosi pariwisata bersama pemangku kepentingan nasional & global.',
      'Mengatur standar keprotokolan dan tata wicara duta pada ajang resmi kepariwisataan.',
      'Mengawal publikasi siaran pers dan kemitraan media nasional maupun internasional.',
    ],
  },
  'salsabila-azzahra': {
    name: 'Uni Salsabila Azzahra, S.Sos.',
    role: 'Koordinator Kemitraan & Sosial · 2027',
    division: 'Bidang Kemitraan & Sosial · 2027',
    badge: 'Uni Utama 2021',
    origin: 'Utusan Kota Pariaman',
    photo: 'https://reel-ref-try-the-look.vercel.app/assets/model-5-640.webp',
    summary:
      'Menjalin kemitraan bersama pengrajin kriya tenun dan UMKM kuliner serta menggerakkan program bakti sosial dan aksi tanggap bencana daerah.',
    tasks: [
      'Memfasilitasi pameran kriya tenun songket, sulaman tradisional, dan UMKM ekonomi kreatif nagari.',
      'Menggerakkan relawan alumni untuk aksi kemanusiaan dan tanggap darurat bencana di Sumatera Barat.',
      'Membangun kolaborasi program tanggung jawab sosial bersama mitra swasta dan komunitas.',
    ],
  },
};

function setupBoardCards3D(): void {
  const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-board-card]'));
  const stage = document.querySelector<HTMLElement>('[data-board-stage]');
  const dotsWrap = document.querySelector<HTMLElement>('[data-board-dots]');
  const indexEl = document.querySelector<HTMLElement>('[data-board-index]');
  const prevBtns = Array.from(
    document.querySelectorAll<HTMLButtonElement>('[data-board-prev], [data-board-stage-prev]'),
  );
  const nextBtns = Array.from(
    document.querySelectorAll<HTMLButtonElement>('[data-board-next], [data-board-stage-next]'),
  );
  const dialog = document.getElementById('board-detail-dialog') as HTMLDialogElement | null;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canTilt = window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reducedMotion;

  cards.forEach((card) => {
    const canvas = card.querySelector<HTMLElement>('.board-card-canvas');
    const photo = card.querySelector<HTMLImageElement>('.board-card-photo');
    if (canvas && photo && !canvas.querySelector('.board-card-photo-blur')) {
      const blurImg = document.createElement('img');
      blurImg.className = 'board-card-photo-blur';
      blurImg.src = photo.src;
      blurImg.alt = '';
      blurImg.loading = 'lazy';
      blurImg.referrerPolicy = 'no-referrer';
      blurImg.setAttribute('aria-hidden', 'true');
      photo.insertAdjacentElement('afterend', blurImg);
    }
  });

  const getVisibleCards = () => cards.filter((card) => !card.hidden);

  let active = 0;
  let startY = 0;
  let tracking = false;
  let wheelLockUntil = 0;

  const syncDots = (total: number) => {
    if (!dotsWrap) return;
    if (total <= 1) {
      dotsWrap.innerHTML = '';
      return;
    }
    if (dotsWrap.childElementCount !== total) {
      dotsWrap.innerHTML = '';
      for (let i = 0; i < total; i += 1) {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'board-stage-dot';
        dot.setAttribute('aria-label', `Tampilkan pengurus urutan ${i + 1}`);
        dot.addEventListener('click', () => go(i));
        dotsWrap.appendChild(dot);
      }
    }
    Array.from(dotsWrap.children).forEach((el, idx) => {
      const isAct = idx === active;
      el.classList.toggle('is-active', isAct);
      el.setAttribute('aria-current', isAct ? 'true' : 'false');
    });
  };

  const renderDeck = () => {
    const visible = getVisibleCards();
    const total = visible.length;

    cards.forEach((card) => {
      if (card.hidden) {
        card.dataset.pos = 'hidden';
        card.setAttribute('aria-hidden', 'true');
      }
    });

    if (!total) {
      if (indexEl) indexEl.textContent = '00 / 00';
      prevBtns.forEach((btn) => {
        btn.disabled = true;
      });
      nextBtns.forEach((btn) => {
        btn.disabled = true;
      });
      syncDots(0);
      return;
    }

    active = ((active % total) + total) % total;

    visible.forEach((card, index) => {
      const diff = (index - active + total) % total;
      let pos: 'active' | 'next' | 'prev' | 'next-far' | 'prev-far' | 'hidden' = 'hidden';
      if (diff === 0) {
        pos = 'active';
      } else if (total === 2 && diff === 1) {
        pos = 'next';
      } else if (total === 3) {
        if (diff === 1) pos = 'next';
        else if (diff === 2) pos = 'prev';
      } else if (total === 4) {
        if (diff === 1) pos = 'next';
        else if (diff === 2) pos = 'next-far';
        else if (diff === 3) pos = 'prev';
      } else if (total >= 5) {
        if (diff === 1) pos = 'next';
        else if (diff === 2) pos = 'next-far';
        else if (diff === total - 1) pos = 'prev';
        else if (diff === total - 2) pos = 'prev-far';
      }

      card.dataset.pos = pos;
      card.setAttribute('aria-hidden', pos === 'active' ? 'false' : 'true');
    });

    const pad = (n: number) => String(n).padStart(2, '0');
    if (indexEl) indexEl.textContent = `${pad(active + 1)} / ${pad(total)}`;

    const disableNav = total <= 1;
    prevBtns.forEach((btn) => {
      btn.disabled = disableNav;
    });
    nextBtns.forEach((btn) => {
      btn.disabled = disableNav;
    });

    syncDots(total);
  };

  const go = (nextIndex: number) => {
    const visible = getVisibleCards();
    const total = visible.length;
    if (!total) return;
    active = ((nextIndex % total) + total) % total;
    renderDeck();
  };

  prevBtns.forEach((btn) => {
    btn.addEventListener('click', () => go(active - 1));
  });

  nextBtns.forEach((btn) => {
    btn.addEventListener('click', () => go(active + 1));
  });

  cards.forEach((card) => {
    card.addEventListener('click', (e: MouseEvent) => {
      const pos = card.dataset.pos;
      if (pos === 'prev' || pos === 'next' || pos === 'prev-far' || pos === 'next-far') {
        e.preventDefault();
        const visible = getVisibleCards();
        const idx = visible.indexOf(card);
        if (idx !== -1) go(idx);
      }
    });
  });

  if (stage) {
    stage.addEventListener('board:filterchange', () => {
      active = 0;
      renderDeck();
    });

    stage.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        go(active + 1);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        go(active - 1);
      }
    });

    stage.addEventListener(
      'wheel',
      (e: WheelEvent) => {
        const visible = getVisibleCards();
        if (visible.length <= 1 || Math.abs(e.deltaY) < 8) return;
        const goingDown = e.deltaY > 0;
        if ((goingDown && active >= visible.length - 1) || (!goingDown && active <= 0)) {
          return;
        }
        e.preventDefault();
        const now = performance.now();
        if (now < wheelLockUntil) return;
        wheelLockUntil = now + 340;
        go(goingDown ? active + 1 : active - 1);
      },
      {passive: false},
    );

    stage.addEventListener('pointerdown', (e: PointerEvent) => {
      if ((e.target as HTMLElement | null)?.closest('button')) return;
      startY = e.clientY;
      tracking = true;
    });

    stage.addEventListener('pointerup', (e: PointerEvent) => {
      if (!tracking) return;
      tracking = false;
      const dy = e.clientY - startY;
      if (Math.abs(dy) > 40) {
        go(dy < 0 ? active + 1 : active - 1);
      }
    });

    stage.addEventListener('pointercancel', () => {
      tracking = false;
    });
  }

  renderDeck();

  if (canTilt) {
    cards.forEach((card) => {
      let rafId = 0;
      let nextRx = 0;
      let nextRy = 0;
      let nextMx = '50%';
      let nextMy = '28%';

      const applyTilt = () => {
        rafId = 0;
        card.style.setProperty('--rx', `${nextRx.toFixed(2)}deg`);
        card.style.setProperty('--ry', `${nextRy.toFixed(2)}deg`);
        card.style.setProperty('--mx', nextMx);
        card.style.setProperty('--my', nextMy);
      };

      card.addEventListener('pointerenter', () => {
        card.classList.add('is-tilting');
      });

      card.addEventListener('pointermove', (e: PointerEvent) => {
        if (e.pointerType !== 'mouse') return;
        const rect = card.getBoundingClientRect();
        if (!rect.width || !rect.height) return;
        const px = clamp((e.clientX - rect.left) / rect.width, 0, 1);
        const py = clamp((e.clientY - rect.top) / rect.height, 0, 1);

        nextRx = (0.5 - py) * 7.5;
        nextRy = (px - 0.5) * 9;
        nextMx = `${(px * 100).toFixed(1)}%`;
        nextMy = `${(py * 100).toFixed(1)}%`;

        if (!rafId) {
          rafId = requestAnimationFrame(applyTilt);
        }
      });

      card.addEventListener('pointerleave', () => {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
        card.classList.remove('is-tilting');
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });
  }

  if (!dialog) return;
  const photoEl = dialog.querySelector<HTMLImageElement>('[data-bd-photo]');
  const badgeEl = dialog.querySelector<HTMLElement>('[data-bd-badge]');
  const divisionEl = dialog.querySelector<HTMLElement>('[data-bd-division]');
  const nameEl = dialog.querySelector<HTMLElement>('[data-bd-name]');
  const roleEl = dialog.querySelector<HTMLElement>('[data-bd-role]');
  const summaryEl = dialog.querySelector<HTMLElement>('[data-bd-summary]');
  const tasksEl = dialog.querySelector<HTMLUListElement>('[data-bd-tasks]');
  const originEl = dialog.querySelector<HTMLElement>('[data-bd-origin]');

  const openBoardDetail = (id: string) => {
    const profile = BOARD_PROFILES[id];
    if (!profile) return;

    if (photoEl) {
      photoEl.src = profile.photo;
      photoEl.alt = profile.name;
    }
    if (badgeEl) badgeEl.textContent = profile.badge;
    if (divisionEl) divisionEl.textContent = profile.division;
    if (nameEl) nameEl.textContent = profile.name;
    if (roleEl) roleEl.textContent = profile.role;
    if (summaryEl) summaryEl.textContent = profile.summary;
    if (originEl) originEl.textContent = profile.origin;
    if (tasksEl) {
      tasksEl.innerHTML = '';
      for (const task of profile.tasks) {
        const li = document.createElement('li');
        li.textContent = task;
        tasksEl.appendChild(li);
      }
    }

    dialog.showModal();
  };

  document.querySelectorAll<HTMLButtonElement>('[data-board-detail]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.boardDetail;
      if (id) openBoardDetail(id);
    });
  });
}

function setupEventShowcase(): void {
  const stage = document.querySelector<HTMLElement>('[data-showcase]');
  if (!stage) return;

  const cards = Array.from(stage.querySelectorAll<HTMLElement>('[data-showcase-card]'));
  const dots = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-showcase-dot]'));
  const prevBtn = stage.querySelector<HTMLButtonElement>('[data-showcase-prev]');
  const nextBtn = stage.querySelector<HTMLButtonElement>('[data-showcase-next]');
  const total = cards.length;
  if (total === 0) return;

  let active = 0;
  let startX = 0;
  let tracking = false;

  const render = () => {
    cards.forEach((card, index) => {
      const diff = (index - active + total) % total;
      let pos: 'active' | 'next' | 'prev' | 'hidden' = 'hidden';
      if (diff === 0) pos = 'active';
      else if (diff === 1) pos = 'next';
      else if (diff === total - 1) pos = 'prev';

      card.dataset.pos = pos;
      card.setAttribute('aria-hidden', pos === 'active' ? 'false' : 'true');
    });

    dots.forEach((dot, index) => {
      const isActive = index === active;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  };

  const go = (nextIndex: number) => {
    active = ((nextIndex % total) + total) % total;
    render();
  };

  prevBtn?.addEventListener('click', () => go(active - 1));
  nextBtn?.addEventListener('click', () => go(active + 1));

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const idx = Number(dot.dataset.showcaseDot);
      if (!Number.isNaN(idx)) go(idx);
    });
  });

  cards.forEach((card, index) => {
    card.addEventListener('click', (e) => {
      if (card.dataset.pos === 'prev' || card.dataset.pos === 'next') {
        e.preventDefault();
        go(index);
      }
    });
  });

  stage.addEventListener('pointerdown', (e: PointerEvent) => {
    if ((e.target as HTMLElement | null)?.closest('button')) return;
    startX = e.clientX;
    tracking = true;
  });

  stage.addEventListener('pointerup', (e: PointerEvent) => {
    if (!tracking) return;
    tracking = false;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 42) {
      go(dx < 0 ? active + 1 : active - 1);
    }
  });

  stage.addEventListener('pointercancel', () => {
    tracking = false;
  });

  render();
}

function setupVisiMisi3D(): void {
  const frame = document.querySelector<HTMLElement>('[data-vm-frame]');
  if (!frame) return;

  const vmDialog = document.getElementById('visi-misi-dialog') as HTMLDialogElement | null;
  const tabs = Array.from(frame.querySelectorAll<HTMLButtonElement>('[data-vm-tab]'));
  const panels = Array.from(frame.querySelectorAll<HTMLElement>('[data-vm-panel]'));
  const nextBtn = frame.querySelector<HTMLButtonElement>('[data-vm-next-section]');

  const activateTab = (key: string) => {
    tabs.forEach((tab) => {
      const isActive = tab.dataset.vmTab === key;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    panels.forEach((panel) => {
      const isMatch = panel.dataset.vmPanel === key;
      panel.hidden = !isMatch;
      panel.classList.toggle('is-active', isMatch);
    });
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const key = tab.dataset.vmTab;
      if (key) activateTab(key);
    });
  });

  nextBtn?.addEventListener('click', () => {
    const hash = nextBtn.dataset.vmNextSection;
    if (!hash) return;
    if (vmDialog?.open) vmDialog.close();
    requestAnimationFrame(() => {
      document.querySelector<HTMLElement>(hash)?.scrollIntoView({behavior: 'smooth', block: 'start'});
    });
  });

  const canTilt =
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!canTilt) return;

  let rafId = 0;
  let nextRx = 0;
  let nextRy = 0;
  let nextMx = '50%';
  let nextMy = '30%';

  const applyTilt = () => {
    rafId = 0;
    frame.style.setProperty('--vm-rx', `${nextRx.toFixed(2)}deg`);
    frame.style.setProperty('--vm-ry', `${nextRy.toFixed(2)}deg`);
    frame.style.setProperty('--vm-mx', nextMx);
    frame.style.setProperty('--vm-my', nextMy);
  };

  frame.addEventListener('pointerenter', () => {
    frame.classList.add('is-tilting');
  });

  frame.addEventListener('pointermove', (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    const rect = frame.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const px = clamp((e.clientX - rect.left) / rect.width, 0, 1);
    const py = clamp((e.clientY - rect.top) / rect.height, 0, 1);

    nextRx = (0.5 - py) * 4.2;
    nextRy = (px - 0.5) * 5.2;
    nextMx = `${(px * 100).toFixed(1)}%`;
    nextMy = `${(py * 100).toFixed(1)}%`;

    if (!rafId) {
      rafId = requestAnimationFrame(applyTilt);
    }
  });

  frame.addEventListener('pointerleave', () => {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
    frame.classList.remove('is-tilting');
    frame.style.setProperty('--vm-rx', '0deg');
    frame.style.setProperty('--vm-ry', '0deg');
  });
}

const boardPillCtrl = initSlidingPill(document.querySelector<HTMLElement>('.board-filters'));
setupSearch();
setupInfoDialogs();
setupBoardFilter(boardPillCtrl);
setupAnchorLinks();
setupVisiMisi3D();
setupBoardCards3D();
setupEventShowcase();
setupTopNavAndPills();
