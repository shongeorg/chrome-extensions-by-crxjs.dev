const API_BASE = 'https://de1.api.radio-browser.info/json/stations/bycountry'

const STORAGE_KEYS = {
  STATIONS: 'stations',
  ACTIVE_STATION: 'activeStation',
  COUNTRY: 'selectedCountry',
  INDEX: 'stationIndex'
}

// DOM elements
const countrySelect = document.getElementById('country-select')
const stationsList = document.getElementById('stations-list')
const loader = document.getElementById('loader')
const stationName = document.getElementById('station-name')
const stationStatus = document.getElementById('station-status')
const playPauseBtn = document.getElementById('play-pause-btn')
const stopBtn = document.getElementById('stop-btn')
const prevBtn = document.getElementById('prev-btn')
const nextBtn = document.getElementById('next-btn')
const volumeSlider = document.getElementById('volume-slider')
const volumeIcon = document.querySelector('.volume-icon')

let stations = []
let currentIndex = -1
let audio = null
let isPlaying = false

// Load data from storage
async function loadFromStorage(key) {
  return new Promise((resolve) => {
    chrome.storage.local.get([key], (result) => {
      resolve(result[key])
    })
  })
}

// Save data to storage
function saveToStorage(key, value) {
  chrome.storage.local.set({ [key]: value })
}

// Show loader
function showLoader() {
  loader.classList.add('visible')
  stationsList.style.opacity = '0.3'
}

// Hide loader
function hideLoader() {
  loader.classList.remove('visible')
  stationsList.style.opacity = '1'
}

// Fetch stations by country
async function fetchStations(country) {
  showLoader()
  try {
    const response = await fetch(`${API_BASE}/${encodeURIComponent(country)}`)
    const data = await response.json()
    
    // Sort by votes and limit to 50
    stations = data
      .sort((a, b) => b.votes - a.votes)
      .slice(0, 50)
    
    saveToStorage(STORAGE_KEYS.STATIONS, stations)
    renderStations()
  } catch (error) {
    console.error('Error fetching stations:', error)
    stationsList.innerHTML = '<div class="error">❌ Failed to load stations</div>'
  } finally {
    hideLoader()
  }
}

// Render stations list
function renderStations() {
  if (stations.length === 0) {
    stationsList.innerHTML = '<div class="empty">📭 No stations found</div>'
    return
  }

  stationsList.innerHTML = stations.map((station, index) => `
    <div class="station-card ${index === currentIndex ? 'active' : ''}" data-index="${index}">
      <div class="station-favicon">
        ${station.favicon 
          ? `<img src="${station.favicon}" alt="" onerror="this.parentElement.textContent='📻'">` 
          : '📻'}
      </div>
      <div class="station-info">
        <div class="station-card-name">${escapeHtml(station.name)}</div>
        <div class="station-card-meta">
          ${station.bitrate ? `🎵 ${station.bitrate}kbps` : ''}
          ${station.codec ? `· ${station.codec}` : ''}
        </div>
      </div>
      <div class="station-status-icon">
        ${index === currentIndex ? '🔊' : ''}
      </div>
    </div>
  `).join('')

  // Add click handlers
  stationsList.querySelectorAll('.station-card').forEach(card => {
    card.addEventListener('click', () => {
      const index = parseInt(card.dataset.index)
      playStation(index)
    })
  })
}

// Escape HTML
function escapeHtml(text) {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

// Play station
async function playStation(index) {
  if (index < 0 || index >= stations.length) return

  currentIndex = index
  const station = stations[index]

  // Stop current audio
  if (audio) {
    audio.pause()
    audio = null
  }

  // Update UI
  stationName.textContent = station.name
  stationStatus.textContent = '📡 Connecting...'
  playPauseBtn.textContent = '⏸️'
  isPlaying = true

  // Save to storage
  saveToStorage(STORAGE_KEYS.ACTIVE_STATION, station)
  saveToStorage(STORAGE_KEYS.INDEX, index)

  // Create audio element
  audio = new Audio(station.url_resolved || station.url)
  audio.volume = volumeSlider.value / 100

  audio.addEventListener('canplay', () => {
    stationStatus.textContent = '🔊 Playing'
    audio.play()
  })

  audio.addEventListener('error', () => {
    stationStatus.textContent = '❌ Error loading stream'
    playPauseBtn.textContent = '▶️'
    isPlaying = false
  })

  audio.addEventListener('waiting', () => {
    stationStatus.textContent = '📡 Buffering...'
  })

  audio.addEventListener('playing', () => {
    stationStatus.textContent = '🔊 Playing'
  })

  // Update station list
  renderStations()

  // Auto-scroll to active station
  setTimeout(() => {
    const activeCard = stationsList.querySelector('.station-card.active')
    if (activeCard) {
      activeCard.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
    }
  }, 100)
}

// Toggle play/pause
function togglePlayPause() {
  if (!audio || currentIndex === -1) {
    if (stations.length > 0) {
      playStation(0)
    }
    return
  }

  if (isPlaying) {
    audio.pause()
    playPauseBtn.textContent = '▶️'
    stationStatus.textContent = '⏸️ Paused'
    isPlaying = false
  } else {
    audio.play()
    playPauseBtn.textContent = '⏸️'
    stationStatus.textContent = '🔊 Playing'
    isPlaying = true
  }
}

// Stop playback
function stopPlayback() {
  if (audio) {
    audio.pause()
    audio = null
  }
  playPauseBtn.textContent = '▶️'
  stationStatus.textContent = ''
  stationName.textContent = 'Select a station'
  isPlaying = false
  currentIndex = -1
  saveToStorage(STORAGE_KEYS.INDEX, -1)
  renderStations()
}

// Previous station
function playPrevious() {
  if (stations.length === 0) return
  const newIndex = currentIndex <= 0 ? stations.length - 1 : currentIndex - 1
  playStation(newIndex)
}

// Next station
function playNext() {
  if (stations.length === 0) return
  const newIndex = currentIndex >= stations.length - 1 ? 0 : currentIndex + 1
  playStation(newIndex)
}

// Set volume
function setVolume(value) {
  if (audio) {
    audio.volume = value / 100
  }
  
  // Update volume icon
  if (value == 0) {
    volumeIcon.textContent = '🔇'
  } else if (value < 50) {
    volumeIcon.textContent = '🔉'
  } else {
    volumeIcon.textContent = '🔊'
  }
}

// Country select change
countrySelect.addEventListener('change', (e) => {
  saveToStorage(STORAGE_KEYS.COUNTRY, e.target.value)
  fetchStations(e.target.value)
})

// Player controls
playPauseBtn.addEventListener('click', togglePlayPause)
stopBtn.addEventListener('click', stopPlayback)
prevBtn.addEventListener('click', playPrevious)
nextBtn.addEventListener('click', playNext)
volumeSlider.addEventListener('input', (e) => setVolume(e.target.value))

// Initialize
async function init() {
  // Load saved country
  const savedCountry = await loadFromStorage(STORAGE_KEYS.COUNTRY)
  if (savedCountry) {
    countrySelect.value = savedCountry
  }

  // Load saved stations
  const savedStations = await loadFromStorage(STORAGE_KEYS.STATIONS)
  if (savedStations && savedStations.length > 0) {
    stations = savedStations
    renderStations()
  }

  // Load saved active station
  const savedIndex = await loadFromStorage(STORAGE_KEYS.INDEX)
  const savedStation = await loadFromStorage(STORAGE_KEYS.ACTIVE_STATION)
  
  if (savedStation && savedIndex >= 0) {
    currentIndex = savedIndex
    stationName.textContent = savedStation.name
    playStation(savedIndex)
    isPlaying = false // Will be set by audio events
    playPauseBtn.textContent = '▶️'
  }

  // Fetch stations if not loaded
  if (stations.length === 0) {
    fetchStations(countrySelect.value)
  } else if (currentIndex >= 0) {
    // Scroll to saved station if stations already loaded
    setTimeout(() => {
      const activeCard = stationsList.querySelector('.station-card.active')
      if (activeCard) {
        activeCard.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        })
      }
    }, 200)
  }
}

init()
