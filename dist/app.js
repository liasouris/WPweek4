"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const app = (0, express_1.default)();
const PORT = 3000;
const DATA_FILE = path_1.default.join(__dirname, "../data.json");
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
const readData = async () => {
    try {
        const data = await promises_1.default.readFile(DATA_FILE, "utf8");
        return JSON.parse(data);
    }
    catch (error) {
        return [];
    }
};
const writeData = async (data) => {
    await promises_1.default.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
};
const ensureDataFileExists = async () => {
    try {
        await promises_1.default.access(DATA_FILE);
    }
    catch {
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
    }
    else {
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
    }
    else {
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
    }
    else {
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
        }
        else {
            res.status(404).send("Todo not found");
        }
    }
    else {
        res.status(404).send("User not found");
    }
    await writeData(users);
});
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
