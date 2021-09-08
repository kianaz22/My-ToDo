/* modal */
const closeBtn = document.querySelectorAll('.btn-close');
closeBtn.forEach(item => item.addEventListener('click', closeModal));

function closeModal() {
    modalDelete.style.display = 'none';
    modalVideo.style.display = 'none';
}
function outsideClick(e) {
    if (e.target == modalDelete || e.target == modalVideo ) {
        modalDelete.style.display = 'none';
        
    }
}
/* end of  modal */

/* video modal */
const modalVideo = document.getElementById('modal-video');
const video = document.getElementById('video');

function openModalVideo() {
    modalVideo.style.display = 'flex';
}
function getVideo() {
    openModalVideo();

    fetch("https://api.aparat.com/fa/v1/video/video/mostViewedVideos", {
        "method": "GET"})
        .then(res => res.json())
        .then(res => showVideo(res.data[0].attributes.preview_src))
        .catch(err => console.error(err))
}
function showVideo(src) {
    video.src = src;
}
/* end of video modal */

/* delete modal */
const modalDelete = document.getElementById('modal-delete');

const deleteBtn = document.getElementById('btn-delete')
deleteBtn.addEventListener('click', deleteTodo);

const cancelBtn = document.getElementById('btn-cancel')
cancelBtn.addEventListener('click', closeModal);

const modalSpan = document.getElementById("modal-span");

window.addEventListener('click', outsideClick);

function openModalDelete() {
    modalDelete.style.display = 'flex';
}
/* end of delete modal */


/* main */
let counter = 0;
let todoList = [];
const inputTodo = document.getElementById("input-todo");
const addButtonIcon = document.getElementById("btn-add-icon");
addButtonIcon.addEventListener("click", addTodo);
const ul = document.getElementById("todos-list");

getLocalStorage();

function renderTodoList() {
    ul.innerHTML = "";
    todoList.forEach(function (item) {

        const todo = document.createElement("li");
        todo.setAttribute("key", item.id)

        const checkbox = document.createElement("input")
        checkbox.setAttribute("type", "checkbox");

        const content = document.createElement("div");
        content.innerHTML = `<p>${item.text}</p><p>${item.time}</p>`

        const deleteIcon = document.createElement("i");
        deleteIcon.classList.add("fa", "fa-trash");
        deleteIcon.addEventListener("click", deleteMode);

        const editIcon = document.createElement("i");
        editIcon.classList.add("fa", "fa-pen");
        editIcon.addEventListener("click", event => editMode(parseInt(event.target.parentElement.getAttribute("key"))));

        todo.appendChild(checkbox);
        todo.appendChild(content);
        todo.appendChild(deleteIcon);
        todo.appendChild(editIcon);

        ul.appendChild(todo)
    })
}
function getLocalStorage() {
    const storedTodoList = localStorage.getItem("storedTodoList")
    if (storedTodoList) {
        todoList = JSON.parse(storedTodoList);
        renderTodoList(todoList);
    }
    const storedCounter = localStorage.getItem("storedCounter")
    if (storedCounter) {
       counter = JSON.parse(storedCounter);
    }
}
function setLocalStorage(todoList) {
    localStorage.setItem("storedTodoList", JSON.stringify(todoList));
    renderTodoList(todoList);
}
function addTodo() {
    if (inputTodo.value) {
        const randomId = Math.floor(Math.random() * 5000);
        const newTodo = { id: randomId, text: inputTodo.value, time: new Date().toLocaleString() };
        todoList.push(newTodo);
        setLocalStorage(todoList);
        inputTodo.value = "";
        check();
    }
}
function editMode(key) {
    const todo = todoList.find(item => item.id === key )
    inputTodo.value = todo.text;

    addButtonIcon.classList.remove("fa-plus");
    addButtonIcon.classList.add("fa-pen");
    addButtonIcon.setAttribute("key", key);
    addButtonIcon.removeEventListener("click", addTodo);
    addButtonIcon.addEventListener("click", editTodo);
}
function editTodo(e) {
    if (inputTodo.value) {
        todoList.forEach(function (item) {
            if (item.id === parseInt(e.target.getAttribute("key")))
                item.text = inputTodo.value;
        }
        );
        inputTodo.value = '';
        addButtonIcon.classList.remove("fa-pen");
        addButtonIcon.classList.add("fa-plus");
        addButtonIcon.removeEventListener("click", editTodo);
        addButtonIcon.addEventListener("click", addTodo);

        setLocalStorage(todoList);
    }
}
function deleteMode(e) {
    deleteBtn.setAttribute("key", e.target.parentElement.getAttribute("key"));
    modalSpan.textContent = e.target.previousElementSibling.children[0].textContent;
    openModalDelete();
}
function deleteTodo(e) {
    todoList = todoList.filter(item => item.id !== parseInt(e.target.getAttribute("key")));
    setLocalStorage(todoList);
    closeModal();
}
function check(){
    counter++;
 if (counter === 5){
     counter = 0;
     getVideo();
 }
 localStorage.setItem("storedCounter", JSON.stringify(counter));
}

/* end of main */

