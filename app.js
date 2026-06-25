// Metrobus Announcement & Tracking System - Logic

// State variables
let state = {
  route: "34G",
  direction: "west", // 'west' = Beylikdüzü direction, 'east' = Söğütlüçeşme direction
  stations: [], // Current active stations list (filtered and ordered)
  currentIndex: 0, // Current station index
  isArrivalPhase: true, // true = at station, false = in transit to next
  gpsMode: false,
  gpsWatchId: null,
  alarmStationId: null, // Station ID to trigger alarm
  audioSource: "youtube", // 'youtube' or 'speech'
  vibrationEnabled: true,
  lastAnnouncedStationId: null,
  lastAnnouncedPhase: null, // 'arrival' or 'next'
  alarmActive: false,
  alarmInterval: null
};

// YouTube Player API State
let ytPlayer = null;
let ytApiReady = false;

// Web Audio Context (for synthesized gongs and alarms)
let audioCtx = null;

// Simulated variables for LED header
let ledSpeedInterval = null;

// Initialize when DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  initApp();
  initEventHandlers();
  startClockSim();
});

// Initialize App State
function initApp() {
  updateStationsList();
  populateAlarmDropdown();
  renderTimeline();
  updateLedScreen();
}

// Populates and filters the active station list based on route and direction
function updateStationsList() {
  if (!window.STATIONS || window.STATIONS.length === 0) return;

  let allStations = [...window.STATIONS];
  
  // Custom route filters (simulate actual Metrobus segments)
  if (state.route === "34AS") {
    // Avcılar - Söğütlüçeşme
    const avcIndex = allStations.findIndex(s => s.name.includes("Avcılar Merkez"));
    allStations = allStations.slice(0, avcIndex + 1);
  } else if (state.route === "34BZ") {
    // Beylikdüzü - Zincirlikuyu
    const zincIndex = allStations.findIndex(s => s.name.includes("Zincirlikuyu"));
    allStations = allStations.slice(zincIndex);
  } else if (state.route === "34C") {
    // Beylikdüzü - Cevizlibağ
    const cevizIndex = allStations.findIndex(s => s.name.includes("Cevizlibağ"));
    allStations = allStations.slice(cevizIndex);
  } else if (state.route === "34") {
    // Avcılar - Zincirlikuyu
    const zincIndex = allStations.findIndex(s => s.name.includes("Zincirlikuyu"));
    const avcIndex = allStations.findIndex(s => s.name.includes("Avcılar Merkez"));
    allStations = allStations.slice(zincIndex, avcIndex + 1);
  }
  
  // Order based on direction
  if (state.direction === "west") {
    // Söğütlüçeşme (East) to Beylikdüzü (West) -> Already in correct order
    state.stations = allStations;
  } else {
    // Reverse direction (Beylikdüzü to Söğütlüçeşme)
    state.stations = allStations.reverse();
  }

  // Reset indices
  state.currentIndex = 0;
  state.isArrivalPhase = true;
  state.lastAnnouncedStationId = null;
  state.lastAnnouncedPhase = null;

  document.getElementById("station-count").textContent = state.stations.length;
}

// Populates the "Beni Uyar" (Alert Me) dropdown list
function populateAlarmDropdown() {
  const select = document.getElementById("alarm-station-select");
  const currentValue = select.value;
  
  // Clear options (keep default)
  select.innerHTML = '<option value="">-- Durak Seçin --</option>';
  
  state.stations.forEach(station => {
    const opt = document.createElement("option");
    opt.value = station.id;
    opt.textContent = station.name;
    select.appendChild(opt);
  });

  // Restore value if still valid in the new route
  if (currentValue && state.stations.some(s => s.id == currentValue)) {
    select.value = currentValue;
    state.alarmStationId = parseInt(currentValue);
  } else {
    state.alarmStationId = null;
    document.getElementById("active-alarm-box").style.display = "none";
  }
}

// Binds all DOM elements to event handlers
function initEventHandlers() {
  // Dropdown changes
  document.getElementById("route-select").addEventListener("change", (e) => {
    state.route = e.target.value;
    updateStationsList();
    populateAlarmDropdown();
    renderTimeline();
    updateLedScreen();
    // Speak first station on route change
    triggerAnnouncement();
  });

  document.getElementById("direction-select").addEventListener("change", (e) => {
    state.direction = e.target.value;
    updateStationsList();
    populateAlarmDropdown();
    renderTimeline();
    updateLedScreen();
    triggerAnnouncement();
  });

  document.getElementById("alarm-station-select").addEventListener("change", (e) => {
    const val = e.target.value;
    if (val) {
      state.alarmStationId = parseInt(val);
      const targetStation = state.stations.find(s => s.id === state.alarmStationId);
      document.getElementById("alarm-status-text").textContent = `${targetStation.name} için alarm kuruldu!`;
      document.getElementById("active-alarm-box").style.display = "flex";
      renderTimeline(); // Redraw timeline to show bell icon
    } else {
      cancelAlarm();
    }
  });

  document.getElementById("btn-cancel-alarm").addEventListener("click", () => {
    cancelAlarm();
  });

  // Audio & Vibration toggles
  document.getElementById("toggle-audio-source").addEventListener("change", (e) => {
    state.audioSource = e.target.checked ? "youtube" : "speech";
    if (state.audioSource === "youtube") {
      initYoutubePlayer();
    }
  });

  document.getElementById("toggle-vibration").addEventListener("change", (e) => {
    state.vibrationEnabled = e.target.checked;
  });

  // Track modes
  document.getElementById("btn-gps-mode").addEventListener("click", () => {
    toggleTrackingMode(true);
  });

  document.getElementById("btn-manual-mode").addEventListener("click", () => {
    toggleTrackingMode(false);
  });

  // Manual Advance buttons
  document.getElementById("btn-prev-station").addEventListener("click", () => {
    navigateStation(-1);
  });

  document.getElementById("btn-next-station").addEventListener("click", () => {
    navigateStation(1);
  });

  document.getElementById("btn-arrive-station").addEventListener("click", () => {
    state.isArrivalPhase = true;
    updateLedScreen();
    renderTimeline();
    triggerAnnouncement();
  });

  document.getElementById("btn-next-announcement").addEventListener("click", () => {
    state.isArrivalPhase = false;
    updateLedScreen();
    renderTimeline();
    triggerAnnouncement();
  });

  // Destination modal close
  document.getElementById("btn-close-modal").addEventListener("click", () => {
    stopAlarmFeedback();
    document.getElementById("destination-modal").classList.remove("active");
  });

  // Load YouTube API
  if (state.audioSource === "youtube") {
    initYoutubePlayer();
  }
}

// Navigates stations manually
function navigateStation(direction) {
  // Reset audio context if first interaction
  initAudioCtx();

  if (direction === 1) {
    if (state.isArrivalPhase) {
      // At station, move to "in transit" phase to NEXT station
      if (state.currentIndex < state.stations.length - 1) {
        state.isArrivalPhase = false;
        state.currentIndex++;
      } else {
        // Already at last station
        showToast("Hattın son duraklarındasınız.");
        return;
      }
    } else {
      // In transit, arrive at the station we were heading to
      state.isArrivalPhase = true;
    }
  } else {
    // Navigate backwards
    if (!state.isArrivalPhase) {
      // In transit, return to arrival phase of previous station
      state.isArrivalPhase = true;
      state.currentIndex = Math.max(0, state.currentIndex - 1);
    } else {
      // At station, go back to transit phase
      if (state.currentIndex > 0) {
        state.isArrivalPhase = false;
      } else {
        showToast("Hattın başlangıç durağındasınız.");
        return;
      }
    }
  }

  updateLedScreen();
  renderTimeline();
  triggerAnnouncement();
  checkDestinationAlarm();
}

// Renders the vertical station list timeline
function renderTimeline() {
  const container = document.getElementById("stations-list");
  container.innerHTML = "";

  state.stations.forEach((station, idx) => {
    const item = document.createElement("div");
    item.className = "station-item";
    
    // Add state classes
    if (idx < state.currentIndex) {
      item.classList.add("past");
    } else if (idx === state.currentIndex) {
      if (state.isArrivalPhase) {
        item.classList.add("current");
      } else {
        item.classList.add("next"); // Heading towards this station
      }
    } else if (idx === state.currentIndex + 1 && !state.isArrivalPhase) {
      // Next station if we are in arrival phase of current
    }

    if (station.id === state.alarmStationId) {
      item.classList.add("target-alert");
    }

    // Node representing station on vertical line
    const node = document.createElement("div");
    node.className = "station-node";
    item.appendChild(node);

    // Station Info
    const info = document.createElement("div");
    info.className = "station-info";
    
    const name = document.createElement("div");
    name.className = "station-name";
    name.textContent = station.name;
    info.appendChild(name);

    // Meta (transfers)
    if (station.transfers && station.transfers.length > 0) {
      const meta = document.createElement("div");
      meta.className = "station-meta";
      station.transfers.forEach(t => {
        const badge = document.createElement("span");
        badge.className = "badge-transfer";
        badge.textContent = t;
        meta.appendChild(badge);
      });
      info.appendChild(meta);
    }

    item.appendChild(info);

    // Click on a timeline item lets user manually snap to that station
    item.addEventListener("click", () => {
      initAudioCtx();
      state.currentIndex = idx;
      state.isArrivalPhase = true;
      updateLedScreen();
      renderTimeline();
      triggerAnnouncement();
      checkDestinationAlarm();
    });

    container.appendChild(item);
  });

  // Scroll active item into view
  setTimeout(() => {
    const activeEl = container.querySelector(".current") || container.querySelector(".next");
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, 100);
}

// Updates the LED screen simulation
function updateLedScreen() {
  if (state.stations.length === 0) return;

  const currentStation = state.stations[state.currentIndex];
  const ledStation = document.getElementById("led-station");
  const ledLabel = document.getElementById("led-label");
  const ledInfo = document.getElementById("led-info-text");

  if (state.isArrivalPhase) {
    ledLabel.textContent = "İstasyona Geldik";
    ledStation.textContent = currentStation.name;
    
    // Set transfer details on marquee
    if (currentStation.transfers && currentStation.transfers.length > 0) {
      ledInfo.textContent = `Aktarma hatları: ${currentStation.transfers.join(", ")}. İniş yapacak yolcularımızın kapı önlerinde yığılma yapmaması önemle rica olunur.`;
    } else {
      ledInfo.textContent = `${currentStation.name} durağına hoş geldiniz. Kapılar açılıyor, iniş önceliği veriniz.`;
    }
  } else {
    ledLabel.textContent = "Sıradaki İstasyon";
    ledStation.textContent = currentStation.name;
    ledInfo.textContent = `Sıradaki istasyonumuz ${currentStation.name}. Lütfen yolculuk esnasında tutamaklara tutununuz.`;
  }
}

// Toggles between GPS tracking and manual control mode
function toggleTrackingMode(gpsEnabled) {
  initAudioCtx();

  const gpsBtn = document.getElementById("btn-gps-mode");
  const manualBtn = document.getElementById("btn-manual-mode");
  const gpsInd = document.getElementById("gps-indicator");
  const gpsText = document.getElementById("gps-text");
  const manualPanel = document.getElementById("manual-controls-panel");

  state.gpsMode = gpsEnabled;

  if (gpsEnabled) {
    gpsBtn.classList.add("active");
    manualBtn.classList.remove("active");
    gpsInd.classList.add("active");
    gpsText.textContent = "GPS Aranıyor...";
    manualPanel.style.display = "none";
    startGpsTracking();
  } else {
    gpsBtn.classList.remove("active");
    manualBtn.classList.add("active");
    gpsInd.classList.remove("active");
    gpsText.textContent = "GPS Çevrimdışı";
    manualPanel.style.display = "block";
    stopGpsTracking();
    document.getElementById("accuracy-banner").classList.remove("visible");
  }
}

// Starts HTML5 Geolocation API tracking
function startGpsTracking() {
  if (!navigator.geolocation) {
    showToast("Tarayıcınız GPS servisini desteklemiyor.");
    toggleTrackingMode(false);
    return;
  }

  state.gpsWatchId = navigator.geolocation.watchPosition(
    handleGpsUpdate,
    handleGpsError,
    { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
  );
}

// Stops HTML5 Geolocation API tracking
function stopGpsTracking() {
  if (state.gpsWatchId !== null) {
    navigator.geolocation.clearWatch(state.gpsWatchId);
    state.gpsWatchId = null;
  }
  clearInterval(ledSpeedInterval);
  document.getElementById("led-speed").textContent = "0 km/s";
}

// Handles incoming GPS coordinates
function handleGpsUpdate(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  const accuracy = position.coords.accuracy;
  const speed = position.coords.speed; // Speed in m/s

  // Update speed display
  if (speed !== null && speed >= 0) {
    const kmh = Math.round(speed * 3.6);
    document.getElementById("led-speed").textContent = `${kmh} km/s`;
  } else {
    // Generate simulated rolling speed around typical metrobus values (0 to 60)
    simulateRollingSpeed();
  }

  // Update GPS status text
  document.getElementById("gps-text").textContent = `Doğruluk: ${Math.round(accuracy)}m`;

  // Show warning banner if accuracy is low (e.g. > 50 meters)
  const banner = document.getElementById("accuracy-banner");
  if (accuracy > 50) {
    banner.classList.add("visible");
  } else {
    banner.classList.remove("visible");
  }

  // Find nearest station
  let closestStationIndex = -1;
  let minDistance = Infinity; // in meters

  state.stations.forEach((station, index) => {
    const dist = calculateDistance(lat, lon, station.lat, station.lon);
    if (dist < minDistance) {
      minDistance = dist;
      closestStationIndex = index;
    }
  });

  if (closestStationIndex !== -1) {
    // Metrobus GPS Tracking Logic
    // Arrival: inside 120m radius of the closest station
    // Transit: if we leave the station area and are heading to the next one
    const closestStation = state.stations[closestStationIndex];
    
    if (minDistance <= 120) {
      // We are AT the closest station
  if (state.currentIndex !== closestStationIndex || !state.isArrivalPhase) {
        state.currentIndex = closestStationIndex;
        state.isArrivalPhase = true;
        
        // Anons ve alarm sadece İLK GİRİŞTE bir kez çalmalı
        triggerAnnouncement();
        checkDestinationAlarm();
    }

    // Ekran güncellemeleri dışarıda kalıyor, GPS her taze sinyal verdiğinde yenileniyor
    if (state.isArrivalPhase) {
        updateLedScreen();
        renderTimeline();
    }
    } else {
      // In transit
      // If we are closest to station S but outside 120m, check direction
      // Usually, if we are moving from S to S+1, we play "S+1 gelecek istasyon" announcement
      // Let's check if the closest station is ahead of our current station index
      if (closestStationIndex > state.currentIndex) {
        // We have progressed to the next station's tracking zone
        state.currentIndex = closestStationIndex;
        state.isArrivalPhase = false; // transit phase
        updateLedScreen();
        renderTimeline();
        triggerAnnouncement();
      } else if (state.isArrivalPhase && minDistance > 180) {
        // We left our current station but closest hasn't changed yet (still moving)
        // Transition to transit phase for the upcoming station
        if (state.currentIndex < state.stations.length - 1) {
          state.currentIndex++;
          state.isArrivalPhase = false;
          updateLedScreen();
          renderTimeline();
          triggerAnnouncement();
        }
      }
    }
  }
}

// Handles GPS errors
function handleGpsError(error) {
  console.warn("GPS hatası:", error.message);
  document.getElementById("gps-text").textContent = "GPS Sinyali Yok";
  document.getElementById("accuracy-banner").classList.add("visible");
  simulateRollingSpeed();
}

// Simulates speed indicator when actual GPS speed is unavailable
function simulateRollingSpeed() {
  if (ledSpeedInterval) return;
  
  ledSpeedInterval = setInterval(() => {
    if (!state.gpsMode) {
      clearInterval(ledSpeedInterval);
      ledSpeedInterval = null;
      document.getElementById("led-speed").textContent = "0 km/s";
      return;
    }
    // Simple speed wiggle (between 25 and 55 km/h while moving)
    const baseSpeed = state.isArrivalPhase ? 0 : 42;
    const jitter = state.isArrivalPhase ? 0 : Math.floor(Math.random() * 15) - 7;
    const finalSpeed = Math.max(0, baseSpeed + jitter);
    document.getElementById("led-speed").textContent = `${finalSpeed} km/s`;
  }, 3000);
}

// Calculates distance in meters between coordinates using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in meters
}

// Trigger audio announcement based on selected source
function triggerAnnouncement() {
  if (state.stations.length === 0) return;

  const currentStation = state.stations[state.currentIndex];
  
  // Guard clause to avoid double announcements for the same state
  if (state.lastAnnouncedStationId === currentStation.id && 
      state.lastAnnouncedPhase === (state.isArrivalPhase ? 'arrival' : 'next')) {
    return;
  }

  // Update state
  state.lastAnnouncedStationId = currentStation.id;
  state.lastAnnouncedPhase = state.isArrivalPhase ? 'arrival' : 'next';

  // Determine video ID
  let videoId = state.isArrivalPhase ? currentStation.videoIdArrival : currentStation.videoIdNext;
  
  // Custom case: if heading to Söğütlüçeşme, the next station name announcements 
  // might not match. The playlist is built primarily for the West direction (to Beylikdüzü).
  // But wait, the playlist videos we parsed have both arrival and next announcements for each station.
  // If we are moving Eastbound, "Sıradaki istasyon: Uzunçayır" is the same videoId next as the Westbound "Sıradaki istasyon: Uzunçayır" (Wd45ZtVw5Zg)!
  // Yes! The station name video itself is direction-independent because it says "Sıradaki istasyon: Uzunçayır."
  // So the mapping works perfectly in both directions!

  if (state.audioSource === "youtube" && videoId && ytApiReady) {
    console.log(`YouTube anons çalınıyor: ${currentStation.name} (${state.isArrivalPhase ? 'Varış' : 'Gelecek'})`);
    playYouTubeAudio(videoId);
  } else {
    // Speech Synthesis fallback (or Halıcıoğlu arrival which has null videoIdArrival)
    console.log(`Speech synthesis anons çalınıyor: ${currentStation.name}`);
    playFallbackAnnouncement(currentStation);
  }
}

// Initialize Web Audio Context
function initAudioCtx() {
  if (audioCtx === null) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

// Synthesizes the famous Metrobus double chime (gong) using Web Audio API
function playSynthesizedGong(callback) {
  initAudioCtx();
  
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const now = audioCtx.currentTime;
  
  // First tone: C#5 (554.37 Hz)
  const osc1 = audioCtx.createOscillator();
  const gain1 = audioCtx.createGain();
  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(554.37, now);
  gain1.gain.setValueAtTime(0.001, now);
  gain1.gain.exponentialRampToValueAtTime(0.3, now + 0.05);
  gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
  
  osc1.connect(gain1);
  gain1.connect(audioCtx.destination);
  
  // Second tone: A4 (440 Hz) played shortly after
  const osc2 = audioCtx.createOscillator();
  const gain2 = audioCtx.createGain();
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(440.00, now + 0.35);
  gain2.gain.setValueAtTime(0.001, now + 0.35);
  gain2.gain.exponentialRampToValueAtTime(0.3, now + 0.4);
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
  
  osc2.connect(gain2);
  gain2.connect(audioCtx.destination);
  
  osc1.start(now);
  osc1.stop(now + 0.7);
  osc2.start(now + 0.35);
  osc2.stop(now + 1.3);

  // Trigger speech synthesis after gong ends (approx 800ms)
  if (callback) {
    setTimeout(callback, 800);
  }
}

// Uses Web Speech API (Text-to-Speech) in Turkish
function playFallbackAnnouncement(station) {
  // First play the gong
  playSynthesizedGong(() => {
    if (!('speechSynthesis' in window)) return;
    
    // Stop any running speech
    window.speechSynthesis.cancel();

    let textToSpeak = "";
    if (state.isArrivalPhase) {
      textToSpeak = `${station.name}.`;
      if (station.transfers && station.transfers.length > 0) {
        textToSpeak += ` Aktarma yapacak yolcularımız için: ${station.transfers.join(", ")} aktarması vardır.`;
      }
    } else {
      textToSpeak = `Sıradaki istasyon: ${station.name}.`;
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'tr-TR';
    utterance.rate = 0.95; // Slightly slower for clear subway acoustics
    utterance.pitch = 1.0;

    // Find a Turkish voice if available
    const voices = window.speechSynthesis.getVoices();
    const trVoice = voices.find(v => v.lang.includes("tr-TR") || v.lang.includes("tr"));
    if (trVoice) {
      utterance.voice = trVoice;
    }

    window.speechSynthesis.speak(utterance);
  });
}

// Dynamic injection of YouTube Player IFrame API
function initYoutubePlayer() {
  if (ytApiReady) return;

  // Define callback first so it's guaranteed to be available when the script loads
  window.onYouTubeIframeAPIReady = function() {
    console.log("onYouTubeIframeAPIReady tetiklendi.");
    try {
      ytPlayer = new YT.Player('yt-player', {
        height: '200',
        width: '200',
        videoId: 'Oke5EI1w6Qo', // placeholder initially
        playerVars: {
          'playsinline': 1,
          'controls': 0,
          'autoplay': 0,
          'showinfo': 0,
          'rel': 0
        },
        events: {
          'onReady': onPlayerReady,
          'onError': onPlayerError
        }
      });
    } catch (e) {
      console.error("YouTube Player oluşturulurken hata:", e);
    }
  };

  // If YT script was already loaded (e.g. page refresh/hot reloading), call immediately
  if (window.YT && window.YT.Player) {
    console.log("YT API zaten yüklü, callback doğrudan çağrılıyor.");
    window.onYouTubeIframeAPIReady();
    return;
  }

  if (document.getElementById("yt-iframe-api-script")) return;

  // Inject IFrame API script
  const tag = document.createElement('script');
  tag.id = "yt-iframe-api-script";
  tag.src = "https://www.youtube.com/iframe_api";
  const firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

function onPlayerReady(event) {
  console.log("YouTube Player API hazır.");
  ytApiReady = true;
  ytPlayer.setVolume(100);
}

function onPlayerError(event) {
  console.warn("YouTube oynatılamadı. Fallback moduna geçiliyor.", event.data);
  const currentStation = state.stations[state.currentIndex];
  playFallbackAnnouncement(currentStation);
}

// Plays a video via the hidden YouTube player
function playYouTubeAudio(videoId) {
  if (!ytPlayer || !ytApiReady) {
    console.log("YouTube Player henüz hazır değil, ses sentezi (fallback) çalınıyor.");
    const currentStation = state.stations[state.currentIndex];
    playFallbackAnnouncement(currentStation);
    return;
  }
  try {
    ytPlayer.cueVideoById({ videoId: videoId });
    // Playback must be triggered, wait slightly after cueing
    setTimeout(() => {
      ytPlayer.playVideo();
    }, 150);
  } catch (err) {
    console.error("YouTube playVideo hatası:", err);
    // Fallback on failure
    const currentStation = state.stations[state.currentIndex];
    playFallbackAnnouncement(currentStation);
  }
}

// Check if we reached the station set for destination alarm
function checkDestinationAlarm() {
  if (state.alarmStationId === null || state.alarmActive) return;

  const currentStation = state.stations[state.currentIndex];
  
  // Trigger if we arrive at the target station, or if we are moving TO it in the transit phase
  // In transit: (currentIndex matches target AND isArrivalPhase is false) means we just left the previous station and are heading to the alarm station.
  // This is the BEST time to alert the user so they can wake up/get ready!
  const isApproaching = (currentStation.id === state.alarmStationId && !state.isArrivalPhase);
  const isArrived = (currentStation.id === state.alarmStationId && state.isArrivalPhase);

  if (isApproaching || isArrived) {
    triggerDestinationAlarm(currentStation.name);
  }
}

// Triggers the alarms, vibration, and fullscreen modal
function triggerDestinationAlarm(stationName) {
  state.alarmActive = true;
  
  // Show fullscreen modal
  const modal = document.getElementById("destination-modal");
  const modalName = document.getElementById("modal-station-name");
  
  modalName.textContent = stationName;
  modal.classList.add("active");

  // Rhythmic vibration API loop (if supported)
  if (state.vibrationEnabled && ('vibrate' in navigator)) {
    navigator.vibrate([600, 300, 600, 300, 600]);
    state.alarmInterval = setInterval(() => {
      navigator.vibrate([600, 300, 600, 300, 600]);
    }, 3000);
  }

  // Synthesize alarm sound looping
  playSynthesizedAlarm();
}

// Synthesizes a loud alerting alarm sound using Web Audio API
function playSynthesizedAlarm() {
  if (!state.alarmActive) return;
  initAudioCtx();

  const playTone = () => {
    if (!state.alarmActive) return;
    
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'sawtooth';
    // Double pulse beep
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.setValueAtTime(1200, now + 0.15);
    
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start(now);
    osc.stop(now + 0.5);
  };

  // Run immediately and queue recurrence every 1.5 seconds
  playTone();
  state.alarmIntervalSynth = setInterval(playTone, 1500);
}

// Stops alarms, vibration, and clears target alarms
function stopAlarmFeedback() {
  state.alarmActive = false;
  
  if (state.alarmInterval) {
    clearInterval(state.alarmInterval);
    state.alarmInterval = null;
  }
  
  if (state.alarmIntervalSynth) {
    clearInterval(state.alarmIntervalSynth);
    state.alarmIntervalSynth = null;
  }

  if ('vibrate' in navigator) {
    navigator.vibrate(0); // Cancel ongoing vibration
  }

  cancelAlarm();
}

// Cancels and clears the alarm station selection
function cancelAlarm() {
  state.alarmStationId = null;
  document.getElementById("alarm-station-select").value = "";
  document.getElementById("active-alarm-box").style.display = "none";
  renderTimeline(); // Redraw timeline to remove bell icon
}

// Helper to update clock and simulated temperature on LED
function startClockSim() {
  const clock = document.getElementById("led-time");
  
  const updateClock = () => {
    const d = new Date();
    const h = String(d.getHours()).padStart(2, '0');
    const m = String(d.getMinutes()).padStart(2, '0');
    clock.textContent = `${h}:${m}`;
  };

  updateClock();
  setInterval(updateClock, 30000); // Update every 30 seconds

  // Temperature variance simulator
  const tempEl = document.getElementById("led-temp");
  setInterval(() => {
    // Variance between 22 and 27 degrees
    const variance = (Math.random() * 5 - 2.5);
    const baseTemp = 24;
    tempEl.textContent = `${Math.round(baseTemp + variance)}°C`;
  }, 60000);
}

// Helper function to display temporary toasts
function showToast(message) {
  const toast = document.createElement("div");
  toast.style.position = "fixed";
  toast.style.bottom = "20px";
  toast.style.left = "50%";
  toast.style.transform = "translateX(-50%)";
  toast.style.backgroundColor = "rgba(15, 23, 42, 0.9)";
  toast.style.color = "var(--accent-orange)";
  toast.style.border = "1px solid var(--accent-orange)";
  toast.style.padding = "10px 20px";
  toast.style.borderRadius = "20px";
  toast.style.fontSize = "13px";
  toast.style.fontWeight = "600";
  toast.style.zIndex = "2000";
  toast.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.5)";
  toast.textContent = message;

  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.5s";
    setTimeout(() => toast.remove(), 500);
  }, 2500);
}

// Make sure voices are loaded on Chromium/Android browsers
if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    // pre-load voices
    window.speechSynthesis.getVoices();
  };
}
