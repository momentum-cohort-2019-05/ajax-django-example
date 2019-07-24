/* globals fetch */

function main () {
  loadTodosFromApi()
  setupNewTodoForm()
  setupDoneCheckboxes()
}

function createDomNodes (htmlText) {
  // Turns some HTML in a string into DOM nodes so that we can
  // update the DOM without rewriting the entire innerHTML of an
  // element.
  return document.createRange().createContextualFragment(htmlText)
}

function setupDoneCheckboxes () {
  const app = document.querySelector('#todos-app')
  app.addEventListener('change', function (event) {
    if (event.target && event.target.classList.contains('todo-done-checkbox')) {
      markTodoDone(event.target.dataset['todoId'], event.target.checked)
    }
  })
}

function markTodoDone (todoId, isDone) {
  fetch(`/api/todos/${todoId}/`, {
    method: 'PATCH',
    body: JSON.stringify({ 'done': isDone })
  })
}

function setupNewTodoForm () {
  const form = document.querySelector('#new-todo-form')
  form.addEventListener('submit', function (event) {
    // stops page reload
    event.preventDefault()
    const newTodoDescription = document.querySelector('#new-todo').value
    createNewTodoWithApi(newTodoDescription)
  })
}

function createNewTodoWithApi (todoDescription) {
  return fetch('/api/todos/', {
    method: 'POST',
    body: JSON.stringify({ 'description': todoDescription })
  })
    .then(res => res.json())
    .then(todo => {
      const node = createDomNodes(todoHtml(todo))
      const el = document.querySelector('#todos-app')
      el.appendChild(node)
    })
}

function loadTodosFromApi () {
  fetch('/api/todos')
    .then(res => res.json())
    .then(data => {
      const todos = data.todos
      const el = document.querySelector('#todos-app')
      el.innerHTML = todosHtml(todos)
    })
}

function todosHtml (todos) {
  return todos.map(todo => todoHtml(todo)).join('\n')
}

function checkedStatus (todo) {
  if (todo.done) {
    return 'checked'
  } else {
    return ''
  }
}

function todoHtml (todo) {
  return `
  <div class="pad-xs" data-todo-id="${todo.id}">
    <input type="checkbox" class="todo-done-checkbox" data-todo-id="${todo.id}" 
      ${checkedStatus(todo)}> ${todo.description}
  </div>
  `
}

document.addEventListener('DOMContentLoaded', main)
