const API_BASE = 'https://api.exchangerate-api.com/v4/latest'

// Основні валюти для відображення
const MAIN_CURRENCIES = ['USD', 'EUR', 'GBP', 'UAH']

// Всі валюти для селектів
const CURRENCIES = {
  USD: '🇺🇸 US Dollar',
  EUR: '🇪🇺 Euro',
  GBP: '🇬🇧 British Pound',
  UAH: '🇺🇦 Ukrainian Hryvnia',
  JPY: '🇯🇵 Japanese Yen',
  CNY: '🇨🇳 Chinese Yuan',
  CHF: '🇨🇭 Swiss Franc',
  CAD: '🇨🇦 Canadian Dollar',
  AUD: '🇦🇺 Australian Dollar',
  RUB: '🇷🇺 Russian Ruble',
  PLN: '🇵🇱 Polish Zloty',
  CZK: '🇨🇿 Czech Koruna',
  TRY: '🇹🇷 Turkish Lira',
  INR: '🇮🇳 Indian Rupee',
  BRL: '🇧🇷 Brazilian Real',
  ZAR: '🇿🇦 South African Rand',
  KRW: '🇰🇷 South Korean Won',
  MXN: '🇲🇽 Mexican Peso',
  SGD: '🇸🇬 Singapore Dollar',
  HKD: '🇭🇰 Hong Kong Dollar',
  NOK: '🇳🇴 Norwegian Krone',
  SEK: '🇸🇪 Swedish Krona',
  DKK: '🇩🇰 Danish Krone',
  NZD: '🇳🇿 New Zealand Dollar',
}

// STORAGE keys
const STORAGE_KEYS = {
  CURRENCY_FROM: 'currencyFrom',
  CURRENCY_TO: 'currencyTo',
  BASE_CURRENCY: 'baseCurrency'
}

// DOM elements
const amountFrom = document.getElementById('amount-from')
const amountTo = document.getElementById('amount-to')
const currencyFrom = document.getElementById('currency-from')
const currencyTo = document.getElementById('currency-to')
const swapBtn = document.getElementById('swap-btn')
const ratesList = document.getElementById('rates-list')
const loader = document.getElementById('loader')

let rates = {}
let baseCurrency = 'USD'

// Populate currency selects
function populateSelects() {
  const options = Object.entries(CURRENCIES)
    .map(([code, name]) => `<option value="${code}">${name}</option>`)
    .join('')

  currencyFrom.innerHTML = options
  currencyTo.innerHTML = options

  // Set defaults
  currencyFrom.value = 'USD'
  currencyTo.value = 'UAH'
}

// Show loader
function showLoader() {
  loader.style.display = 'flex'
  ratesList.style.opacity = '0.3'
}

// Hide loader
function hideLoader() {
  loader.style.display = 'none'
  ratesList.style.opacity = '1'
}

// Fetch rates
async function fetchRates(currency = 'USD') {
  showLoader()
  try {
    const response = await fetch(`${API_BASE}/${currency}`)
    const data = await response.json()

    rates = data.rates
    baseCurrency = data.base

    renderRates()
    convertFromTo()
  } catch (error) {
    console.error('Error fetching rates:', error)
    ratesList.innerHTML = '<div class="error">❌ Failed to load rates</div>'
  } finally {
    hideLoader()
  }
}

// Render rates cards
function renderRates() {
  if (Object.keys(rates).length === 0) {
    ratesList.innerHTML = '<div class="empty">📭 No rates available</div>'
    return
  }

  // Show main currencies first
  const mainRates = MAIN_CURRENCIES.filter(c => c !== baseCurrency)
  
  ratesList.innerHTML = mainRates.map(code => {
    const rate = rates[code]
    const inverse = (1 / rate).toFixed(4)
    
    return `
      <div class="rate-card">
        <div class="rate-header">
          <span class="rate-flag">${getFlag(code)}</span>
          <span class="rate-code">${code}</span>
        </div>
        <div class="rate-values">
          <div class="rate-main">1 ${baseCurrency} = ${formatRate(rate)} ${code}</div>
          <div class="rate-inverse">1 ${code} = ${inverse} ${baseCurrency}</div>
        </div>
      </div>
    `
  }).join('')
}

// Get flag emoji for currency
function getFlag(code) {
  const flags = {
    USD: '🇺🇸',
    EUR: '🇪🇺',
    GBP: '🇬🇧',
    UAH: '🇺🇦',
    JPY: '🇯🇵',
    CNY: '🇨🇳',
    CHF: '🇨🇭',
    CAD: '🇨🇦',
    AUD: '🇦🇺',
    RUB: '🇷🇺',
    PLN: '🇵🇱',
    CZK: '🇨🇿',
    TRY: '🇹🇷',
    INR: '🇮🇳',
    BRL: '🇧🇷',
    ZAR: '🇿🇦',
    KRW: '🇰🇷',
    MXN: '🇲🇽',
    SGD: '🇸🇬',
    HKD: '🇭🇰',
    NOK: '🇳🇴',
    SEK: '🇸🇪',
    DKK: '🇩🇰',
    NZD: '🇳🇿',
  }
  return flags[code] || '💱'
}

// Format rate
function formatRate(rate) {
  if (rate >= 1000) return rate.toFixed(2)
  if (rate >= 1) return rate.toFixed(4)
  return rate.toFixed(6)
}

// Convert currency (from -> to)
function convertFromTo() {
  const from = currencyFrom.value
  const to = currencyTo.value
  const amount = parseFloat(amountFrom.value) || 0

  if (from === to) {
    amountTo.value = amount.toFixed(2)
    return
  }

  // Convert through base currency
  const fromRate = rates[from] || 1
  const toRate = rates[to] || 1
  
  let result
  
  if (baseCurrency === from) {
    result = amount * toRate
  } else if (baseCurrency === to) {
    result = amount / fromRate
  } else {
    const inUSD = amount / fromRate
    result = inUSD * toRate
  }

  amountTo.value = result.toFixed(4)
}

// Convert currency (to -> from)
function convertToFrom() {
  const from = currencyFrom.value
  const to = currencyTo.value
  const amount = parseFloat(amountTo.value) || 0

  if (from === to) {
    amountFrom.value = amount.toFixed(2)
    return
  }

  const fromRate = rates[from] || 1
  const toRate = rates[to] || 1
  
  let result
  
  if (baseCurrency === from) {
    result = amount / toRate
  } else if (baseCurrency === to) {
    result = amount * fromRate
  } else {
    const inUSD = amount / toRate
    result = inUSD * fromRate
  }

  amountFrom.value = result.toFixed(4)
}

// Swap currencies
function swapCurrencies() {
  const temp = currencyFrom.value
  const tempAmount = amountFrom.value
  
  currencyFrom.value = currencyTo.value
  currencyTo.value = temp
  
  amountFrom.value = amountTo.value
  
  fetchRates(currencyFrom.value)
}

// Event listeners
currencyFrom.addEventListener('change', () => {
  chrome.storage.local.set({ [STORAGE_KEYS.CURRENCY_FROM]: currencyFrom.value })
  fetchRates(currencyFrom.value)
})

currencyTo.addEventListener('change', () => {
  chrome.storage.local.set({ [STORAGE_KEYS.CURRENCY_TO]: currencyTo.value })
  convertFromTo()
})

amountFrom.addEventListener('input', convertFromTo)
amountTo.addEventListener('input', convertToFrom)
swapBtn.addEventListener('click', swapCurrencies)

// Initialize
async function init() {
  populateSelects()
  
  // Load saved currencies
  chrome.storage.local.get([STORAGE_KEYS.CURRENCY_FROM, STORAGE_KEYS.CURRENCY_TO], (result) => {
    if (result[STORAGE_KEYS.CURRENCY_FROM]) {
      currencyFrom.value = result[STORAGE_KEYS.CURRENCY_FROM]
    }
    if (result[STORAGE_KEYS.CURRENCY_TO]) {
      currencyTo.value = result[STORAGE_KEYS.CURRENCY_TO]
    }
    fetchRates(currencyFrom.value)
  })
}

init()
