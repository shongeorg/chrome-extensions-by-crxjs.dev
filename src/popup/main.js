const cssOutput = document.getElementById('css-output')
const copyBtn = document.getElementById('copy-btn')
const refreshBtn = document.getElementById('refresh-btn')
const status = document.getElementById('status')
const variablesList = document.getElementById('variables-list')
const countBadge = document.getElementById('count-badge')

let cssVariablesText = ''
let allVariables = {}

// Show status message
function showStatus(message, type = 'info') {
  status.textContent = message
  status.className = `status visible ${type}`
  setTimeout(() => {
    status.className = 'status'
  }, 2000)
}

// Check if value is a color
function isColorValue(value) {
  const colorPatterns = [
    /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i,
    /^rgb\(/i,
    /^rgba\(/i,
    /^hsl\(/i,
    /^hsla\(/i,
    /^(transparent|currentColor|inherit)$/i,
    /^[a-z]+$/i // named colors like "red", "blue", etc.
  ]
  return colorPatterns.some(pattern => pattern.test(value))
}

// Render variables list with color previews
function renderVariables(variables) {
  const entries = Object.entries(variables)
  
  if (entries.length === 0) {
    variablesList.innerHTML = `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62c-5.053-1.395-6.97-5.31-7.37-7.912m3.982 9.532a16.032 16.032 0 0 1-3.982-1.62m0 0a15.993 15.993 0 0 1-3.388-1.62c5.053-1.395 6.97-5.31 7.37-7.912"/>
        </svg>
        <p>No CSS variables found on this page</p>
      </div>
    `
    countBadge.textContent = '0'
    return
  }
  
  countBadge.textContent = entries.length
  
  variablesList.innerHTML = entries.map(([key, value]) => {
    const isColor = isColorValue(value)
    const previewClass = isColor ? 'variable-color-preview has-color' : 'variable-color-preview'
    
    return `
      <div class="variable-item" data-name="${key}" data-value="${value}" title="Click to copy">
        <div class="${previewClass}" ${isColor ? 'style="--color-value: ' + value + '"' : ''}></div>
        <span class="variable-name">${key}</span>
        <span class="variable-value">${value}</span>
      </div>
    `
  }).join('')
  
  // Add click handlers to copy individual variables
  variablesList.querySelectorAll('.variable-item').forEach(item => {
    item.addEventListener('click', () => {
      const name = item.dataset.name
      const value = item.dataset.value
      copyToClipboard(`${name}: ${value};`)
      item.classList.add('copied')
      setTimeout(() => {
        item.classList.remove('copied')
      }, 1000)
    })
  })
}

// Loading state
function showLoading() {
  variablesList.innerHTML = `
    <div class="loading">
      <div class="loading-spinner"></div>
    </div>
  `
  countBadge.textContent = '...'
}

// Format variables as :root { ... }
function formatCSSRoot(variables) {
  const entries = Object.entries(variables)
  if (entries.length === 0) return ''

  let output = ':root {\n'
  entries.forEach(([key, value]) => {
    output += `  ${key}: ${value};\n`
  })
  output += '}'
  return output
}

// Copy to clipboard
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
    showStatus('Copied!', 'success')
  } catch (err) {
    // Fallback for older browsers
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    showStatus('Copied!', 'success')
  }
}

// Request CSS variables from content script
async function getCSSVariables() {
  showLoading()
  
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

    if (!tab) {
      showStatus('No active tab found', 'error')
      variablesList.innerHTML = ''
      return
    }

    // Check if it's a valid HTTP/HTTPS page
    if (!tab.url || !tab.url.startsWith('http')) {
      showStatus('Cannot extract from this page', 'error')
      variablesList.innerHTML = ''
      return
    }

    // Send message to content script
    chrome.tabs.sendMessage(tab.id, { action: 'getCSSVariables' }, (response) => {
      if (chrome.runtime.lastError) {
        showStatus('Refresh the page and try again', 'error')
        variablesList.innerHTML = ''
        countBadge.textContent = '0'
        return
      }

      if (response && response.variables) {
        allVariables = response.variables
        cssVariablesText = formatCSSRoot(response.variables)
        
        renderVariables(response.variables)
        
        if (Object.keys(response.variables).length === 0) {
          showStatus('No variables found', 'info')
        } else {
          showStatus(`Found ${Object.keys(response.variables).length} variables`, 'success')
        }
      }
    })
  } catch (err) {
    showStatus('Error extracting variables', 'error')
  }
}

// Copy all button handler
copyBtn.addEventListener('click', () => {
  if (cssVariablesText) {
    copyToClipboard(cssVariablesText)
    cssOutput.textContent = cssVariablesText
    cssOutput.classList.add('visible')
  } else {
    showStatus('Nothing to copy', 'info')
  }
})

// Refresh button handler
refreshBtn.addEventListener('click', () => {
  cssOutput.classList.remove('visible')
  getCSSVariables()
})

// Initialize
getCSSVariables()
