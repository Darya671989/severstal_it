

(function() {
    function createAppTitle(title) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = title;
        return appTitle;
    }

    function createFontSelector() {
        let select = document.createElement('select');
        select.classList.add('form-select');
        
        const fonts = ['Arial', 'Courier New', 'Georgia', 'Times New Roman', 'Verdana'];
        fonts.forEach(font => {
            let option = document.createElement('option');
            option.value = font;
            option.textContent = font;
            select.appendChild(option);
        });

        select.addEventListener('change', function() {
            document.body.style.fontFamily = select.value;
        });

        return select;
    }

    function createSizeSelector() {
        let select = document.createElement('select');
        select.classList.add('form-select');

        const sizes = ['12px', '14px', '16px', '18px', '20px', '22px'];
        sizes.forEach(size => {
            let option = document.createElement('option');
            option.value = size;
            option.textContent = size;
            select.appendChild(option);
        });
        
        select.addEventListener('change', function() {
            document.body.style.fontSize = select.value;
        });

        return select;
    }

    function createTodoItemForm() {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let button = document.createElement('button');

        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder = 'Введите задачу';
        input.id = 'todo-input'; 

        button.classList.add('btn', 'btn-primary');
        button.textContent = 'Добавить';

        form.append(input);
        form.append(button);
        return { form, input, button };
    }

    function createTodoList() {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    }

    function createTodoItem(name, onEdit) {
        let item = document.createElement('li');
        let editButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        item.classList.add('list-group-item');
        item.textContent = name;

        editButton.classList.add('btn', 'btn-warning');
        editButton.textContent = 'Редактировать';

        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';


        editButton.addEventListener('click', function() {
            onEdit(name);
        });

        item.append(editButton);
        item.append(deleteButton);
        return { item, deleteButton };
    }

    function saveTasksToLocalStorage(tasks) {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasksFromLocalStorage() {
        return JSON.parse(localStorage.getItem('tasks')) || [];
    }

    function removeTaskFromLocalStorage(task) {
        let tasks = loadTasksFromLocalStorage();
        tasks = tasks.filter(t => t !== task);
        saveTasksToLocalStorage(tasks);
    }

    function createTodoApp(container, title = 'Заметки') {
        let todoAppTitle = createAppTitle(title);
        let fontSelector = createFontSelector();
        let sizeSelector = createSizeSelector();
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();


        container.append(fontSelector);
        container.append(sizeSelector);
        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);

        loadTasksFromLocalStorage().forEach(task => {
            addTaskToDOM(task);
        });

        todoItemForm.form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (!todoItemForm.input.value) return;

            const task = todoItemForm.input.value;
            addTaskToDOM(task);
            todoItemForm.input.value = '';

            let tasks = loadTasksFromLocalStorage();
            tasks.push(task);
            saveTasksToLocalStorage(tasks);
        });

        function addTaskToDOM(task) {
            let todoItem = createTodoItem(task, editTask);
            todoList.append(todoItem.item);

            todoItem.deleteButton.addEventListener('click', function() {
                if (confirm('Вы уверены?')) {
                    todoItem.item.remove();
                    removeTaskFromLocalStorage(task); 
                }
            });
        }

        function editTask(taskToEdit) {
            todoItemForm.input.value = taskToEdit;

            let tasks = loadTasksFromLocalStorage();
            tasks = tasks.filter(t => t !== taskToEdit);
            saveTasksToLocalStorage(tasks);

            const existingItems = Array.from(todoList.children);
            existingItems.forEach(item => {
                if (item.textContent.includes(taskToEdit)) {
                    item.remove();
                }
            });
        }
    }

    const appContainer = document.getElementById('todo-app');
    createTodoApp(appContainer);
})();