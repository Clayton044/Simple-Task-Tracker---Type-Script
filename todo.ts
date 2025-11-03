// todo.ts

interface TodoItem {
  id: number;
  text: string;
  done: boolean;
}

let tasks: TodoItem[] = [];

// DOM elements
const input = document.getElementById('taskInput') as HTMLInputElement | null;
const addBtn = document.getElementById('addBtn') as HTMLButtonElement | null;
const container = document.getElementById('taskContainer') as HTMLDivElement | null;
const menu = document.getElementById('menu') as HTMLDivElement | null;
const editOption = document.getElementById('editOption') as HTMLParagraphElement | null;
const doneOption = document.getElementById('doneOption') as HTMLParagraphElement | null;
const deleteOption = document.getElementById('deleteOption') as HTMLParagraphElement | null;

let clickedTaskIndex: number | null = null;

// safety: ensure elements exist
if (!input || !addBtn || !container || !menu || !editOption || !doneOption || !deleteOption) {
  throw new Error('Missing required DOM elements. Make sure index.html includes all elements with correct IDs.');
}

function showTasks(): void {
  if (tasks.length === 0) {
    container.innerHTML = '<p>No Tasks Yet</p>';
    return;
  }

  let listHTML = '<ol>';
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    const doneStyle = task.done ? 'style="text-decoration: line-through; color: gray;"' : '';
    // data-index to identify which task
    listHTML += `<li data-index="${i}" ${doneStyle}>${escapeHtml(task.text)}</li>`;
  }
  listHTML += '</ol>';
  container.innerHTML = listHTML;

  // add click listener to each <li>
  const allTasks = container.querySelectorAll('li');
  allTasks.forEach((li) => {
    li.addEventListener('click', (event) => showMenu(event as MouseEvent, li as HTMLLIElement));
  });
}

// add a new task
function addTask(): void {
  const newTask = input.value.trim();
  if (newTask === '') {
    alert('Please enter a valid task.');
    return;
  }
  const todo: TodoItem = { id: Date.now(), text: newTask, done: false };
  tasks.push(todo);
  input.value = '';
  showTasks();
}

// show menu near mouse for a specific li
function showMenu(event: MouseEvent, li: HTMLLIElement): void {
  event.preventDefault();
  event.stopPropagation(); // prevent document click handler from immediately hiding

  const idxStr = li.getAttribute('data-index');
  if (idxStr === null) return;
  clickedTaskIndex = parseInt(idxStr, 10);

  // position menu and show
  if (menu) {
    menu.style.display = 'block';
    
    const pageX = event.pageX;
    const pageY = event.pageY;
    menu.style.left = `${pageX}px`;
    menu.style.top = `${pageY}px`;
    menu.setAttribute('aria-hidden', 'false');
  }
}

// hide menu when clicking outside it
document.addEventListener('click', (event) => {
  if (!menu) return;
  const target = event.target as Node;
  if (!menu.contains(target)) {
    menu.style.display = 'none';
    menu.setAttribute('aria-hidden', 'true');
    clickedTaskIndex = null;
  }
});

// Edit
editOption.addEventListener('click', () => {
  if (clickedTaskIndex === null) return;
  const old = tasks[clickedTaskIndex].text;
  const newText = prompt('Edit your task:', old);
  if (newText !== null) {
    const trimmed = newText.trim();
    if (trimmed !== '') {
      tasks[clickedTaskIndex].text = trimmed;
      showTasks();
    } else {
      alert('Task cannot be empty.');
    }
  }
  hideMenu();
});

// Toggle done
doneOption.addEventListener('click', () => {
  if (clickedTaskIndex === null) return;
  tasks[clickedTaskIndex].done = !tasks[clickedTaskIndex].done;
  showTasks();
  hideMenu();
});

// Delete
deleteOption.addEventListener('click', () => {
  if (clickedTaskIndex === null) return;
  const confirmDelete = confirm('Are you sure you want to delete this task?');
  if (confirmDelete) {
    // remove by index
    tasks.splice(clickedTaskIndex, 1);
    showTasks();
  }
  hideMenu();
});

function hideMenu(): void {
  if (!menu) return;
  menu.style.display = 'none';
  menu.setAttribute('aria-hidden', 'true');
  clickedTaskIndex = null;
}



addBtn.addEventListener('click', addTask);
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTask();
});


showTasks();
