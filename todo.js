// todo.ts
var tasks = [];
// DOM elements
var input = document.getElementById('taskInput');
var addBtn = document.getElementById('addBtn');
var container = document.getElementById('taskContainer');
var menu = document.getElementById('menu');
var editOption = document.getElementById('editOption');
var doneOption = document.getElementById('doneOption');
var deleteOption = document.getElementById('deleteOption');
var clickedTaskIndex = null;
// safety: ensure elements exist
if (!input || !addBtn || !container || !menu || !editOption || !doneOption || !deleteOption) {
    throw new Error('Missing required DOM elements. Make sure index.html includes all elements with correct IDs.');
}
function showTasks() {
    if (tasks.length === 0) {
        container.innerHTML = '<p>No Tasks Yet</p>';
        return;
    }
    var listHTML = '<ol>';
    for (var i = 0; i < tasks.length; i++) {
        var task = tasks[i];
        var doneStyle = task.done ? 'style="text-decoration: line-through; color: gray;"' : '';
        // data-index to identify which task
        listHTML += "<li data-index=\"".concat(i, "\" ").concat(doneStyle, ">").concat(escapeHtml(task.text), "</li>");
    }
    listHTML += '</ol>';
    container.innerHTML = listHTML;
    // add click listener to each <li>
    var allTasks = container.querySelectorAll('li');
    allTasks.forEach(function (li) {
        li.addEventListener('click', function (event) { return showMenu(event, li); });
    });
}
// add a new task
function addTask() {
    var newTask = input.value.trim();
    if (newTask === '') {
        alert('Please enter a valid task.');
        return;
    }
    var todo = { id: Date.now(), text: newTask, done: false };
    tasks.push(todo);
    input.value = '';
    showTasks();
}
// show menu near mouse for a specific li
function showMenu(event, li) {
    event.preventDefault();
    event.stopPropagation(); // prevent document click handler from immediately hiding
    var idxStr = li.getAttribute('data-index');
    if (idxStr === null)
        return;
    clickedTaskIndex = parseInt(idxStr, 10);
    // position menu and show
    if (menu) {
        menu.style.display = 'block';
        // basic position: try to keep menu inside viewport (simple clamp)
        var pageX = event.pageX;
        var pageY = event.pageY;
        menu.style.left = "".concat(pageX, "px");
        menu.style.top = "".concat(pageY, "px");
        menu.setAttribute('aria-hidden', 'false');
    }
}
// hide menu when clicking outside it
document.addEventListener('click', function (event) {
    if (!menu)
        return;
    var target = event.target;
    if (!menu.contains(target)) {
        menu.style.display = 'none';
        menu.setAttribute('aria-hidden', 'true');
        clickedTaskIndex = null;
    }
});
// Edit
editOption.addEventListener('click', function () {
    if (clickedTaskIndex === null)
        return;
    var old = tasks[clickedTaskIndex].text;
    var newText = prompt('Edit your task:', old);
    if (newText !== null) {
        var trimmed = newText.trim();
        if (trimmed !== '') {
            tasks[clickedTaskIndex].text = trimmed;
            showTasks();
        }
        else {
            alert('Task cannot be empty.');
        }
    }
    hideMenu();
});
// Toggle done
doneOption.addEventListener('click', function () {
    if (clickedTaskIndex === null)
        return;
    tasks[clickedTaskIndex].done = !tasks[clickedTaskIndex].done;
    showTasks();
    hideMenu();
});
// Delete
deleteOption.addEventListener('click', function () {
    if (clickedTaskIndex === null)
        return;
    var confirmDelete = confirm('Are you sure you want to delete this task?');
    if (confirmDelete) {
        // remove by index
        tasks.splice(clickedTaskIndex, 1);
        showTasks();
    }
    hideMenu();
});
function hideMenu() {
    if (!menu)
        return;
    menu.style.display = 'none';
    menu.setAttribute('aria-hidden', 'true');
    clickedTaskIndex = null;
}
// helper: escape HTML to avoid injection if user types < or >
function escapeHtml(text) {
    return text.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
// wire add button and 'Enter' key
addBtn.addEventListener('click', addTask);
input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter')
        addTask();
});
// initial render
showTasks();
