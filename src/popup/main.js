const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_API_KEY
const PEXELS_KEY = import.meta.env.VITE_PEXELS_API_KEY
const PIXABAY_KEY = import.meta.env.VITE_PIXABAY_API_KEY

const imageEl = document.getElementById('random-image')
const loaderEl = document.getElementById('loader')
const statusEl = document.getElementById('status')
const refreshBtn = document.getElementById('refresh-btn')
const apiSelect = document.getElementById('api-select')
const imageInfoEl = document.getElementById('image-info')
const copyButtons = document.querySelectorAll('.size-btn')

let currentImage = {
  src: '',
  original: '',
  photographer: '',
  source: ''
}

// Show status message
function showStatus(message, type = 'info') {
  statusEl.textContent = message
  statusEl.className = `status visible ${type}`
  setTimeout(() => {
    statusEl.className = 'status'
  }, 2000)
}

// Show loader
function showLoader() {
  loaderEl.style.display = 'flex'
  imageEl.style.opacity = '0'
}

// Hide loader
function hideLoader() {
  loaderEl.style.display = 'none'
  imageEl.style.opacity = '1'
}

// Get random image from Unsplash
async function fetchUnsplash() {
  const response = await fetch(`https://api.unsplash.com/photos/random?client_id=${UNSPLASH_KEY}&w=800`)
  const data = await response.json()
  
  return {
    src: data.urls.regular,
    original: data.urls.full,
    photographer: data.user.name,
    source: 'unsplash',
    sizes: {
      thumb: data.urls.thumb,
      small: data.urls.small,
      medium: `${data.urls.regular}?w=800`,
      large: `${data.urls.regular}?w=1600`,
      original: data.urls.full
    }
  }
}

// Get random image from Pexels
async function fetchPexels() {
  const response = await fetch('https://api.pexels.com/v1/curated?per_page=1', {
    headers: {
      Authorization: PEXELS_KEY
    }
  })
  const data = await response.json()
  const photo = data.photos[0]
  
  return {
    src: photo.src.medium,
    original: photo.src.original,
    photographer: photo.photographer,
    source: 'pexels',
    sizes: {
      thumb: photo.src.tiny,
      small: photo.src.small,
      medium: photo.src.medium,
      large: photo.src.large,
      original: photo.src.original
    }
  }
}

// Get random image from Pixabay
async function fetchPixabay() {
  const response = await fetch(`https://pixabay.com/api/?key=${PIXABAY_KEY}&image_type=photo&per_page=1`)
  const data = await response.json()
  const hit = data.hits[0]
  
  return {
    src: hit.webformatURL,
    original: hit.largeImageURL,
    photographer: hit.user,
    source: 'pixabay',
    sizes: {
      thumb: hit.previewURL,
      small: hit.webformatURL,
      medium: `${hit.webformatURL.replace('/640-', '/800-')}`,
      large: hit.largeImageURL,
      original: hit.imageURL
    }
  }
}

// Fetch image based on selected API
async function fetchImage() {
  showLoader()
  
  try {
    const api = apiSelect.value
    let result
    
    if (api === 'unsplash') {
      result = await fetchUnsplash()
    } else if (api === 'pexels') {
      result = await fetchPexels()
    } else if (api === 'pixabay') {
      result = await fetchPixabay()
    }
    
    currentImage = result
    imageEl.src = result.src
    imageInfoEl.textContent = `📷 ${result.photographer} (${api})`
    showStatus('Image loaded!', 'success')
  } catch (error) {
    console.error('Error fetching image:', error)
    showStatus('Failed to load image', 'error')
  } finally {
    hideLoader()
  }
}

// Copy to clipboard
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
    showStatus('URL copied!', 'success')
  } catch (err) {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    showStatus('URL copied!', 'success')
  }
}

// Image load handler
imageEl.addEventListener('load', () => {
  hideLoader()
})

imageEl.addEventListener('error', () => {
  showStatus('Failed to load image', 'error')
  hideLoader()
})

// Refresh button
refreshBtn.addEventListener('click', fetchImage)

// API select change
apiSelect.addEventListener('change', fetchImage)

// Copy buttons
copyButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const size = btn.dataset.size
    if (currentImage.sizes && currentImage.sizes[size]) {
      copyToClipboard(currentImage.sizes[size])
    }
  })
})

// Initialize
fetchImage()
