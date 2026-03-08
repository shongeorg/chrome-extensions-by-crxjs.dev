const STORAGE_KEY = 'todos'

let todos = []

// DOM elements
const form = document.getElementById('todo-form')
const input = document.getElementById('todo-input')
const list = document.getElementById('todo-list')
const stats = document.getElementById('todo-stats')

// Load todos from storage
async function loadTodos() {
  return new Promise((resolve) => {
    chrome.storage.local.get([STORAGE_KEY], (result) => {
      todos = result[STORAGE_KEY] || []
      resolve(todos)
    })
  })
}

// Save todos to storage
function saveTodos() {
  chrome.storage.local.set({ [STORAGE_KEY]: todos })
}

// Generate unique ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Create todo item element
function createTodoElement(todo) {
  const li = document.createElement('li')
  li.className = `todo-item${todo.completed ? ' completed' : ''}`
  li.dataset.id = todo.id

  const checkbox = document.createElement('input')
  checkbox.type = 'checkbox'
  checkbox.className = 'todo-checkbox'
  checkbox.checked = todo.completed
  checkbox.addEventListener('change', () => toggleTodo(todo.id))

  const text = document.createElement('span')
  text.className = 'todo-text'
  text.textContent = todo.text

  const deleteBtn = document.createElement('button')
  deleteBtn.className = 'delete-btn'
  deleteBtn.textContent = '×'
  deleteBtn.addEventListener('click', () => deleteTodo(todo.id))

  li.appendChild(checkbox)
  li.appendChild(text)
  li.appendChild(deleteBtn)

  return li
}

// Render stats
function renderStats() {
  const total = todos.length
  const completed = todos.filter(t => t.completed).length
  const pending = total - completed

  if (total === 0) {
    stats.style.display = 'none'
    return
  }

  stats.style.display = 'flex'
  stats.innerHTML = `
    <span>Total: ${total}</span>
    <span>✓ ${completed}</span>
    <span>○ ${pending}</span>
  `
}

// Render todo list
function renderTodos() {
  list.innerHTML = ''

  if (todos.length === 0) {
    const empty = document.createElement('li')
    empty.className = 'empty-state'
    empty.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-6 9l2 2 4-4"/>
      </svg>
      <p>No tasks yet. Add one above!</p>
    `
    list.appendChild(empty)
    renderStats()
    return
  }

  todos.forEach((todo) => {
    list.appendChild(createTodoElement(todo))
  })

  renderStats()
}

// Add new todo
function addTodo(text) {
  const todo = {
    id: generateId(),
    text: text.trim(),
    completed: false,
    createdAt: new Date().toISOString(),
  }
  todos.push(todo)
  saveTodos()
  renderTodos()
}

// Toggle todo completion
function toggleTodo(id) {
  const todo = todos.find((t) => t.id === id)
  if (todo) {
    todo.completed = !todo.completed
    saveTodos()
    renderTodos()
  }
}

// Delete todo
function deleteTodo(id) {
  todos = todos.filter((t) => t.id !== id)
  saveTodos()
  renderTodos()
}

// Form submit handler
form.addEventListener('submit', (e) => {
  e.preventDefault()
  const text = input.value.trim()
  if (text) {
    addTodo(text)
    input.value = ''
    input.focus()
  }
})

// Initialize
loadTodos().then(renderTodos)
