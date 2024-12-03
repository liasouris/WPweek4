document.getElementById('submit-data').addEventListener('click', async (event) => {
    event.preventDefault();

    const userInput = document.getElementById('userInput').value;
    const todoInput = document.getElementById('todoInput').value;
    const responseMessage = document.getElementById('response-message');

    try {
        const response = await fetch('/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: userInput, todo: todoInput }),
        });

        const message = await response.text();
        responseMessage.textContent = message;
    } catch (error) {
        responseMessage.textContent = 'Error adding todo.';
        console.error('Error adding todo:', error);
    }
});

document.getElementById('searchForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const searchInput = document.getElementById('searchInput').value;
    const searchMessage = document.getElementById('search-message');
    const todosList = document.getElementById('todos-list');

    todosList.textContent = ''; 
    searchMessage.textContent = '';

    try {
        const response = await fetch(`/todos/${searchInput}`);

        if (response.ok) {
            const todos = await response.json();

            todos.forEach((todo) => {
                const li = document.createElement('li');
                li.className = 'collection-item';

                const label = document.createElement('label');

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = 'myCheckbox';
                checkbox.className = 'checkBoxes';
                checkbox.checked = todo.checked || false; 
                checkbox.addEventListener('change', async () => {
                    await updateTodoChecked(searchInput, todo.todo, checkbox.checked);
                });

                label.appendChild(checkbox);

                const span = document.createElement('span');
                span.textContent = todo.todo; 

                label.appendChild(span);

                li.appendChild(label);
                todosList.appendChild(li);
            });

            searchMessage.textContent = `Todos for user ${searchInput}:`;
        } else {
            const message = await response.text();
            searchMessage.textContent = message;
        }
    } catch (error) {
        searchMessage.textContent = 'Error fetching todos.';
        console.error('Error fetching todos:', error);
    }
});

async function updateTodoChecked(name, todo, checked) {
    try {
        const response = await fetch('/updateTodo', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, todo, checked }),
        });

        const message = await response.text();
        console.log(message);
    } catch (error) {
        console.error('Error updating todo:', error);
    }
}

async function deleteTodo(name, todo) {
    try {
        const response = await fetch('/update', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, todo }),
        });

        const message = await response.text();
        console.log(message);
    } catch (error) {
        console.error('Error deleting todo:', error);
    }
}
