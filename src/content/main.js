// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getCSSVariables') {
    const variables = extractCSSVariables()
    sendResponse({ variables })
  }
  return true
})

// Extract CSS variables from computed styles
function extractCSSVariables() {
  const root = document.documentElement
  const styles = getComputedStyle(root)
  const variables = {}

  for (let i = 0; i < styles.length; i++) {
    const prop = styles[i]
    if (prop.startsWith('--')) {
      const value = styles.getPropertyValue(prop).trim()
      if (value) {
        variables[prop] = value
      }
    }
  }

  return variables
}
