import { Router } from "express";
import { User } from "../models/User";

const router: Router = Router();

router.post("/add", async (req, res) => {
    const { name, todo } = req.body;

    try {
        let user = await User.findOne({ name: new RegExp(`^${name}$`, "i") });

        if (user) {
            user.todos.push({
                todo,
                checked: false
            });
        } else {
            user = new User({
                name,
                todos: [{ todo }],
            });
        }

        await user.save();
        res.send(`Todo added successfully for user ${name}.`);
    } catch (error) {
        console.error(`Error while adding todo: ${error}`);
        res.status(500).send("Internal server error");
    }
});

router.get("/todos/:name", async (req, res) => {
    const { name } = req.params;

    try {
        const user = await User.findOne({ name: new RegExp(`^${name}$`, "i") });

        if (user) {
            res.json(user.todos.map((t) => t.todo)); 
        } else {
            res.status(404).send("User not found");
        }
    } catch (error) {
        console.error(`Error while fetching todos: ${error}`);
        res.status(500).send("Internal server error");
    }
});

router.delete("/delete", async (req, res) => {
    const { name } = req.body;

    try {
        const result = await User.deleteOne({ name: new RegExp(`^${name}$`, "i") });

        if (result.deletedCount) {
            res.send("User deleted successfully.");
        } else {
            res.status(404).send("User not found.");
        }
    } catch (error) {
        console.error(`Error while deleting user: ${error}`);
        res.status(500).send("Internal server error");
    }
});

router.put("/update", async (req, res) => {
    const { name, todo } = req.body;

    try {
        const user = await User.findOne({ name: new RegExp(`^${name}$`, "i") });

        if (user) {
            const todoIndex = user.todos.findIndex((t) => t.todo === todo);
            if (todoIndex !== -1) {
                user.todos.splice(todoIndex, 1); 
                await user.save();
                res.send("Todo deleted successfully.");
            } else {
                res.status(404).send("Todo not found.");
            }
        } else {
            res.status(404).send("User not found.");
        }
    } catch (error) {
        console.error(`Error while deleting todo: ${error}`);
        res.status(500).send("Internal server error");
    }
});

router.put("/updateTodo", async (req, res) => {
    const { name, todo, checked } = req.body;

    try {
        const user = await User.findOne({ name: new RegExp(`^${name}$`, "i") });

        if (user) {
            const targetTodo = user.todos.find((t) => t.todo === todo);
            if (targetTodo) {
                targetTodo.checked = checked;
                await user.save();
                res.send("Todo updated successfully.");
            } else {
                res.status(404).send("Todo not found.");
            }
        } else {
            res.status(404).send("User not found.");
        }
    } catch (error) {
        console.error(`Error while updating todo: ${error}`);
        res.status(500).send("Internal server error.");
    }
});

export default router;
