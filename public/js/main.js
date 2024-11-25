// Handle adding a todo
document.getElementById('submit-data').addEventListener('click', async (event) => {
    event.preventDefault();

    const userInput = document.getElementById('userInput').value;
    const todoInput = document.getElementById('todoInput').value;
    const responseMessage = document.getElementById('response-message');

    const response = await fetch('/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: userInput, todo: todoInput })
    });

    const message = await response.text();
    responseMessage.textContent = message;
});

// Handle searching for a user and displaying their todos
document.getElementById('searchForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const searchInput = document.getElementById('searchInput').value;
    const searchMessage = document.getElementById('search-message');
    const todosList = document.getElementById('todos-list');

    todosList.textContent = "";
    const deleteButton = document.getElementById('deleteUser');
    if (deleteButton) deleteButton.remove();

    const response = await fetch(`/todos/${searchInput}`);

    if (response.ok) {
        const todos = await response.json();

        todos.forEach(todo => {
            const li = document.createElement('li');
            const todoLink = document.createElement('a');
            todoLink.textContent = todo;
            todoLink.href = "#";
            todoLink.classList.add('delete-task');
            li.appendChild(todoLink);
            todosList.appendChild(li);
        });

        searchMessage.textContent = `Todos for user ${searchInput}:`;

        const newDeleteButton = document.createElement('button');
        newDeleteButton.id = 'deleteUser';
        newDeleteButton.textContent = 'Delete User';
        document.body.appendChild(newDeleteButton);

        newDeleteButton.addEventListener('click', async () => {
            const deleteResponse = await fetch('/delete', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: searchInput })
            });

            const deleteMessage = await deleteResponse.text();
            searchMessage.textContent = deleteMessage;

            if (deleteResponse.ok) {
                todosList.textContent = "";
                newDeleteButton.remove();
            }
        });
    } else {
        const message = await response.text();
        searchMessage.textContent = message;
    }
});

document.getElementById('todos-list').addEventListener('click', async (event) => {
    if (event.target.classList.contains('delete-task')) {
        event.preventDefault();

        const searchInput = document.getElementById('searchInput').value;
        const todo = event.target.textContent;

        const response = await fetch('/update', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: searchInput, todo })
        });

        const message = await response.text();
        document.getElementById('search-message').textContent = message;

        if (response.ok) {
            event.target.parentElement.remove();
        }
    }
});
