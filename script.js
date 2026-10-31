const list = document.getElementById('todo-list');
const itemCountSpan = document.getElementById('item-count');
const uncheckedCountSpan = document.getElementById('unchecked-count');
const emptyMessage = document.getElementById('empty-message');

const STORAGE_KEY = 'todo-lab18-items';

// Завантажуємо збережені справи. Якщо їх немає, починаємо з порожнього списку.
function loadTodos() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!Array.isArray(saved)) return [];
    return saved.filter(todo =>
      todo && Number.isSafeInteger(todo.id) &&
      typeof todo.text === 'string' && typeof todo.completed === 'boolean'
    );
  } catch (error) {
    console.warn('Не вдалося завантажити список справ:', error);
    return [];
  }
}

let todos = loadTodos();
let nextId = Math.max(0, ...todos.map(todo => todo.id)) + 1;

function saveTodos() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    console.warn('Не вдалося зберегти список справ:', error);
  }
}

// Захищає HTML-розмітку від спеціальних символів у тексті користувача.
function escapeHTML(text) {
  return text.replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
}

function newTodo() {
  const answer = prompt('Введіть нову справу:');
  if (answer === null) return; // Натиснуто «Скасувати»

  const text = answer.trim();
  if (text === '') {
    alert('Назва справи не може бути порожньою!');
    return;
  }

  todos.push({ id: nextId++, text, completed: false });
  saveTodos();
  render(todos);
  updateCounter();
}

function renderTodo(todo) {
  return `
    <li class="list-group-item d-flex align-items-center gap-2">
      <input type="checkbox" class="form-check-input mt-0" id="todo-${todo.id}"
        ${todo.completed ? 'checked' : ''} onchange="checkTodo(${todo.id})">
      <label for="todo-${todo.id}" class="flex-grow-1 text-break mb-0">
        <span class="${todo.completed ? 'text-success text-decoration-line-through' : ''}">${escapeHTML(todo.text)}</span>
      </label>
      <button type="button" class="btn btn-danger btn-sm" onclick="deleteTodo(${todo.id})">Видалити</button>
    </li>`;
}

function render(items) {
  list.innerHTML = items.map(renderTodo).join('');
  emptyMessage.hidden = items.length > 0;
}

function updateCounter() {
  itemCountSpan.textContent = todos.length;
  uncheckedCountSpan.textContent = todos.filter(todo => !todo.completed).length;
}

function deleteTodo(id) {
  todos = todos.filter(todo => todo.id !== id);
  saveTodos();
  render(todos);
  updateCounter();
}

function checkTodo(id) {
  const todo = todos.find(todo => todo.id === id);
  if (!todo) return;

  todo.completed = !todo.completed;
  saveTodos();
  render(todos);
  updateCounter();
}

render(todos);
updateCounter();
