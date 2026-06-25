// Metrobus Stations Data (from Söğütlüçeşme to Beylikdüzü Sondurak)
// Compatible with local file:// loading (defines a global window.STATIONS)

window.STATIONS = [
  {
    id: 1,
    name: "Söğütlüçeşme",
    lat: 40.9912,
    lon: 29.0375,
    transfers: ["Marmaray", "YHT (Yüksek Hızlı Tren)"],
    videoIdArrival: "2qh91Fni13g", // Metrobüs Söğütlüçeşme anonsu
    videoIdNext: "elg1azxLAf8", // Metrobüs Söğütlüçeşme gelecek istasyon anonsu (when leaving Söğütlüçeşme)
    audioArrival: "metrobus_sogutlucesme_anonsu.mp3",
    audioNext: "metrobus_sogutlucesme_gelecek_istasyon_anonsu.mp3",
  },
  {
    id: 2,
    name: "Fikirtepe",
    lat: 40.9926,
    lon: 29.0494,
    transfers: [],
    videoIdArrival: "8DK0NJtB8O0", // Metrobüs Fikirtepe anonsu
    videoIdNext: "v9ORSzfhaps" // Metrobüs Fikirtepe gelecek istasyon anonsu
  },
  {
    id: 3,
    name: "Uzunçayır",
    lat: 40.9984,
    lon: 29.0558,
    transfers: ["M4 Metro Hattı (Kadıköy-Sabiha Gökçen)"],
    videoIdArrival: "wvgngtggQh8", // Metrobüs Uzunçayır anonsu
    videoIdNext: "Wd45ZtVw5Zg" // Metrobüs Uzunçayır gelecek istasyon anonsu
  },
  {
    id: 4,
    name: "Acıbadem",
    lat: 41.0041,
    lon: 29.0526,
    transfers: [],
    videoIdArrival: "o4iW7u5nh2Y", // Metrobüs Acıbadem anonsu
    videoIdNext: "GELO-6TdDk4" // Metrobüs Acıbadem gelecek istasyon anonsu
  },
  {
    id: 5,
    name: "Altunizade",
    lat: 41.0211,
    lon: 29.0308,
    transfers: ["M5 Metro Hattı (Üsküdar-Çekmeköy)"],
    videoIdArrival: "oEGBcePnEI8", // Metrobüs Altunizade anonsu
    videoIdNext: "hSRJ6U0mA_E" // Metrobüs Altunizade gelecek istasyon anonsu
  },
  {
    id: 6,
    name: "Burhaniye",
    lat: 41.0264,
    lon: 29.0371,
    transfers: [],
    videoIdArrival: "tSxDLJ9Q89g", // Metrobüs Burhaniye anonsu
    videoIdNext: "z3Z2KH2gCk4" // Metrobüs Burhaniye gelecek istasyon anonsu
  },
  {
    id: 7,
    name: "15 Temmuz Şehitler Köprüsü",
    lat: 41.0360,
    lon: 29.0364,
    transfers: [],
    videoIdArrival: "QVbZmMiSpcQ", // Metrobüs 15 Temmuz Şehitler Köprüsü anonsu
    videoIdNext: "5YmS-d5QwTQ" // Metrobüs 15 Temmuz Şehitler Köprüsü gelecek istasyon anonsu
  },
  {
    id: 8,
    name: "Zincirlikuyu",
    lat: 41.0674,
    lon: 29.0118,
    transfers: ["M2 Metro Hattı", "M11 İstanbul Havalimanı Metrosu"],
    videoIdArrival: "roGDBEMUvLA", // Metrobüs Zincirlikuyu anonsu
    videoIdNext: "TUmAdMJhR0s" // Metrobüs Zincirlikuyu gelecek istasyon anonsu
  },
  {
    id: 9,
    name: "Mecidiyeköy",
    lat: 41.0631,
    lon: 28.9928,
    transfers: ["M2 Metro Hattı", "M7 Metro Hattı (Mecidiyeköy-Mahmutbey)"],
    videoIdArrival: "sUGeV6dlGwY", // Metrobüs Mecidiyeköy anonsu
    videoIdNext: "CQGyFsjxOos" // Metrobüs Mecidiyeköy gelecek istasyon anonsu
  },
  {
    id: 10,
    name: "Çağlayan(Adliye)",
    lat: 41.0664,
    lon: 28.9804,
    transfers: [],
    videoIdArrival: "z79LclTebTU", // Metrobüs Çağlayan anonsu
    videoIdNext: "wLwrsQckW7U" // Metrobüs Çağlayan gelecek istasyon anonsu
  },
  {
    id: 11,
    name: "Okmeydanı Hastane",
    lat: 41.0645,
    lon: 28.9698,
    transfers: ["Prof. Dr. Cemil Taşcıoğlu Şehir Hastanesi"],
    videoIdArrival: "blhOho-lb1U", // Metrobüs Okmeydanı Hastane anonsu
    videoIdNext: "ecUDeAqjKyg" // Metrobüs Okmeydanı Hastane gelecek istasyon anonsu
  },
  {
    id: 12,
    name: "Darülaceze - Perpa",
    lat: 41.0628,
    lon: 28.9610,
    transfers: [],
    videoIdArrival: "xxXcSKRBbw4", // Metrobüs Darülaceze - Perpa anonsu
    videoIdNext: "0N75EbVrosU" // Metrobüs Darülaceze - Perpa gelecek istasyon anonsu
  },
  {
    id: 13,
    name: "Okmeydanı",
    lat: 41.0592,
    lon: 28.9515,
    transfers: [],
    videoIdArrival: "rJlonv82CGE", // Metrobüs Okmeydanı anonsu
    videoIdNext: "RsnWieW2FIY" // Metrobüs Okmeydanı gelecek istasyon anonsu
  },
  {
    id: 14,
    name: "Halıcıoğlu",
    lat: 41.0521,
    lon: 28.9427,
    transfers: [],
    videoIdArrival: null, // Oynatma listesinde eksik (falls back to Speech Synthesis)
    videoIdNext: "wHId5jw5mR8" // Metrobüs Halıcıoğlu gelecek istasyon anonsu
  },
  {
    id: 15,
    name: "Ayvansaray - Eyüpsultan",
    lat: 41.0450,
    lon: 28.9388,
    transfers: ["T5 Tramvay Hattı (Cibali-Alibeyköy Cep Otogarı - yürüme mesafesi)"],
    videoIdArrival: "JF85iBUpaeU", // Metrobüs Ayvansaray - Eyüpsultan anonsu
    videoIdNext: "TsRPFic3eSs" // Metrobüs Ayvansaray gelecek istasyon anonsu
  },
  {
    id: 16,
    name: "Edirnekapı",
    lat: 41.0335,
    lon: 28.9328,
    transfers: ["T4 Tramvay Hattı (Topkapı-Mescid-i Selam)"],
    videoIdArrival: "WaTomlBWMXw", // Metrobüs Edirnekapı anonsu
    videoIdNext: "yeUUzXFLsBs" // Metrobüs Edirnekapı gelecek istasyon anonsu
  },
  {
    id: 17,
    name: "Bayrampaşa - Maltepe / Koç Üni. Hastanesi",
    lat: 41.0289,
    lon: 28.9272,
    transfers: ["M1A & M1B Metro Hatları (yürüme mesafesi)"],
    videoIdArrival: "pEEbXM-UyxM", // Metrobüs Bayrampaşa - Maltepe / Koç Üni. Hast. anonsu
    videoIdNext: "6HgZKCTdSwQ" // Metrobüs Bayrampaşa - Maltepe gelecek istasyon anonsu
  },
  {
    id: 18,
    name: "Topkapı - Şehit Mustafa Cambaz",
    lat: 41.0210,
    lon: 28.9221,
    transfers: ["T1 Tramvay Hattı (yürüme)", "T4 Tramvay Hattı (yürüme)"],
    videoIdArrival: "_l0AFetihBE", // Metrobüs Topkapı - Şehit Mustafa Cambaz anonsu
    videoIdNext: "r1ll4U3Qreg" // Metrobüs Topkapı gelecek istasyon anonsu
  },
  {
    id: 19,
    name: "Cevizlibağ",
    lat: 41.0175,
    lon: 28.9114,
    transfers: ["T1 Tramvay Hattı (Bağcılar-Kabataş)"],
    videoIdArrival: "qcQJdKMdDhw", // Metrobüs Cevizlibağ anonsu
    videoIdNext: "QuS7WlTiy74" // Metrobüs Cevizlibağ gelecek istasyon anonsu
  },
  {
    id: 20,
    name: "Merter",
    lat: 41.0125,
    lon: 28.8953,
    transfers: ["M1A Metro Hattı (Yenikapı-Atatürk Havalimanı)"],
    videoIdArrival: "c6lo6TSg3kQ", // Metrobüs Merter anonsu
    videoIdNext: "2jzS2E6ljbc" // Metrobüs Merter gelecek istasyon anonsu
  },
  {
    id: 21,
    name: "Zeytinburnu",
    lat: 41.0049,
    lon: 28.8872,
    transfers: ["M1A Metro Hattı", "T1 Tramvay Hattı"],
    videoIdArrival: "8hKTbBczZYU", // Metrobüs Zeytinburnu anonsu
    videoIdNext: "uUfJQrkr5Xk" // Metrobüs Zeytinburnu gelecek istasyon anonsu
  },
  {
    id: 22,
    name: "İncirli",
    lat: 40.9975,
    lon: 28.8752,
    transfers: ["M1A Metro Hattı", "M3 Metro Hattı (Bakırköy-Kayaşehir)"],
    videoIdArrival: "SLykUKwOasQ", // Metrobüs İncirli anonsu
    videoIdNext: "t1Q8A_YzOf4" // Metrobüs İncirli gelecek istasyon anonsu
  },
  {
    id: 23,
    name: "Bahçelievler",
    lat: 40.9958,
    lon: 28.8628,
    transfers: ["M1A Metro Hattı"],
    videoIdArrival: "zBO0w3gxrNU", // Metrobüs Bahçelievler anonsu
    videoIdNext: "VbJBxT-V_rg" // Metrobüs Bahçelievler gelecek istasyon anonsu
  },
  {
    id: 24,
    name: "Şirinevler",
    lat: 40.9912,
    lon: 28.8475,
    transfers: ["M1A Metro Hattı"],
    videoIdArrival: "Dy8_8zC4gyw", // Metrobüs Şirinevler anonsu
    videoIdNext: "8DCuufPqcC0" // Metrobüs Şirinevler gelecek istasyon anonsu
  },
  {
    id: 25,
    name: "Yenibosna",
    lat: 40.9904,
    lon: 28.8324,
    transfers: ["M1A Metro Hattı", "M9 Metro Hattı (Ataköy-Olimpiyat)"],
    videoIdArrival: "Dc45bh5gP0g", // Metrobüs Yenibosna anonsu
    videoIdNext: "6fHUhT81utA" // Metrobüs Yenibosna gelecek istasyon anonsu
  },
  {
    id: 26,
    name: "Sefaköy",
    lat: 40.9902,
    lon: 28.7998,
    transfers: [],
    videoIdArrival: "aRIREXY40wM", // Metrobüs Sefaköy anonsu
    videoIdNext: "e518LOfddAQ" // Metrobüs Sefaköy gelecek istasyon anonsu
  },
  {
    id: 27,
    name: "Beşyol",
    lat: 40.9882,
    lon: 28.7884,
    transfers: [],
    videoIdArrival: "U0CKkatxq2Y", // Metrobüs Beşyol anonsu
    videoIdNext: "WDP8wuUgOC0" // Metrobüs Beşyol gelecek istasyon anonsu
  },
  {
    id: 28,
    name: "Florya",
    lat: 40.9845,
    lon: 28.7771,
    transfers: [],
    videoIdArrival: "iRkduSdxvUU", // Metrobüs Florya anonsu
    videoIdNext: "dqPUTM6bLg4" // Metrobüs Florya gelecek istasyon anonsu
  },
  {
    id: 29,
    name: "Cennet Mahallesi",
    lat: 40.9818,
    lon: 28.7698,
    transfers: [],
    videoIdArrival: "WDHdP-ChINo", // Metrobüs Cennet Mahallesi anonsu
    videoIdNext: "BCPf-RSUtqE" // Metrobüs Cennet Mahallesi gelecek istasyon anonsu
  },
  {
    id: 30,
    name: "Küçükçekmece",
    lat: 40.9782,
    lon: 28.7644,
    transfers: ["Marmaray"],
    videoIdArrival: "H2uJyI2TPSc", // Metrobüs Küçükçekmece anonsu
    videoIdNext: "naOChGL5dew" // Metrobüs Küçükçekmece gelecek istasyon anonsu
  },
  {
    id: 31,
    name: "İBB Sosyal Tesisleri",
    lat: 40.9798,
    lon: 28.7392,
    transfers: [],
    videoIdArrival: "JU_Z3E5o58I", // Metrobüs İBB Sosyal Tesisleri anonsu
    videoIdNext: "FNYvy5i6KOo" // Metrobüs İBB Sosyal Tesisleri gelecek istasyon anonsu
  },
  {
    id: 32,
    name: "Şükrübey",
    lat: 40.9814,
    lon: 28.7298,
    transfers: [],
    videoIdArrival: "rhiCfjnBfRQ", // Metrobüs Şükrübey anonsu
    videoIdNext: "K9mEe83mCc4" // Metrobüs Şükrübey gelecek istasyon anonsu
  },
  {
    id: 33,
    name: "Avcılar Merkez Üniversite Kampüsü",
    lat: 40.9808,
    lon: 28.7188,
    transfers: [],
    videoIdArrival: "EmIZPD6-efw", // Metrobüs Avcılar Merkez Üni. Kampüsü anonsu
    videoIdNext: "7SEel0j30zk" // Metrobüs Avcılar Merkez gelecek istasyon anonsu
  },
  {
    id: 34,
    name: "Cihangir - Üniversite Mahallesi",
    lat: 40.9888,
    lon: 28.7028,
    transfers: [],
    videoIdArrival: "Ey3Tgm0aTTY", // Metrobüs Cihangir - Üniversite Mah. anonsu
    videoIdNext: "a_HtihsDQCs" // Metrobüs Cihangir gelecek istasyon anonsu
  },
  {
    id: 35,
    name: "Mustafa Kemal Paşa",
    lat: 40.9922,
    lon: 28.6948,
    transfers: [],
    videoIdArrival: "Se_0u8g-4Vg", // Metrobüs Mustafa Kemal Paşa anonsu
    videoIdNext: "zounNezROw0" // Metrobüs Mustafa Kemal Paşa gelecek istasyon anonsu
  },
  {
    id: 36,
    name: "Saadetdere Mahallesi",
    lat: 40.9972,
    lon: 28.6834,
    transfers: [],
    videoIdArrival: "9D7fhZOda7E", // Metrobüs Saadetdere Mahallesi anonsu
    videoIdNext: "ttWMEc-XGVA" // Metrobüs Saadetdere Mah. gelecek istasyon anonsu
  },
  {
    id: 37,
    name: "Haramidere Sanayi",
    lat: 41.0018,
    lon: 28.6758,
    transfers: [],
    videoIdArrival: "QyWHFhfyOL8", // Metrobüs Haramidere Sanayi anonsu
    videoIdNext: "RCI29ujSg6Y" // Metrobüs Haramidere Sanayi gelecek istasyon anonsu
  },
  {
    id: 38,
    name: "Haramidere",
    lat: 41.0058,
    lon: 28.6678,
    transfers: [],
    videoIdArrival: "0VsQkaiqb4I", // Metrobüs Haramidere anonsu
    videoIdNext: "D2Y8BrcAlAI" // Metrobüs Haramidere gelecek istasyon anonsu
  },
  {
    id: 40,
    name: "Güzelyurt", // wait, ID was skipped to 40 in layout or is it 39?
    lat: 41.0118,
    lon: 28.6548,
    transfers: [],
    videoIdArrival: "SM5d1iX_FHg", // Metrobüs Güzelyurt anonsu
    videoIdNext: "jWnZ57D8uyo" // Metrobüs Güzelyurt gelecek istasyon anonsu
  },
  {
    id: 41,
    name: "Beylikdüzü",
    lat: 41.0158,
    lon: 28.6438,
    transfers: [],
    videoIdArrival: "H_QdLstr8xY", // Metrobüs Beylikdüzü anonsu
    videoIdNext: "qATb0wGyfbk" // Metrobüs Beylikdüzü gelecek istasyon anonsu
  },
  {
    id: 42,
    name: "Beylikdüzü Belediye",
    lat: 41.0188,
    lon: 28.6368,
    transfers: [],
    videoIdArrival: "lgvBnaBQwl0", // Metrobüs Beylikdüzü Belediye anonsu
    videoIdNext: "AenJuXeIq9E" // Metrobüs Beylikdüzü Belediye gelecek istasyon anonsu
  },
  {
    id: 43,
    name: "Cumhuriyet Mahallesi",
    lat: 41.0212,
    lon: 28.6298,
    transfers: [],
    videoIdArrival: "e94FNRvIx3Y", // Metrobüs Cumhuriyet Mahallesi anonsu
    videoIdNext: "iIi2Yt9kocI" // Metrobüs Cumhuriyet Mah. gelecek istasyon anonsu
  },
  {
    id: 44,
    name: "Beykent",
    lat: 41.0214,
    lon: 28.6188,
    transfers: [],
    videoIdArrival: "M9W_Q5Q6Bqk", // Metrobüs Beykent anonsu
    videoIdNext: "PTicZ78xz3M" // Metrobüs Beykent gelecek istasyon anonsu
  },
  {
    id: 45, // Wait, changed index to 45 so we keep the exact array items
    name: "Beylikdüzü Son Durak(TÜYAP)",
    lat: 41.0172,
    lon: 28.6258,
    transfers: [],
    videoIdArrival: "jR0eIammQDg", // Metrobüs Beylikdüzü Son Durak anonsu
    videoIdNext: "7Lt1cOT4R0A"
  }
];

// Re-index cleanly so ID matches array index + 1
window.STATIONS.forEach((station, index) => {
  station.id = index + 1;
});
