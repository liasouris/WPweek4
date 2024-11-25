import express from "express";
import path from "path";
import fs from "fs/promises";

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, "../data.json");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

type TUser = {
    name: string;
    todos: string[];
};

const readData = async (): Promise<TUser[]> => {
    try {
        const data = await fs.readFile(DATA_FILE, "utf8");
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

const writeData = async (data: TUser[]): Promise<void> => {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
};


const ensureDataFileExists = async (): Promise<void> => {
    try {
        await fs.access(DATA_FILE);
    } catch {
        await writeData([]);
    }
};

ensureDataFileExists();

app.post("/add", async (req, res) => {
    const { name, todo } = req.body;
    const users = await readData();

    const existingUser = users.find(user => user.name.toLowerCase() === name.toLowerCase());

    if (existingUser) {
        existingUser.todos.push(todo);
        res.send(`Todo added successfully for user ${name}.`);
    } else {
        users.push({ name, todos: [todo] });
        res.send(`Todo added successfully for user ${name}.`);
    }

    await writeData(users);
});

app.get("/todos/:id", async (req, res) => {
    const { id } = req.params;
    const users = await readData();
    const user = users.find(user => user.name.toLowerCase() === id.toLowerCase());

    if (user) {
        res.json(user.todos);
    } else {
        res.status(404).send("User not found");
    }
});

app.delete("/delete", async (req, res) => {
    const { name } = req.body;
    let users = await readData();

    const userIndex = users.findIndex(user => user.name.toLowerCase() === name.toLowerCase());

    if (userIndex !== -1) {
        users.splice(userIndex, 1);
        res.send("User deleted successfully.");
    } else {
        res.status(404).send("User not found");
    }

    await writeData(users);
});

app.put("/update", async (req, res) => {
    const { name, todo } = req.body;
    const users = await readData();

    const user = users.find(user => user.name.toLowerCase() === name.toLowerCase());

    if (user) {
        const todoIndex = user.todos.indexOf(todo);
        if (todoIndex !== -1) {
            user.todos.splice(todoIndex, 1);
            res.send("Todo deleted successfully.");
        } else {
            res.status(404).send("Todo not found");
        }
    } else {
        res.status(404).send("User not found");
    }

    await writeData(users);
});

app.use(express.static(path.join(__dirname, "../public")));


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
