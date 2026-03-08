const STORAGE_KEY = 'todos'

let todos = []

// DOM elements
const form = document.getElementById('todo-form')
const input = document.getElementById('todo-input')
const list = document.getElementById('todo-list')

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

// Render todo list
function renderTodos() {
  list.innerHTML = ''

  if (todos.length === 0) {
    const empty = document.createElement('li')
    empty.className = 'empty-state'
    empty.textContent = 'No tasks yet. Add one above!'
    list.appendChild(empty)
    return
  }

  todos.forEach((todo) => {
    list.appendChild(createTodoElement(todo))
  })
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
