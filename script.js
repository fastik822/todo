// поле для ввода новой задачи
const addTodoInput = document.querySelector('.add-todo-input');
// кнопка добавления новой задачи
const addTodoButton = document.querySelector('.add-todo-button');
// блок с задачами, куда будет вставляться новая задача
const todoListBlock = document.querySelector('.todo-list-block');


// Список задач
let todoList = [];


window.addEventListener("load", () =>{

    loadFromLocalStorage();
    renderTodoBlock();
});

addTodoButton.addEventListener("click", () => {

    let todoTitle = addTodoInput.value;

    if(todoTitle.length == 0)
        return;

    let todoObject = createTodoObject(todoTitle);

    todoList.push(todoObject);

    let todoElement = getTodoElement(todoObject);

    todoListBlock.appendChild(todoElement);

    saveToLocalStorage();
});

// Из объекта todo сделать элемент div
function getTodoElement(todoObject){

    let isEditing = false;

    // Генерируемый блок
    const todoElement = document.createElement('div');

    todoElement.classList.add('todo-block');

    // Если задача выполнена - добавляем класс выполненности
    if(todoObject.isCompleted)
        todoElement.classList.add('todo-completed');

    // Даем специфический аттрибут элементу, айди задачи
    todoElement.setAttribute('todo-id', todoObject.id);

    todoElement.innerHTML = `
        <div>
            <input type="checkbox" class="todo-checkbox">
            <p class="todo-title">${todoObject.title}</p>
            <input type="text" class="todo-edit-input hidden">
        </div>

        <div>
            <button class="icon-button todo-edit-button">
                <i class="fa-solid fa-pen-to-square" style="color: #5b5b5b;"></i>
            </button>

   
            <button class="icon-button todo-delete-button">
                <i class="fa-solid fa-trash" style="color: #5b5b5b;"></i>
            </button>
        </div>
    `;

    // Элементы внутри ТЕКУЩЕГО блока todo
    const todoCheckbox = todoElement.querySelector('.todo-checkbox');
    const todoEditButton = todoElement.querySelector('.todo-edit-button');
    const todoDeleteButton = todoElement.querySelector('.todo-delete-button'); 
    const todoTitleElement = todoElement.querySelector(".todo-title");
    const todoEditInput = todoElement.querySelector(".todo-edit-input");


    // Если задача выполнена - нажимаем на галочку
    if(todoObject.isCompleted)
        todoCheckbox.checked = true;

    // Событие на нажатие удаление задачи
    todoDeleteButton.addEventListener('click', () => {
        todoElement.remove();

        todoList = todoList.filter(item => {

            return item !== todoObject;
        });

        saveToLocalStorage();
    });

    todoCheckbox.addEventListener("click", () => {

        todoObject.isCompleted = todoCheckbox.checked;

        todoElement.classList.toggle("todo-completed")

        saveToLocalStorage();
    });

    todoEditButton.addEventListener("click", () => {

        isEditing = !isEditing;

        if(isEditing){
            todoTitleElement.classList.add("hidden");
            todoEditInput.classList.remove("hidden");

            todoEditInput.value = todoTitleElement.innerText;
        }
        else{
            todoEditInput.classList.add("hidden");
            todoTitleElement.classList.remove("hidden");
            
            todoTitleElement.innerText = todoEditInput.value;

            todoObject.title = todoTitleElement.innerText;

            saveToLocalStorage();
        }

    });

    return todoElement;
}

function renderTodoBlock(){

    todoListBlock.innerHTML = "";

    todoList.forEach(todoObject => {

       let todoElement = getTodoElement(todoObject);
        
       todoListBlock.appendChild(todoElement);
    });
}

function createTodoObject(todoTitle){

    let todoId = (Math.random() + 1).toString(36).substring(7);

    return {

        id: todoId,
        title: todoTitle,
        isCompleted: false
    };
}

function saveToLocalStorage(){

    let json = JSON.stringify(todoList);
    localStorage.setItem("todos",json);
}

function loadFromLocalStorage(){

    let json = localStorage.getItem("todos");
    if(json == null)
        return;

    todoList = JSON.parse(json);
}